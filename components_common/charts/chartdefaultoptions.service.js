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
