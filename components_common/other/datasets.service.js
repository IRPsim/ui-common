'use strict';

/**
 * @ngdoc service
 * @name irpsimApp.Datasets
 * @description
 * # Datasets
 * This service takes care of all master data ("Stammdaten") as well as datasets ("Datensätze").
 */
angular.module('uiCommon')
    .service('Datasets', function ($q, $http) {
        var Datasets = this;

        ///////////////////// Stammdaten //////////////////////////////////////////////////////////////
        Datasets.resolutions = [
            // length: number of entries per year, interval: average length of one time interval in hours
            {value: 'YEAR', label: 'Jahr', length: 1, interval: 365 * 24 * 60},
            {value: 'MONTH', label: 'Monate', length: 12, interval: 30 * 24},
            {value: 'WEEK', label: 'Wochen', length: 52, interval: 7 * 24},
            {value: 'DAY', label: 'Tage', length: 365, interval: 24},
            {value: 'HOUR', label: 'Stunden', length: 365 * 24, interval: 1},
            {value: 'QUARTERHOUR', label: '15min', length: 364 * 24 * 4, interval: 0.25}
        ];

        // names of all master data properties in JSON objects
        Datasets.properties = [
            'name', 'typ', 'bezugsjahr', 'prognoseHorizont', 'zeitintervall', 'standardszenario', 'abstrakt',
            'verantwortlicherBezugsjahr.name', 'verantwortlicherBezugsjahr.email',
            'verantwortlicherPrognosejahr.name', 'verantwortlicherPrognosejahr.email'
        ];

        Datasets.byType = function (type) {
            return _.find(Datasets.resolutions, function (ds) {
                return ds.value === type;
            });
        };

        Datasets.createNewMasterData = function () {
            return angular.copy({
                name: null,
                typ: null,
                abstrakt: false,
                bezugsjahr: null,
                prognoseHorizont: null,
                verantwortlicherBezugsjahr: {
                    name: null,
                    email: null
                },
                verantwortlicherPrognosejahr: {
                    name: null,
                    email: null
                },
                zeitintervall: 'QUARTERHOUR',
                standardszenario: false,
                setName1: null,
                setName2: null,
                setElemente1: [],
                setElemente2: []
            });
        };

        /**
         * Create a clone of a master data entry. Does not deep copy reference to abstract parent.
         * @param {Object} obj master data entry
         */
        Datasets.cloneMasterData = function (md) {
            var obj = _.clone(md);
            // _.clone is shallow, so we need to create explicit copies of arrays that we want to change
            // we explicitely do not copy parents and 'szenarien', both are not meant to be edited directly
            obj.setElemente1 = md.setElemente1.slice();
            obj.setElemente2 = md.setElemente2.slice();
            obj.verantwortlicherBezugsjahr = _.clone(md.verantwortlicherBezugsjahr);
            obj.verantwortlicherPrognosejahr = _.clone(md.verantwortlicherPrognosejahr);
            return obj;
        };

        /**
         * Replace entry with the same id as entry, then add entry to our list of master data entries.
         * @param {Object} entry master data entry
         */
        function addOrReplace(entry) {
            var idx = _.findIndex(Datasets.data, function (obj) {
                return obj.id === entry.id;
            });
            if (idx > -1) {
                Datasets.data.splice(idx, 1);
            }
            Datasets.data.push(entry);
            resolveReferences(Datasets.data); // update parent references
        }

        /**
         * Save a new/updated master data entry.
         * @param {Object} entry Stammdatum
         * @returns {Promise}
         */
        Datasets.save = function (entry) {
            var parent;
            if (entry.parent) {
                entry.referenz = entry.parent.id;
                parent = entry.parent;
                delete entry.parent;
            }else{
              entry.referenz = null;
            }
            function finishEdit(response) {
                if (parent) {
                    entry.referenz = parent.id;
                } else {
                    entry.referenz = null;
                }
                if (response && Array.isArray(response.data)) {
                    entry.id = response.data[0];
                }
                addOrReplace(entry);
            }

            if (entry.id === undefined || entry.id === null) { // are we saving a new entry?
                return $http.put('/backend/simulation/stammdaten', entry)
                    .then(function (response) {
                        entry.id = response.data[0];
                    })
                    .then(finishEdit);
            } else {
                return $http.put('/backend/simulation/stammdaten/' + entry.id, entry)
                    .then(finishEdit);
            }
        };

        /**
         * Delete a master data entry, locally and remote. Backend will make sure to also delete all datasets related to this master data.
         * @param {Object} entry Stammdatum
         */
        Datasets.delete = function (entry) {
          return $http.delete('/backend/simulation/stammdaten/' + entry.id).then(function success() {
            // delete locally cached datasets
            _.forEach(datasetsByMasterDataId[entry.id],function(id){
              delete masterDataIdByDatasetId[id];
            });
            delete datasetsByMasterDataId[entry.id];
            // delete locally cached master data entries
            var idx = Datasets.data.indexOf(entry);
            if (idx > -1) {
              Datasets.data.splice(idx, 1);
            }
          });
        };


        function resolveReferences(data) {
            var byId = _.groupBy(data, 'id');
            _.forEach(data, function (entry) {
                entry.parent = byId[entry.referenz];
                if (Array.isArray(entry.parent)) {
                    entry.parent = entry.parent[0];
                }
            });
        }

        /**
         * Is there any ancestor of the stammdatum with the id given?
         * @param {Object} obj stammdatum
         * @param {String} id id to look for
         */
        function hasAncestor(obj, id) {
            return obj && (obj.id === id || hasAncestor(obj.parent, id));
        }

        Datasets.hasDescendants = function (entry) {
            var res = _.find(Datasets.data, function (obj) {
                return obj.id !== entry.id && hasAncestor(obj, entry.id);
            });
            return res !== null && res !== undefined;
        };

        /**
         * Each master data object either has a value for each property or one of its ancestors does.
         * @param {Object} obj current master data object
         * @param {String} property name of the property
         * @returns {*} view value
         */
        function v(obj, property) {
          if (!obj) {
            return;
          }
          var value = _.get(obj, property);
          if (value === undefined ||
            value === null ||
            value === '' || // backend tends to introduce empty strings when editing null references
            (angular.isArray (value) && value.length === 0)) {
              return v(obj.parent, property);
            } else {
            return value;
          }
        }

        Datasets.isComplete = function (obj) {
          for (var i = 0; i < Datasets.properties.length; i++) {
            var property = Datasets.properties[i];
            var value = v(obj, property);
            if (value === undefined || value === null) {
              return false;
            }
          }
          return true;
        };
        Datasets.getValue = v;

        ///////////////////// Datensätze //////////////////////////////////////////////////////////////

        Datasets.getDatasets = function (masterDataId) {
            return datasetsByMasterDataId[masterDataId];
        };

        Datasets.getDataset = function (masterDataId, scenario, year) {
            return _.find(datasetsByMasterDataId[masterDataId], {szenario: _.isNumber(scenario)? scenario: scenario.stelle, jahr: year});
        };

        Datasets.getMasterData = function(masterDataId){
          return _.find(Datasets.data, {id: masterDataId});
        };

        /**
         *  - find master data for current dataset
         * - find forcast scenario used in current dataset
         * - find new dataset for current year
         * @param {string} datasetId id of the predecessor dataset
         * @param {integer} year the number of the new year we should use to look up the new dataset
         */
        Datasets.findNextLogicalDataset = function (datasetId, year, scenario) {
            // if we have a number (scalar value) or an array (user defined timeseries) we keep using this fixed value
            if (typeof datasetId === 'number' || Array.isArray(datasetId)) {
                return {
                    value: datasetId,
                    severity: 'info',
                    text: 'Behalte manuell eingegebenen Datensatz.'
                };
            }
            // find master data
            var masterDataId = masterDataIdByDatasetId[datasetId];
            // identify year and forecast scenario used
            var origDataset = _.find(datasetsByMasterDataId[masterDataId], {seriesid: datasetId});
            if (!origDataset) {
                return {
                    //severity: 'warning',
                    value: datasetId
                    //text: 'Kein Stammdatum gefunden, behalte aktuellen Wert.'
                };
            } else {
                // find best dataset for year (either the fitting dataset of the same masterdata or keep the current datasetId and signal a warning)
                scenario = scenario || origDataset.szenario;
                var nextDataset = Datasets.getDataset(masterDataId, scenario, year);
                if (!nextDataset) {
                    return {
                        severity: 'warning',
                        value: datasetId,
                        text: 'Kein Nachfolger für das Jahr ' + year + ' konnte gefunden werden, behalte aktuellen Wert.'
                    };
                } else {
                    return {
                        severity: 'success',
                        text: 'Neuen Datensatz für das Jahr ' + year + ' ausgewählt',
                        value: nextDataset.seriesid
                    };
                }
            }
        };
        //////////////////// Scenario Sets ////////////////////////////////////////////////////////////
        Datasets.loadScenarioSets = function () {
            return $http.get('/backend/simulation/szenariosets').then(function (res) {
                Datasets.scenarioSets = res.data;
                return res.data;
            });
        };
        Datasets.getScenarioSet = function (year) {
            for (var i = 0; i < Datasets.scenarioSets.length; i++) {
                var ss = Datasets.scenarioSets[i];
                if (ss.jahr === year) {
                    return ss['szenarien'];
                }
            }
        };

      /**
       * find all set element names from master data filters ("setElemente1' and "setElemente2'), these may be relevant for vertical pulling
       * @param {Object} data all master data objects
       * @returns {*}
       */
        Datasets.identifyVerticalPullableElements = function(initialYear){
          return _(Datasets.data)
            .filter(function (obj) {
              return v(obj, 'bezugsjahr') === initialYear &&
                ((v(obj,'setName1') && !_.isEmpty(v(obj,'setElemente1'))) ||
                (v(obj,'setName2') && !_.isEmpty(v(obj,'setElemente2'))));
            })
            .reduce(function(res, obj){
              if(obj.setName1){
                _.forEach(v(obj,'setElemente1'),function(elem){
                  res.push({member: elem, set:v(obj,'setName1')});
                });
              }
              if(obj.setName2){
                _.forEach(v(obj,'setElemente2'),function(elem){
                  res.push({member: elem, set:v(obj,'setName2')});
                });
              }
              return _.uniq(res,'member');
            },[]);
        }
        /////////////////// initial data fetching /////////////////////////////////////////////////////
        // fetch all data, create necessary lookup structures
        // we will probably never have that many different datasets, so we can afford to cache them all in the client
        Datasets.data = [];
        var datasetsByMasterDataId = {};
        var masterDataIdByDatasetId = {};

        /**
         * Fetch all master data entries and all dataset metadata. Create lookup data structures.
         * @returns {*|Promise} promise that will be resolved as soon as all data is available
         */
        Datasets.fetchAll = function () {
            var deferred = $q.defer();
            // fetch all datasets and master data
            var promises = [
                $http.get('/backend/simulation/szenariosets'),
                $http.get('/backend/simulation/stammdaten?all=true'),
                $http.get('/backend/simulation/datensatz')
            ];
            $q.all(promises).then(function success(responses) {
                // set scenario sets
                Datasets.scenarioSets = responses[0].data;
                // set datasets
                resolveReferences(responses[1].data);
                Datasets.data = responses[1].data;
                // set datasets by master data id
                datasetsByMasterDataId = responses[2].data;
                // set master data id by dataset id
                for (var masterDataId in datasetsByMasterDataId) {
                    datasetsByMasterDataId[masterDataId].forEach(function (dataset) {
                        masterDataIdByDatasetId[dataset.seriesid] = masterDataId;
                    });
                }
                // resolve promise
                deferred.resolve(Datasets);
            }, function error(err) {
                deferred.reject(err);
            });

            return deferred.promise;
        };
        Datasets.initialDataPromise = Datasets.fetchAll();//fetch all known master data entries on load
    });
