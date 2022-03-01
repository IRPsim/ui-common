'use strict';

/**
 * @ngdoc directive to allow downloads for client side generated data.
 * @name dashboardApp.directive:download
 * @description
 * # download
 */
angular.module('uiCommon')
    .directive('download', function () {
        return {
            restrict:'E',
            transclude: true,
            replace: true,
            scope:{ data: '=',
                filename: '@',
                dataFunction: '&function',
                request: '&',
                resolve: '&',
                contentType: '@'},
            template: '<button class="btn btn-default" ng-click="createFile()">' +
            '<span ng-transclude></span>' +
            '</button>',
            link:function (scope, elem, attrs) {

                function createURL(data, contentType){
                    if(angular.isDefined(contentType) && contentType === 'application/json' && !angular.isString(data)) {
                        data = JSON.stringify(data);
                    }

                    return window.URL.createObjectURL(new Blob([data], {type: contentType || 'application/json'}));
                }

                function download(link) {
                    var downloadLink = angular.element('<a></a>');
                    downloadLink.attr('href',link);
                    downloadLink.attr('download', scope.filename);
                    downloadLink[0].click();
                }

                scope.createFile = function(){
                    var link = null;

                    // data via scope
                    if(scope.data){
                        link = createURL(scope.data, scope.contentType);
                        download(link);
                    }

                    // create data via provided function
                    if(attrs.function && typeof scope.dataFunction === 'function'){
                        link = createURL(scope.dataFunction(), scope.contentType);
                        download(link);
                    }

                    // request data via request function
                    if(attrs.request && typeof scope.request === 'function' &&
                        attrs.resolve && typeof scope.resolve === 'function') {
                        // run request
                        scope.request().then(function(res) {
                            var json = res.data;
                            // process the response data via resolve function
                            var data = scope.resolve({json: json});
                            link = createURL(data, scope.contentType);
                            download(link);
                        });
                    }
                };
            }
        };
    });
