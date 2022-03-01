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
