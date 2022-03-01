'use strict';

angular.module('uiCommon', []);
angular.module("uiCommon").run(["$templateCache", function($templateCache) {$templateCache.put("components_common/charts/zoomable-3d-chart.html","<div id=\"plotly\"></div>\n\n<div>\n    <label for=\"slider1\" >Minimum: {{currentMin}}\n        <input id=\"slider1\" type=\"range\" min=\"{{range[0]}}\" max=\"{{currentMax}}\" step=\"{{(currentMax - range[0]) / 100}}\"\n               ng-model=\"currentMin\"\n               style=\"width:300px\"\n               ng-change=\"setMin(currentMin)\">\n    </label>\n\n    <label for=\"slider2\">Maximum: {{currentMax}}\n        <input id=\"slider2\" type=\"range\" min=\"{{currentMin}}\" max=\"{{range[1]}}\" step=\"{{(range[1] - currentMin) / 100}}\"\n               ng-model=\"currentMax\"\n               style=\"width:300px\"\n               ng-change=\"setMax(currentMax)\">\n    </label>\n</div>\n\n\n\n");
$templateCache.put("components_common/charts/zoomable-chart.html","<div style=\"width:100%; margin-bottom: 10px; margin-top:10px; page-break-inside: avoid\">\n  <div class=\"graph\" style=\"margin-bottom: 0; width:100%\">\n    <!--ng-if=\"!isforprint\"-->\n  </div>\n  <div ng-show=\"open\"\n       style=\"position:absolute; background-color:white; z-index:20; right: 0; top: 0; border: 1px solid lightgrey;box-shadow: -2px 2px 5px grey;\">\n\n    <div class=\"btn-group btn-group-sm\"\n         style=\"margin-left: 20px; margin-right: 50px; margin-top:10px; margin-bottom:10px\">\n      <button type=\"button\" class=\"btn btn-default\">{{selectedAggregationType}}</button>\n      <button class=\"btn btn-default dropdown-toggle\"\n              type=\"button\"\n              data-toggle=\"dropdown\">\n        <span class=\"caret\"></span>\n        <span class=\"sr-only\"></span>\n      </button>\n      <ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"dropdownType\">\n        <li role=\"presentation\"><a ng-click=\"select(\'\')\">keine Aggregation</a></li>\n        <li role=\"presentation\"><a ng-click=\"select(\'sum\')\">Summe</a></li>\n        <li role=\"presentation\"><a ng-click=\"select(\'average\')\">Durchschnitt</a></li>\n        <li role=\"presentation\" ng-repeat=\"perc in percentiles\"><a ng-click=\"selectPercentiles(perc)\">Perzentil\n          {{perc[0]}}% | {{perc[1]}}% | {{perc[2]}}%</a></li>\n      </ul>\n    </div>\n  </div>\n\n  <span class=\"fa fa-cog fa-hover hidden-print\" style=\"position: absolute; right: 10px; top: 10px; z-index: 21;\"\n        ng-style=\"open && {opacity: 0.7}\" ng-class=\"{ \'fa-spin\': rotate}\" ng-click=\"openOpts()\"></span>\n  <span class=\"fa fa-save fa-hover hidden-print\"\n        style=\"position: absolute; right: 10px; top: 30px; z-index: 21;\" ng-style=\"open && {opacity: 0.7}\"\n        ng-click=\"saveChartToPng()\"\n        title=\"Speichern\"\n    ></span>\n</div>\n");
$templateCache.put("components_common/other/filepersistence.html","<download class=\"hidden-print\"\n          data=\"data\"\n          content-type=\"{{contentType}}\"\n          filename=\"{{filename}}\">\n  <span class=\"glyphicon glyphicon-floppy-save\"></span>\n</download>\n<button class=\"btn btn-default btn-file\">\n  <span class=\"glyphicon glyphicon-floppy-open\"></span>\n  <input  type=\"file\" on-read-file=\"loadFile($fileContent)\">\n</button>\n");
$templateCache.put("components_common/fixed-nav/fixed-nav-panel.html","<button ng-class=\"{iconFixedRight: !open,\n                   iconSelected: open && active,\n                   iconNotSelected: open && !active}\"\n        style=\"top: {{33*id + \'px\'}}; z-index: 601\"\n        class=\"btn iconBasic\"\n        ng-click= \"setActive()\"\n        uib-tooltip=\"{{tooltipText}}\"\n        tooltip-placement=\"left\">\n  <span class=\"{{icon}}\" title=\"{{title}}\"></span>\n</button>\n<div ng-if=\"destroy\">\n  <div class=\"fixedPanel\"\n       ng-if=\"active\"\n       ng-style=\"{\'z-index\': 15,\n                height: height}\">\n    <div class=\"wrappedPanelDiv\" style=\"height: calc(100% - 20px)\" ng-transclude></div>\n  </div>\n</div>\n<div ng-if=\"!destroy\">\n  <div class=\"fixedPanel\"\n       ng-show=\"active\"\n       ng-style=\"{\'z-index\': 15,\n                height: height}\">\n    <div class=\"wrappedPanelDiv\" style=\"height: calc(100% - 20px)\" ng-transclude></div>\n  </div>\n</div>\n\n\n");
$templateCache.put("components_common/fixed-nav/fixed-nav-right.html","<div ng-class=\"{closedNavBar: !open, openNavBar: open }\"\n     ng-style=\"{width: open ? width : \'33px\',\n                top: top}\">\n\n  <div ng-transclude></div>\n\n</div>\n");}]);
'use strict';

/**
 * @ngdoc service
 * @name uiCommon.ChartDefaultOptions
 * @description
 * # ChartDefaultOptions
 * Value in the uiCommon.
 */
angular.module('uiCommon')
  .factory('ChartDefaultOptions', function($filter){

    var df = $filter('date');
    var dateFormat = function(date){ return df(date,'dd.MM HH:mm');};
    var nf = $filter('number');
    var numberFormat = function(v){return nf(v,2);};

    return {
      labels: ['', ''],
      legend: true,
      showLabelsOnHighlight: true,
      hideOverlayOnMouseOut: true,
      yLabelWidth: 50,
      axisLabelWidth: 100,
      includeZero: true,
      stepPlot: true,
      colors: ['#428bca','#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5','#1f77b4', '#aec7e8', '#ff7f0e'],
      axes: {
        x: {
          axisLabelFormatter: dateFormat,
          valueFormatter: dateFormat,
          drawXAxis: true,
          pixelsPerLabel: 85
        },
        y: {
          axisLabelFormatter: numberFormat,
          valueFormatter: numberFormat
          //axisLabelWidth: 0
        }
      }
    };
  });

'use strict';

/**
 * @ngdoc service
 * @name uiCommon.PrintService
 * @description
 * # PrintService
 * Service in the uiCommon.
 */
angular.module('uiCommon')
  .service('PrintService', function() {


    var printer = {};
    printer.scopes = [];

    printer.addChart =  function(scope){
      printer.scopes.push(scope);
    };

    printer.print =  function(){
      angular.forEach(printer.scopes, function(scope){
        scope.print();
      });
    };

    return printer;

  });

'use strict';

/**
 * @ngdoc service
 * @name uiCommon.TimeseriesFetcher
 * @description
 * # TimeseriesAggregators
 * Service in the uiCommon.
 */
angular.module('uiCommon')
  .service('TimeseriesAggregators', function TimeseriesFetcher() {

    var TimeseriesAggregators = this;

    TimeseriesAggregators.sum = function(){
      return {
        aggregate: function(timesAndValues) {
          var results = [];
          var lastValues = timesAndValues[0];

          for (var i = 0; i < timesAndValues.length; i++) {
            var timeAndValues = timesAndValues[i];
            var entry = [0, 0, 0];

            for (var j = 1; j < timeAndValues.length; j++) {
              var tmp = timeAndValues[j];
              if(tmp){
                lastValues[j] = tmp;
              }else{
                tmp = lastValues[j];
              }
              entry[0] += tmp[0];
              entry[1] += tmp[1];
              entry[2] += tmp[2];
            }
            results.push([timeAndValues[0],entry]);
          }
          return results;
        },
        modifyOptions: function(chartOptions){
          chartOptions.labels = [chartOptions.labels[0], 'Summe aller Zeitreihen'];
          return chartOptions;
        }
      };
    };

    TimeseriesAggregators.percentiles = function(percentiles){
      return {
        aggregate: function(timesAndValues) {
          var results = [];
          var lastValues = timesAndValues[0];

          for (var i = 0; i < timesAndValues.length; i++) {
            var timeAndValues = timesAndValues[i];
            var entry = [timeAndValues[0]];

            //we only care about the average value, not the extrema
            var sortedValues = [];
            for (var j = 0; j < percentiles.length; j++) {
              var percentage = percentiles[j];
              //first: sort values
              for (var k = 1; k < timeAndValues.length; k++) {
                var tmp = timeAndValues[k];
                if(tmp){
                  lastValues[k] = tmp;
                }else{
                  tmp = lastValues[k];
                }
                var v = tmp[1];// take average value
                if (percentage === 0) {
                  v = tmp[0]; // take minimum value
                } else if (percentage === 100) {
                  v = tmp[2]; //take maximum value
                }
                sortedValues.push(v);
              }
              sortedValues.sort(function (a, b) {
                return a - b;
              });
              //second: calculate Percentile
              var index = percentage / 100 * sortedValues.length; //see http://en.m.wikipedia.org/wiki/Percentile#The_Nearest_Rank_method
              index = Math.floor(index) + 1;
              entry.push(sortedValues[index - 1]);
            }
            results.push(entry);
          }
          return results;
        },
        modifyOptions: function(chartOptions){
          var labels = [chartOptions.labels[0]];
          for (var i = 0; i < percentiles.length; i++) {
            var p = percentiles[i];
            labels.push(p+'%');
          }
          chartOptions.labels = labels;
          chartOptions.customBars = false;
          return chartOptions;
        }
      };
    };

    TimeseriesAggregators.average = function(){
      var sumAggregator = TimeseriesAggregators.sum();
      return {
        aggregate: function(timeAndValues) {
          if(timeAndValues.length > 0){
            var n = timeAndValues[0].length-1;
            var entries = sumAggregator.aggregate(timeAndValues);
            for (var i = 0; i < entries.length; i++) {
              var entry = entries[i];
              entry[1][0]/=n;
              entry[1][1]/=n;
              entry[1][2]/=n;
            }
            return entries;
          }
          return [];
        },
        modifyOptions: function(chartOptions){
          chartOptions.labels = [chartOptions.labels[0], 'Durchschnitt aller Zeitreihen'];
          return chartOptions;
        }
      };
    };
  });

'use strict';

/**
 * @ngdoc service
 * @name uiCommon.TimeseriesFetcher
 * @description
 * # TimeseriesFetcher
 * Service in the uiCommon.
 */
angular.module('uiCommon')
    .service('TimeseriesFetcher', function TimeseriesFetcher($filter, $http, $q, Datasets, $cacheFactory) {

        var cache = $cacheFactory('httpRequestsCache', {capacity: 200}); // LRU cache for all GET requests

        /*
         This method returns a provider for fetching data from a dataset without (!) reference. It works on concrete data.
         */
        this.newFixedDetailDataProvider = function (fullDatas, originalStartDate, originalEndDate) {
            if (fullDatas.length === 0) {
                throw new Error('Can\'t initialize mocked timeseries data fetcher without any data!');
            }
            var seriesCount = fullDatas.length;
            var seriesLen = fullDatas[0].length;
            var date2IdxScale = d3.scale.linear().domain([originalStartDate, originalEndDate]).range([0, seriesLen]);
            return {
                fetchData: function (startDate, endDate, numberDataPoints, sensitivity) {
                    var d = $q.defer();
                    numberDataPoints = Math.min(numberDataPoints, seriesLen);
                    var startIdx = Math.max(0, Math.floor(date2IdxScale(startDate))),
                        endIdx = Math.min(seriesLen - 1, Math.floor(date2IdxScale(endDate)));
                    var intervalLength = Math.max(1, Math.ceil((endIdx - startIdx) / numberDataPoints));
                    var res = [];
                    for (var i = 0; i < numberDataPoints; i++) {
                        var idx = i * intervalLength + startIdx;
                        var date = new Date(date2IdxScale.invert(idx));
                        var row = [date];
                        for (var j = 0; j < seriesCount; j++) {
                            var series = fullDatas[j];
                            var chunk = series.slice(idx, idx + intervalLength);
                            var extent = d3.extent(chunk);
                            var entry = [extent[0], d3.mean(chunk), extent[1]];
                            row.push(entry);
                        }
                        res.push(row);
                    }
                    appendFinalDatapoint(res);
                    appendSensitivity(res, sensitivity);
                    d.resolve(res);
                    return d.promise;
                },
                mergeData: mergeData
            };
        };
        /*
         This method returns a provider for fetching data from datasets by reference.
         It loads the data from the backend by seriesNames before fetching conrete values.
         */
        this.newDetailDataProvider = function (seriesNames) {
            return {
                fetchData: function (startDate, endDate, numberDataPoints, sensitivity) {
                    if (seriesNames.length === 0) {
                        var d = $q.defer();
                        d.resolve([]);
                        return d.promise;
                    } else {
                        return fetchDetails(seriesNames, startDate, endDate, numberDataPoints, sensitivity);
                    }
                },
                mergeData: mergeData
            };
        };

        function dateToUrlString(date) {
            //01.01.-10:00
            return $filter('date')(date, 'dd.MM.-HH:mm');
        }

        /*
         Loads data from the backend for an array for seriesNames String[].
         */
        function fetchDetails(seriesNames, startDate, endDate, count, sensitivity) {
            var startTime = dateToUrlString(startDate);
            var endTime = dateToUrlString(endDate);
            var ids = _(seriesNames).map(encodeURIComponent).join('&seriesid=');

            var url = '/backend/simulation/stammdaten/concretedata?seriesid=' + ids + '&start=' + startTime + '&end=' + endTime + '&maxcount=' + count;

            return $http.get(url,{cache:cache})
                .catch(function (data) {
                    console.error(data);
                })
                .then(function (response) {
                    /* The individual lengths of each series may be different, timestamps may not be perfectly aligned.
                     So, we need to convert these heterogeneous series into a Dygraph compatible format:
                     [[date,[min,avg,max],[...],null,[...]]
                     If there are no values for a series per time, insert a null instead of a [min,avg,max] array.
                     */
                    var result = [];
                    var i, d;
                    var data = response.data;

                    // reject series names which have no data
                    var rejectedSeriesNames = _.reject(seriesNames, function(seriesName) {
                        return _.contains(Object.keys(data), seriesName);
                    });

                    // only continue calculating dygraph data if no serienames were rejected
                    if(rejectedSeriesNames.length === 0) {
                        var maxLengths = _.map(seriesNames, function (seriesName) {
                            return data[seriesName].length;
                        });

                        var indices = _.range(0, seriesNames.length, 0);
                        while (true) {
                            var dates = [];
                            for (i = 0; i < indices.length; i++) {
                                if (indices[i] < maxLengths[i]) {
                                    // skip all entries in leap days
                                    while (inLeapDay(data[seriesNames[i]][indices[i]])) {
                                        indices[i]++;
                                    }
                                    d = data[seriesNames[i]][indices[i]];
                                    dates.push(toStandardYear(d.time).getTime());
                                }
                            }
                            if (dates.length === 0) {
                                break;
                            }
                            var minDate = _.min(dates);
                            // we ignore leap years, for simulation purposes only standard years are of interest
                            var gd = [toStandardYear(minDate)]; // one entry for each distinct element of the same index j per seriesName
                            for (i = 0; i < seriesNames.length; i++) {
                                var name = seriesNames[i];
                                var series = data[name];
                                d = series[indices[i]];
                                if (d !== undefined && toStandardYear(d.time).getTime() === minDate) {
                                    gd.push([d.min, d.avg, d.max]);
                                    indices[i]++;
                                } else {
                                    gd.push(null);
                                }
                            }
                            result.push(gd);
                        }
                        appendFinalDatapoint(result);
                        appendSensitivity(result, sensitivity);
                    } else {
                        // show console error if requested seriesnames were rejected
                        console.error('Rejected seriesnames', rejectedSeriesNames, ' because of no data from backend. Therefore no chart will be drawn.');
                    }

                    return result;
                });
        }


        /* We want to visualize time intervals. Dygraph only renders points. This means, that for example a series
         with just one value will be rendered as a single dot instead of a single horizontal line. Similarly,
         for longer series the chart will end at the last value's date, optically missing the last time interval.
         To mitigate this fact, we add a new dummy data point with a timestamp equidistant as the first pair of timestamps.
         */
      function appendFinalDatapoint(result) {
        var len = result.length;
        if (len >= 2) {
          var lastRow = result[len - 1];
          var sndToLastRow = result[len - 2];
          var tsLast = lastRow[0];
          var ts2ndLast = sndToLastRow[0];
          var ts = new Date(tsLast);
          ts.setTime(ts.getTime() + (tsLast.getTime() - ts2ndLast.getTime()));
          result.push([ts].concat(lastRow.slice(1)));
        }
        // if data has length 1, then add a second item at the end of the year due to draw a horizontal line on graph
        if (result.length === 1) {
          var currYear = result[0][0].getFullYear();
          var lastDayInYear = new Date(currYear+1, 0, 1);
          var lastDayInYearDygraphDataItem = angular.copy(result[0]);
          // set last day in year
          lastDayInYearDygraphDataItem[0] = lastDayInYear;
          result.push(lastDayInYearDygraphDataItem);
        }
      }
      // check if sensitivity is set and if true: calculate min and max values
      function appendSensitivity(result, sensitivity) {
        if (sensitivity && sensitivity.range.length === 2) {
          for (var i = 0; i < result.length; i++) {
            result[i].push(_.map(result[i][1], function (x) {
              if (sensitivity.mode === 'multiply') {
                return x * sensitivity.range[0];
              } else if (sensitivity.mode === 'add') {
                return x + sensitivity.range[0];
              }

            }));
            result[i].push(_.map(result[i][1], function (x) {
              if (sensitivity.mode === 'multiply') {
                return x * sensitivity.range[1];
              } else if (sensitivity.mode === 'add') {
                return x + sensitivity.range[1];
              }
            }));
          }
        }
      }

        function inLeapDay(long) {
            var date = new Date(long);
            return date.getDate() === 29 && date.getMonth() === 1;
        }

        function toStandardYear(long) {
            var date = new Date(long);
            return new Date(2015, date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
        }

        function mergeData(oldData, detailData) {
            if (!angular.isDefined(detailData) || detailData.length === 0) {
                return oldData;
            }
            // find the splicing point in oldData, insert detailData
            var lastLower = -1;
            var firstHigher = -1;
            var firstDetailDate = detailData[0][0];
            var lastDetailDate = detailData[detailData.length - 1][0];
            for (var i = 0; i < oldData.length; i++) {
                if (oldData[i][0] < firstDetailDate) {
                    lastLower = i;
                }
                if (firstHigher === -1 && oldData[i][0] > lastDetailDate) {
                    firstHigher = i;
                }
            }
            var lowerOld = (lastLower === -1) ? [] : oldData.slice(0, lastLower + 1);
            var upperOld = (firstHigher === -1) ? [] : oldData.slice(firstHigher);

            return lowerOld.concat(detailData).concat(upperOld);
        }
    });

'use strict';

angular.module('uiCommon')
    .directive('zoomable3dChart', function ($http) {

        return {
            templateUrl: 'components_common/charts/zoomable-3d-chart.html',
            restrict: 'E',
            scope: { // Isolate scope
                seriesName: '=?'
            },
            link: function (scope) {

                scope.range = [0.0, 1.0];

                // Height data to be rendered.
                scope.heights = [];

                var reloadData = function () {

                    var url = '/backend/simulation/stammdaten/concretedata?seriesid=' + scope.seriesName + '&start=01.01.-00:00&end=31.12.-23:59&maxcount=35040';

                    $http.get(url).then(function(res) {
                        var data = res.data[scope.seriesName];

                        var density = parseInt( 35040 / data.length );

                        // create 1D array
                        var heights = [];

                        var min = data[0].avg;
                        var max = data[0].avg;

                        for(var i = 0; i < data.length; i++) {
                            for(var j = 0; j < density; j++) {
                                heights.push(data[i].avg);

                                if (data[i].avg > max) {
                                    max = data[i].avg;
                                }
                                if (data[i].avg < min) {
                                    min = data[i].avg;
                                }
                            }
                        }

                        scope.range = [min, max];
                        scope.currentMin = scope.range[0];
                        scope.currentMax = scope.range[1];

                        // parse to 2D
                        scope.heights = [];

                        for(var i = 0; i < 365; i++) {
                            var part = [];
                            for(var j = 0; j < 96; j++) {
                                part.push(heights[i * 96 + j]);
                            }
                            scope.heights.push(part);
                        }

                        scope.render();

                    });

                };


                scope.$watch('seriesName', function () {
                    if(angular.isDefined(scope.seriesName)) {
                        reloadData();

                    }
                }, true);

                scope.render = function () {
                    var data = [
                        {
                            z: scope.heights,
                            type: 'surface',
                            showlegend: false
                        }
                    ];
                    var layout = {
                        title: null,
                        autosize: false,
                        width: 800,
                        height: 800,
                        margin: {
                            l: 65,
                            r: 50,
                            b: 65,
                            t: 90
                        }
                    };
                    Plotly.newPlot('plotly', data, layout);
                };

                scope.setMin = function (min) {

                    Plotly.restyle('plotly', {zmin: min});
                };

                scope.setMax = function (max) {
                    Plotly.restyle('plotly', {zmax: max});
                };
            }
        };
    });

'use strict';

/**
 * Inspired by https://github.com/cdjackson/angular-dygraphs/blob/master/src/angular-dygraphs.js
 * @ngdoc directive
 * @name uiCommon.directive:zoomableChart
 * @description
 * # zoomableChart
 */
angular.module('uiCommon')
    .directive('zoomableChart', function (TimeseriesFetcher, ZoomSynchronizer, $timeout, d3locale, TimeseriesAggregators, PrintService) {

        /**
         * Internal method that provides a hook in to Dygraphs default pan interaction handling.  This is a bit of hack
         * and relies on Dygraphs' internals. Without this, pan interactions (holding SHIFT and dragging graph) do not result
         * in detail data being loaded.
         *
         * @method _setupPanInteractionHandling
         * @private
         */
        function _setupPanInteractionHandling() {

            if (Dygraph.isGlobalPanInteractionHandlerInstalled) {
                return;
            } else {
                Dygraph.isGlobalPanInteractionHandlerInstalled = true;
            }
            //Save original endPan function
            var origEndPan = Dygraph.Interaction.endPan;

            //Replace built-in handling with our own function
            Dygraph.Interaction.endPan = function (event, g, context) {
                //Call the original to let it do it's magic
                origEndPan(event, g, context);
                context.isPanning = false;
                //Extract new start/end from the x-axis

                var axisX = g.xAxisRange();
                var yRanges = g.yAxisRanges();
                if (angular.isDefined(g.panCallback)) {
                    g.panCallback(axisX[0], axisX[1], yRanges);
                }
            };
            Dygraph.endPan = Dygraph.Interaction.endPan; //see dygraph-interaction-model.js
        }

        _setupPanInteractionHandling();

        function formatValueWithUnit(fmt, unit) {
            return function (number) {
                return fmt(number) + unit;
            };
        }

        return {
            templateUrl: 'components_common/charts/zoomable-chart.html',
            restrict: 'E',
            scope: { // Isolate scope
                seriesNames: '=?',
                data: '=?',
                algebraicStructure: '=?',
                simulationIds: '=?',
                numDataPoints: '=?',
                options: '=?',
                width: '@',
                height: '@',
                seriesGroup: '@',
                maxLength: '@?',
                timestep: '@?', // length of a timestep in hours, per default 0.25
                isforprint: '=',
                sensitivity: '=' // [float, float] if set, then there will be some extra labels and extra timeseries calculation
            },
            link: function (scope, element, attrs) {

                var resetOptions = undefined; // needed to reset Options if sensitivity is deselected.
                var workingWithSensitivity = false; // this boolean is needed for updating the yAxislabelFormatter correctly
                scope.$watch('sensitivity', function (newSens) {

                    if (newSens && scope.options.labels.length === 2) {

                        workingWithSensitivity = true;

                        if (!resetOptions) {
                            resetOptions = angular.copy(scope.options);
                        }
                        scope.options.labels[1] = 'Ohne Sensitivität';
                        scope.options.labels.push('Erster Zustand');
                        scope.options.labels.push('Letzter Zustand');
                    } else if (!newSens && resetOptions) { // TODO do not reset options if newSens is set.
                        scope.options = resetOptions;
                        resetOptions = undefined;
                    }

                    reloadData();
                }, true);

                if (scope.isforprint) {
                    PrintService.addChart(scope);
                } else {
                    scope.isforprint = false;
                }

                var chartDiv = element.children()[0].children[0];
                var halfWindowWidth = Math.max(300, Math.floor(angular.element(chartDiv).width() / 2));

                function zoomCallback(minDate, maxDate, yRanges, isZoomed) {
                    if (!angular.isDefined(isZoomed)) {
                        isZoomed = scope.graph.isZoomed('x');
                    }
                    synchronizeZoomCallback(minDate, maxDate, isZoomed);
                    var opts = {
                        dateWindow: [minDate, maxDate]
                    };
                    scope.graph.updateOptions(opts);
                    if (isZoomed) {
                        var detailsStartDate = new Date(minDate);

                        // if we show a full year, maxdate may be the first millisecond of the next year
                        // since we only query relative dates within a year, start and end date may seem to be equal, resulting in an empty response
                        // if we instead ensure, that the end date will always be within the same year as the start date, everyone is happy
                        var detailsEndDate = new Date(maxDate - 1);
                        var numberDataPoints = scope.numDataPoints || halfWindowWidth;
                        scope.provider.fetchData(detailsStartDate, detailsEndDate, numberDataPoints, scope.sensitivity).then(function (newData) {
                            var mergedData = scope.provider.mergeData(scope.initialData, newData);
                            if (scope.aggregator) {
                                mergedData = scope.aggregator.aggregate(mergedData);
                            }
                            opts['file'] = mergedData;
                            if (yRanges) {
                                opts['valueRange'] = yRanges[0];
                            }
                            scope.graph.updateOptions(opts);
                        });
                    } else {
                        // zoom out
                        var data = scope.initialData;
                        if (scope.aggregator) {
                            data = scope.aggregator.aggregate(data);
                        }
                        scope.graph.updateOptions({file: data, dateWindow: [minDate, maxDate], valueRange: null});
                    }
                }

                function synchronizeZoomCallback(minDate, maxDate, isZoomed) {
                    if (ZoomSynchronizer.blockRedraw) {
                        return;
                    }
                    ZoomSynchronizer.blockRedraw = true;
                    var callbacks = ZoomSynchronizer.getCommonCharts(scope.seriesGroup);
                    for (var j = 0; j < callbacks.length; j++) {
                        if (callbacks[j] !== zoomCallback) {
                            callbacks[j](minDate, maxDate, null, isZoomed);
                        }
                    }
                    ZoomSynchronizer.blockRedraw = false;
                }

                scope.startDate = new Date(2015, 0, 1);
                scope.endDate = new Date(2015, 11, 31, 23, 59, 59);


                // logic for fixed data
                function getTimestep() {
                    var timestep = Number.parseFloat(scope.timestep);
                    if (Number.isNaN(timestep)) {
                        timestep = 0.25;
                    }
                    return timestep;
                }

                scope.$watch('data', function (newData) {
                    if (!angular.isDefined(newData) || newData.length === 0) {
                        return;
                    }
                    var newDataSerieses = angular.isArray(newData[0]) ? newData : [newData];
                    var seriesLength = newDataSerieses[0].length;
                    var timestep = getTimestep();
                    var endDate = new Date(scope.startDate.getTime() + timestep * 60 * 60 * 1000 * seriesLength);
                    scope.provider = TimeseriesFetcher.newFixedDetailDataProvider(newDataSerieses, scope.startDate, endDate);
                    reloadData();
                });

                scope.$watch('algebraicStructure', function (newStruct) {
                    if (!angular.isDefined(newStruct)) {
                        return;
                    }

                    scope.startDate = new Date(newStruct.year, 0, 1);
                    scope.endDate = new Date(newStruct.year, 11, 31, 23, 59, 59);
                    try {
                        TimeseriesFetcher.newAlgebraicDetailDataProvider(newStruct).then(function (result) {
                            scope.provider = result;
                            reloadData();
                        });
                    } catch (e) {
                        switch (e.type) {
                            case 'not found':
                            {
                                console.error('Es konnte kein Datensatz aus ' + e.variable.fetchYear + ' für das Stammdatum "' + e.variable.stammdatum.name + '" gefunden werden.');
                                break;
                            }
                        }
                    }
                });

                scope.$watch('options', function (extOptions) {

                    var options = angular.merge({
                        height: scope.height,
                        width: scope.width,
                        customBars: true,
                        connectSeparatedPoints: true,
                        zoomCallback: zoomCallback
                    }, extOptions);

                    // respect currently set formatting functions for the y axis as well as mouse over outputs
                    // but append the unit if there is one
                    _.set(options, 'axes.y.axisLabelFormatter', formatValueWithUnit(_.get(options, 'axes.y.axisLabelFormatter', angular.identity), options.unit || ''));
                    _.set(options, 'axes.y.valueFormatter', formatValueWithUnit(_.get(options, 'axes.y.valueFormatter', angular.identity), options.unit || ''));

                    /*
                     Checks if sensitivity gets set to undefined after being in a defined state.
                     */
                    if (!scope.sensitivity && workingWithSensitivity) {
                        workingWithSensitivity = false;
                    }

                    scope.internalOptions = options;
                    if (scope.initialData) {
                        renderChart(scope.initialData);
                    }
                }, true);

                // logic for remote data
                scope.$watch('seriesNames', function (seriesNames) {
                    if (!angular.isDefined(seriesNames)) {
                        return;
                    }

                    if (scope.simulationIds && (scope.simulationIds.length === scope.seriesNames.length)) {

                        var opts = angular.copy(scope.options);
                        for (var i = 0; i < scope.simulationIds.length; i++) {
                            opts.labels[i + 1] = scope.simulationIds[i] + ' - ' + scope.seriesNames[i];
                        }

                        scope.options = opts;
                    }


                    scope.provider = TimeseriesFetcher.newDetailDataProvider(seriesNames);
                    reloadData();
                }, true);


                attrs.$observe('maxLength', function (maxLength) {
                    if (!angular.isDefined(maxLength)) {
                        return;
                    }
                    scope.endDate.setTime(scope.startDate.getTime() + 15 * 60 * 1000 * scope.maxLength - 1);//if we know the maximum length of the timeseries in the database, use it as an end date
                    reloadData();
                });


                function reloadData() {
                    if (angular.isDefined(scope.provider)) {

                        scope.provider.fetchData(scope.startDate, scope.endDate, scope.numDataPoints || halfWindowWidth, scope.sensitivity).then(function (initialData) {
                            var data = scope.initialData = initialData;
                            if (scope.initialData.length > 0) {
                                renderChart(data);
                            }
                        });
                    }
                }

                function renderChart(data) {

                    var options = scope.internalOptions;
                    if (scope.aggregator) {
                        data = scope.aggregator.aggregate(data);
                        options = scope.aggregator.modifyOptions(angular.copy(options));
                    }

                    if (!(options.labels && data[0])) {
                        return;
                    }

                    // only render chart if options.labels and data point lengths are equal
                    if (options.labels.length === data[0].length) {
                        //create or update the Dygraph chart
                        if (angular.isDefined(scope.graph)) {
                            scope.graph.updateOptions(angular.extend({file: data, valueRange: null}, options));
                        } else {
                            chartDiv = element.children()[0].children[0];
                            scope.graph = new Dygraph(chartDiv, scope.initialData, options);
                            if (angular.isDefined(scope.seriesGroup)) {
                                ZoomSynchronizer.addChartToGroup(zoomCallback, scope.seriesGroup);
                            }
                            scope.graph.panCallback = zoomCallback;
                        }
                    }
                    scope.graph.resetZoom();
                }

                scope.$on('$destroy', function (event) {
                    ZoomSynchronizer.removeChartFromGroup(zoomCallback, event.currentScope.seriesGroup);
                });
                scope.$on('visible', function () {
                    if (!scope.graph) {
                        reloadData();
                    }
                    if (scope.graph) {
                        $timeout(function () {
                            scope.graph.resize();
                        }, 500);
                    }
                });

                //options menu
                scope.open = false;
                scope.rotate = false;

                scope.openOpts = function () {
                    scope.rotate = true;
                    scope.open = !scope.open;

                    $timeout(function () {
                        scope.rotate = false;
                    }, 500);
                };


                scope.selectedAggregationType = 'keine Aggregation';
                scope.aggregator = null;
                scope.percentiles = [[10, 50, 90], [25, 50, 75], [20, 70, 90]];

                scope.select = function (type) {
                    switch (type) {
                        case 'sum':
                            scope.aggregator = TimeseriesAggregators.sum();
                            scope.selectedAggregationType = 'Summe            ';

                            break;
                        case 'average':
                            scope.aggregator = TimeseriesAggregators.average();
                            scope.selectedAggregationType = 'Durchschnitt     ';

                            break;
                        case 'percentiles':
                            scope.aggregator = TimeseriesAggregators.percentiles(scope.selectedPercentile);
                            scope.selectedAggregationType = 'Perzentil';
                            break;
                        default:
                            delete scope.aggregator;
                            scope.selectedAggregationType = 'keine Aggregation';
                    }
                    if (scope.initialData) {
                        renderChart(scope.initialData);
                    }
                    scope.open = false;
                };

                scope.selectPercentiles = function (percentile) {
                    scope.selectedPercentile = percentile;
                    scope.select('percentiles');
                };


                scope.print = function () {
                    $timeout(function () {
                        var childs = element.get(0).childNodes[1].childNodes[1].firstChild.childNodes[0];

                        if (childs) {
                            var temp = childs.toDataURL('image/png');
                            var img = document.createElement('img');
                            img.setAttribute('src', temp);
                            childs.parentNode.replaceChild(img, childs);
                        }

                    }, 1000);
                };

                scope.saveChartToPng = function () {
                    var img = document.createElement('img');
                    Dygraph.Export.asPNG(scope.graph, img);

                    var downloadLink = angular.element('<a></a>');

                    downloadLink.attr('href', img.src);
                    downloadLink.attr('download', 'chart.png');
                    downloadLink[0].click();
                };
            }
        };
    });

'use strict';

/**
 * @ngdoc service
 * @name uiCommon.ZoomSynchronizer
 * @description
 * # ZoomSynchronizer
 * Service in the uiCommon.
 */
angular.module('uiCommon')
  .service('ZoomSynchronizer', function ZoomSynchronizer() {
    this.blockRedraw = false;
    var chartGroups = {};

    this.getCommonCharts = function(groupName){
      if(!angular.isDefined(groupName)){
        return [];
      }else{
        return chartGroups[groupName];
      }
    };

    this.addChartToGroup = function(chart, groupName){
        var group = chartGroups[groupName];
        if(!group){
          group = [];
          chartGroups[groupName] = group;
        }
      group.push(chart);
    };
    // avoid potential memory leak by explicitly removing unused charts
    this.removeChartFromGroup = function(chart, groupName){
      var array = chartGroups[groupName];
      if(angular.isDefined(array)){
        var i = array.indexOf(chart);
        if(i !== -1) {
          array.splice(i, 1);
        }
      }
    };
  });

/*jslint vars: true, nomen: true, camelcase: false, plusplus: true, maxerr: 500, indent: 4 */
'use strict';
/**
 * @license
 * Copyright 2011 Juan Manuel Caicedo Carvajal (juan@cavorite.com)
 * MIT-licensed (http://opensource.org/licenses/MIT)
 */

/**
 * @fileoverview This file contains additional features for dygraphs, which
 * are not required but can be useful for certain use cases. Examples include
 * exporting a dygraph as a PNG image.
 */

/**
 * Demo code for exporting a Dygraph object as an image.
 *
 * See: http://cavorite.com/labs/js/dygraphs-export/
 */

Dygraph.Export = {};

Dygraph.Export.DEFAULT_ATTRS = {

  backgroundColor: 'transparent',

  //Texts displayed below the chart's x-axis and to the left of the y-axis
  titleFont: 'bold 18px serif',
  titleFontColor: 'black',

  //Texts displayed below the chart's x-axis and to the left of the y-axis
  axisLabelFont: 'bold 14px serif',
  axisLabelFontColor: 'black',

  // Texts for the axis ticks
  labelFont: 'normal 12px serif',
  labelFontColor: 'black',

  // Text for the chart legend
  legendFont: 'bold 12px serif',
  legendFontColor: 'black',

  // Default position for vertical labels
  vLabelLeft: 20,

  legendHeight: 20,    // Height of the legend area
  legendMargin: 20,
  lineHeight: 30,
  maxlabelsWidth: 0,
  labelTopMargin: 35,
  magicNumbertop: 8

};

/**
 * Tests whether the browser supports the canvas API and its methods for
 * drawing text and exporting it as a data URL.
 */
Dygraph.Export.isSupported = function () {
  try {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    return (!!canvas.toDataURL && !!context.fillText);
  } catch (e) {
    // Silent exception.
  }
  return false;
};

/**
 * Exports a dygraph object as a PNG image.
 *
 *  dygraph: A Dygraph object
 *  img: An IMG DOM node
 *  userOptions: An object with the user specified options.
 *
 */
Dygraph.Export.asPNG = function (dygraph, img, userOptions) {
  var canvas = Dygraph.Export.asCanvas(dygraph, userOptions);
  img.src = canvas.toDataURL();
};

/**
 * Exports a dygraph into a single canvas object.
 *
 * Returns a canvas object that can be exported as a PNG.
 *
 *  dygraph: A Dygraph object
 *  userOptions: An object with the user specified options.
 *
 */
Dygraph.Export.asCanvas = function (dygraph, userOptions) {

  var options = {},
    canvas = Dygraph.createCanvas();

  Dygraph.update(options, Dygraph.Export.DEFAULT_ATTRS);
  Dygraph.update(options, userOptions);

  canvas.width = dygraph.width_;
  canvas.height = dygraph.height_ + options.legendHeight;

  Dygraph.Export.drawPlot(canvas, dygraph, options);
  Dygraph.Export.drawLegend(canvas, dygraph, options);

  return canvas;
};

/**
 * Adds the plot and the axes to a canvas context.
 */
Dygraph.Export.drawPlot = function (canvas, dygraph, options) {
  var ctx = canvas.getContext('2d');

  // Add user defined background
  ctx.fillStyle = options.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Copy the plot canvas into the context of the new image.
  var plotCanvas = dygraph.hidden_;

  var i = 0;

  ctx.drawImage(plotCanvas, 0, 0);


  // Add the x and y axes
  var axesPluginDict = Dygraph.Export.getPlugin(dygraph, 'Axes Plugin');
  if (axesPluginDict) {
    var axesPlugin = axesPluginDict.plugin;

    for (i = 0; i < axesPlugin.ylabels_.length; i++) {
      Dygraph.Export.putLabel(ctx, axesPlugin.ylabels_[i], options,
        options.labelFont, options.labelFontColor);
    }

    for (i = 0; i < axesPlugin.xlabels_.length; i++) {
      Dygraph.Export.putLabel(ctx, axesPlugin.xlabels_[i], options,
        options.labelFont, options.labelFontColor);
    }
  }

  // Title and axis labels

  var labelsPluginDict = Dygraph.Export.getPlugin(dygraph, 'ChartLabels Plugin');
  if (labelsPluginDict) {
    var labelsPlugin = labelsPluginDict.plugin;

    Dygraph.Export.putLabel(ctx, labelsPlugin.title_div_, options,
      options.titleFont, options.titleFontColor);

    Dygraph.Export.putLabel(ctx, labelsPlugin.xlabel_div_, options,
      options.axisLabelFont, options.axisLabelFontColor);

    Dygraph.Export.putVerticalLabelY1(ctx, labelsPlugin.ylabel_div_, options,
      options.axisLabelFont, options.axisLabelFontColor, 'center');

    Dygraph.Export.putVerticalLabelY2(ctx, labelsPlugin.y2label_div_, options,
      options.axisLabelFont, options.axisLabelFontColor, 'center');
  }


  for (i = 0; i < dygraph.layout_.annotations.length; i++) {
    Dygraph.Export.putLabelAnn(ctx, dygraph.layout_.annotations[i], options,
      options.labelFont, options.labelColor);
  }

};

/**
 * Draws a label (axis label or graph title) at the same position
 * where the div containing the text is located.
 */
Dygraph.Export.putLabel = function (ctx, divLabel, options, font, color) {


  if (!divLabel || !divLabel.style) {
    return;
  }

  var top = parseInt(divLabel.style.top, 10);
  var left = parseInt(divLabel.style.left, 10);

  if (!divLabel.style.top.length) {
    var bottom = parseInt(divLabel.style.bottom, 10);
    var height = parseInt(divLabel.style.height, 10);

    top = ctx.canvas.height - options.legendHeight - bottom - height;
  }

  // FIXME: Remove this 'magic' number needed to get the line-height.
  top = top + options.magicNumbertop;

  var width = parseInt(divLabel.style.width, 10);

  switch (divLabel.style.textAlign) {
    case 'center':
      left = left + Math.ceil(width / 2);
      break;
    case 'right':
      left = left + width;
      break;
  }

  Dygraph.Export.putText(ctx, left, top, divLabel, font, color);
};

/**
 * Draws a label Y1 rotated 90 degrees counterclockwise.
 */
Dygraph.Export.putVerticalLabelY1 = function (ctx, divLabel, options, font, color, textAlign) {

  if (!divLabel) {
    return;
  }

  var top = parseInt(divLabel.style.top, 10);
  var left = parseInt(divLabel.style.left, 10) + parseInt(divLabel.style.width, 10) / 2;
  var text = divLabel.innerText || divLabel.textContent;


  // FIXME: The value of the 'left' property is frequently 0, used the option.
  if (!left) {
    left = options.vLabelLeft;
  }
  if (textAlign === 'center') {
    var textDim = ctx.measureText(text);
    top = Math.ceil((ctx.canvas.height - textDim.width) / 2 + textDim.width);
  }

  ctx.save();
  ctx.translate(0, ctx.canvas.height);
  ctx.rotate(-Math.PI / 2);

  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = textAlign;
  ctx.fillText(text, top, left);

  ctx.restore();
};

/**
 * Draws a label Y2 rotated 90 degrees clockwise.
 */
Dygraph.Export.putVerticalLabelY2 = function (ctx, divLabel, options, font, color, textAlign) {

  if (!divLabel) {
    return;
  }

  var top = parseInt(divLabel.style.top, 10);
  var right = parseInt(divLabel.style.right, 10) + parseInt(divLabel.style.width, 10) * 2;
  var text = divLabel.innerText || divLabel.textContent;

  if (textAlign === 'center') {
    top = Math.ceil(ctx.canvas.height / 2);
  }

  ctx.save();
  ctx.translate(parseInt(divLabel.style.width, 10), 0);
  ctx.rotate(Math.PI / 2);

  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = textAlign;
  ctx.fillText(text, top, right - ctx.canvas.width);

  ctx.restore();
};

/**
 * Draws the text contained in 'divLabel' at the specified position.
 */
Dygraph.Export.putText = function (ctx, left, top, divLabel, font, color) {

  var textAlign = divLabel.style.textAlign || 'left';
  var text = divLabel.innerText || divLabel.textContent;

  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = textAlign;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, left, top);
};

/**
 * Draws the legend of a dygraph
 *
 */
Dygraph.Export.drawLegend = function (canvas, dygraph, options) {
  var ctx = canvas.getContext('2d');

  // Margin from the plot
  var labelTopMargin = 10;

  // Margin between labels
  var labelMargin = 5;

  var colors = dygraph.getColors();
  // Drop the first element, which is the label for the time dimension
  var labels = dygraph.attr_('labels').slice(1);

  // 1. Compute the width of the labels:
  var labelsWidth = 0;

  var i;
  for (i = 0; i < labels.length; i++) {
    labelsWidth = labelsWidth + ctx.measureText('- ' + labels[i]).width + labelMargin;
  }

  var labelsX = Math.floor((canvas.width - labelsWidth) / 2);
  var labelsY = canvas.height - options.legendHeight + labelTopMargin;


  var labelVisibility=dygraph.attr_('visibility');

  ctx.font = options.legendFont;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  var usedColorCount=0;
  for (i = 0; i < labels.length; i++) {
    if (labelVisibility[i]) {
      //TODO Replace the minus sign by a proper dash, although there is a
      //     problem when the page encoding is different than the encoding
      //     of this file (UTF-8).
      var txt = '- ' + labels[i];
      ctx.fillStyle = colors[usedColorCount];
      usedColorCount++;
      ctx.fillText(txt, labelsX, labelsY);
      labelsX = labelsX + ctx.measureText(txt).width + labelMargin;
    }
  }
};

/**
 * Finds a plugin by the value returned by its toString method..
 *
 * Returns the the dictionary corresponding to the plugin for the argument.
 * If the plugin is not found, it returns null.
 */
Dygraph.Export.getPlugin = function(dygraph, name) {
  for (var i = 0; i < dygraph.plugins_.length; i++) {
    if (dygraph.plugins_[i].plugin.toString() === name) {
      return dygraph.plugins_[i];
    }
  }
  return null;
};

'use strict';

angular.module('uiCommon')
  .directive('fixedNavPanel', function ($window){

    return {
      restrict: 'E',
      require: '^fixedNavRight',
      scope: true,
      transclude: true,

      templateUrl: 'components_common/fixed-nav/fixed-nav-panel.html',
      link: function (scope, element, attributes, fixednavrightCtrl){

        scope.id = fixednavrightCtrl.addTab(scope);
        scope.title = attributes.title;
        scope.icon = attributes.icon;
        scope.tooltipText = attributes.tooltipText;
        scope.destroy = attributes.destroy === 'true';

        scope.setActive = function(){
          if(attributes.onlybutton){
            fixednavrightCtrl.setActive(scope.id, attributes.onlybutton);

          } else {
            fixednavrightCtrl.setActive(scope.id);
          }

        };

      },
      controller: function ($scope) {
        $scope.height = $window.innerHeight - 160 + 'px';

        $(window).resize(function(){
          $scope.$apply(function(){
            $scope.height = $window.innerHeight - 160 + 'px';
          });
        });
      }
    };
  });

'use strict';

angular.module('uiCommon')
  .directive('fixedNavRight', function ($window){

    return {
      restrict: 'E',
      scope: true,
      transclude: true,
      templateUrl: 'components_common/fixed-nav/fixed-nav-right.html',
      link: function (scope, element, attributes){
        scope.top = attributes.top || '150px';
      },
      controller: function($scope){

        $scope.open = false;
        $scope.tabs = [];
        $scope.width = ($window.innerWidth - 14) + 'px';

        // dynamic window size
        $(window).resize(function(){
          $scope.$apply(function(){
              $scope.width = ($window.innerWidth - 14) + 'px';
          });
        });

        /**
         * fixed-nav-panel tabs can add them self by calling this controller function in link/
         *
         * @param {Object} tab the nav-tab to add
         * @returns {number} index of the tab
         */
        this.addTab = function(tab){
          tab.active = false;
          tab.open = false;
          $scope.tabs.push(tab);

          return $scope.tabs.length -1 ;

        };

        /**
         * called by icon click. opens the sidebarmenu or runs the onlybutton function if set.
         *
         * @param {number} id the id of the tab to set as the active one
         * @param {boolean} onlyButton render just a button or contains content?
         */
        this.setActive = function(id, onlyButton) {

          if(onlyButton){
            $scope[onlyButton]();

          } else {
            for(var i= 0; i < $scope.tabs.length; i++){

              if($scope.tabs[i].id === id){

                if($scope.tabs[id].active){
                  $scope.open = false;
                  $scope.tabs[id].active = false;
                } else {
                  $scope.open = true;
                  $scope.tabs[id].active = true;
                }

              } else {
                $scope.tabs[i].active = false;

              }

            }
            for(var j= 0; j < $scope.tabs.length; j++){
              if($scope.open){
                $scope.tabs[j].open = true;
              }
            }
          }


        };

      }
    };
  });

/* jshint ignore:start */
'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
function getDecimals(n) {
  n = n + '';
  var i = n.indexOf('.');
  return (i == -1) ? 0 : n.length - i - 1;
}

function getVF(n, opt_precision) {
  var v = opt_precision;

  if (undefined === v) {
    v = Math.min(getDecimals(n), 3);
  }

  var base = Math.pow(10, v);
  var f = ((n * base) | 0) % base;
  return {v: v, f: f};
}

$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "vorm.",
      "nachm."
    ],
    "DAY": [
      "Sonntag",
      "Montag",
      "Dienstag",
      "Mittwoch",
      "Donnerstag",
      "Freitag",
      "Samstag"
    ],
    "MONTH": [
      "Januar",
      "Februar",
      "M\u00e4rz",
      "April",
      "Mai",
      "Juni",
      "Juli",
      "August",
      "September",
      "Oktober",
      "November",
      "Dezember"
    ],
    "SHORTDAY": [
      "So.",
      "Mo.",
      "Di.",
      "Mi.",
      "Do.",
      "Fr.",
      "Sa."
    ],
    "SHORTMONTH": [
      "Jan.",
      "Feb.",
      "M\u00e4rz",
      "Apr.",
      "Mai",
      "Juni",
      "Juli",
      "Aug.",
      "Sep.",
      "Okt.",
      "Nov.",
      "Dez."
    ],
    "fullDate": "EEEE, d. MMMM y",
    "longDate": "d. MMMM y",
    "medium": "dd.MM.y HH:mm:ss",
    "mediumDate": "dd.MM.y",
    "mediumTime": "HH:mm:ss",
    "short": "dd.MM.yy HH:mm",
    "shortDate": "dd.MM.yy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "CHF",
    "DECIMAL_SEP": ".",
    "GROUP_SEP": "'",
    "PATTERNS": [
      {
        "gSize": 3,
        "lgSize": 3,
        "maxFrac": 3,
        "minFrac": 0,
        "minInt": 1,
        "negPre": "-",
        "negSuf": "",
        "posPre": "",
        "posSuf": ""
      },
      {
        "gSize": 3,
        "lgSize": 3,
        "maxFrac": 2,
        "minFrac": 2,
        "minInt": 1,
        "negPre": "\u00a4-",
        "negSuf": "",
        "posPre": "\u00a4\u00a0",
        "posSuf": ""
      }
    ]
  },
  "id": "de-ch",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
/* jshint ignore:end */

'use strict';

/**
 * @ngdoc service
 * @name uiCommon.d3locale
 * @description
 * # d3locale
 * Localization information for D3 date formatting functions. There seems to be no german locale by default.
 */
angular.module('uiCommon')
  .value('d3locale', d3.locale({
    decimal: ',',
    thousands: '.',
    grouping: [3],
    currency: ['€', ''],
    dateTime: '%a %b %e %X %Y',
    date: '%d.%m.%Y',
    time: '%H:%M:%S',
    periods: ['AM', 'PM'],
    days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    shortDays: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    shortMonths: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
  }));

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

'use strict';

/**
 * @ngdoc directive to allow downloads for client side generated data.
 * @name dashboardApp.directive:download
 * @description
 * # download
 */
angular.module('uiCommon')
    .directive('download', function () {
        return {
            restrict:'E',
            transclude: true,
            replace: true,
            scope:{ data: '=',
                filename: '@',
                dataFunction: '&function',
                request: '&',
                resolve: '&',
                contentType: '@'},
            template: '<button class="btn btn-default" ng-click="createFile()">' +
            '<span ng-transclude></span>' +
            '</button>',
            link:function (scope, elem, attrs) {

                function createURL(data, contentType){
                    if(angular.isDefined(contentType) && contentType === 'application/json' && !angular.isString(data)) {
                        data = JSON.stringify(data);
                    }

                    return window.URL.createObjectURL(new Blob([data], {type: contentType || 'application/json'}));
                }

                function download(link) {
                    var downloadLink = angular.element('<a></a>');
                    downloadLink.attr('href',link);
                    downloadLink.attr('download', scope.filename);
                    downloadLink[0].click();
                }

                scope.createFile = function(){
                    var link = null;

                    // data via scope
                    if(scope.data){
                        link = createURL(scope.data, scope.contentType);
                        download(link);
                    }

                    // create data via provided function
                    if(attrs.function && typeof scope.dataFunction === 'function'){
                        link = createURL(scope.dataFunction(), scope.contentType);
                        download(link);
                    }

                    // request data via request function
                    if(attrs.request && typeof scope.request === 'function' &&
                        attrs.resolve && typeof scope.resolve === 'function') {
                        // run request
                        scope.request().then(function(res) {
                            var json = res.data;
                            // process the response data via resolve function
                            var data = scope.resolve({json: json});
                            link = createURL(data, scope.contentType);
                            download(link);
                        });
                    }
                };
            }
        };
    });

'use strict';

/**
 * @ngdoc service
 * @name uiCommon.FileParser
 * @description
 * # FileParser
 * Service in the uiCommon.
 */
angular.module('uiCommon')
  .service('FileParser', function ($q) {
    var FileParser = this;
    FileParser.readFileContents = function(file){
      var deferred = $q.defer();

      var reader = new FileReader();
      reader.onload = function() {
        deferred.resolve(reader.result);
      };
      reader.readAsText(file);
      return deferred.promise;
    };
    FileParser.readCSVFileContents = function(file){
      return FileParser.readFileContents(file).then(function(text){
          return d3.dsv(';','text/plain;encoding=UTF-8').parse(text);
      });
    };
  });

'use strict';

/**
 * @ngdoc directive to allow down-/uploads for client side generated data. Renders two buttons.
 * @name uiCommon.directive:filePersistence
 * @description
 * # download
 */
angular.module('uiCommon')
  .directive('filePersistence', function () {
    return {
      restrict:'E',
      transclude: true,
      scope:{ data: '=',
              filename: '@',
              contentType: '@'},
      templateUrl: 'components_common/other/filepersistence.html',
      link:function (scope) {
        scope.loadFile = function(contents){
          if(scope.contentType === 'application/json'){
            scope.data = JSON.parse(contents);
          }else{
            scope.data = contents;
          }
        };
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name uiCommon.directive:intRange
 * @description
 * # intRange
 * <input type="range"> returns string values, we want to have integers, though
 */
angular.module('uiCommon')
  .directive('intRange', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        if (attrs.type.toLowerCase() !== 'range') {
          return;
        } //only augment number input!
        ctrl.$parsers.push(function (value) {
          return value ? parseFloat(value) : null;
        });
      }
    };
  });

'use strict';
/////////////////////////// show the last 3 significant digits of arbitrary floats ///////////////////////////
angular.module('uiCommon')
  .filter('significantNumber', function ($filter) {
    var f = function(number, fraction) {
      if(typeof number !== 'number' || isNaN(number)) {
        return number;
      }else if(Number.isInteger(number)){
        return $filter('number')(number,0);    // apply locale specific formatting
      }else{
        var s = $filter('number')(number,20);
        var decimalFound = false, significantDigitFound=false;
        var lastSignificantDigitIndex = 0, nSignificantDigits = 0;
        for (var i = 0; i < s.length; i++) {
          var c = s[i];
          if(!decimalFound){
            decimalFound = c === '.';
          }else{
            significantDigitFound = significantDigitFound || c !== '0';
            if (significantDigitFound) {
              nSignificantDigits++;
              if(c!=='0'){
                lastSignificantDigitIndex = i;
              }
              if(nSignificantDigits >= fraction){
                break;
              }
            }
          }
        }
        return s.substring(0, Math.min(s.length,lastSignificantDigitIndex+1));
      }
    };
    //console.log(f(20,0), f(20,3),f(20.000123,3),f(20.0001003,3),f(0.000123,3),f(0.0001023,3));
    return f;
  });

'use strict';

/**
 * @ngdoc add attribute 'on-read-file' to an input[@type='file'] element.
 * @name uiCommon.directive:onreadfile
 * @description
 * # Example usage: <input type="file" on-read-file="doWithContent($fileContent)" />
 */
angular.module('uiCommon')
  .directive('onReadFile', function ($parse) {
    return {
      restrict: 'A',
      scope: false,
      link: function (scope, element, attrs) {
        var fn = $parse(attrs.onReadFile);

        element.on('change', function (onChangeEvent) {
          var reader = new FileReader();

          reader.onload = function (onLoadEvent) {
            scope.$apply(function () {
              fn(scope, {$fileContent: onLoadEvent.target.result});
            });
          };
          reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
          element.val(''); // remove value of the input field, else loading the same file name (even if their contents are different), won't fire the 'change' event
        });
      }
    };
  });
