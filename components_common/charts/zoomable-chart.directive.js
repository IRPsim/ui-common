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
