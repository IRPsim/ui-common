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
