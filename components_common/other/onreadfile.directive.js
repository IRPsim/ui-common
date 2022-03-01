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
