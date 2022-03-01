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
