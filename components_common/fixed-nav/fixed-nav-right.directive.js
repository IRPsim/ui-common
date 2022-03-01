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
