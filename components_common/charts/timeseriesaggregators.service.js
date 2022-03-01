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
