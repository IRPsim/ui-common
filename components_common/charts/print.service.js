'use strict';

/**
 * @ngdoc service
 * @name uiCommon.PrintService
 * @description
 * # PrintService
 * Service in the uiCommon.
 */
angular.module('uiCommon')
  .service('PrintService', function() {


    var printer = {};
    printer.scopes = [];

    printer.addChart =  function(scope){
      printer.scopes.push(scope);
    };

    printer.print =  function(){
      angular.forEach(printer.scopes, function(scope){
        scope.print();
      });
    };

    return printer;

  });
