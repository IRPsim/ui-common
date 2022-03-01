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
