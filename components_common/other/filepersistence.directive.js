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
