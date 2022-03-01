'use strict';
/////////////////////////// show the last 3 significant digits of arbitrary floats ///////////////////////////
angular.module('uiCommon')
  .filter('significantNumber', function ($filter) {
    var f = function(number, fraction) {
      if(typeof number !== 'number' || isNaN(number)) {
        return number;
      }else if(Number.isInteger(number)){
        return $filter('number')(number,0);    // apply locale specific formatting
      }else{
        var s = $filter('number')(number,20);
        var decimalFound = false, significantDigitFound=false;
        var lastSignificantDigitIndex = 0, nSignificantDigits = 0;
        for (var i = 0; i < s.length; i++) {
          var c = s[i];
          if(!decimalFound){
            decimalFound = c === '.';
          }else{
            significantDigitFound = significantDigitFound || c !== '0';
            if (significantDigitFound) {
              nSignificantDigits++;
              if(c!=='0'){
                lastSignificantDigitIndex = i;
              }
              if(nSignificantDigits >= fraction){
                break;
              }
            }
          }
        }
        return s.substring(0, Math.min(s.length,lastSignificantDigitIndex+1));
      }
    };
    //console.log(f(20,0), f(20,3),f(20.000123,3),f(20.0001003,3),f(0.000123,3),f(0.0001023,3));
    return f;
  });
