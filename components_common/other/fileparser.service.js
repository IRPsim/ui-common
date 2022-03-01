'use strict';

/**
 * @ngdoc service
 * @name uiCommon.FileParser
 * @description
 * # FileParser
 * Service in the uiCommon.
 */
angular.module('uiCommon')
  .service('FileParser', function ($q) {
    var FileParser = this;
    FileParser.readFileContents = function(file){
      var deferred = $q.defer();

      var reader = new FileReader();
      reader.onload = function() {
        deferred.resolve(reader.result);
      };
      reader.readAsText(file);
      return deferred.promise;
    };
    FileParser.readCSVFileContents = function(file){
      return FileParser.readFileContents(file).then(function(text){
          return d3.dsv(';','text/plain;encoding=UTF-8').parse(text);
      });
    };
  });
