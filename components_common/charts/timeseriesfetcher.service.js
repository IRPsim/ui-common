'use strict';

/**
 * @ngdoc service
 * @name uiCommon.TimeseriesFetcher
 * @description
 * # TimeseriesFetcher
 * Service in the uiCommon.
 */
angular.module('uiCommon')
    .service('TimeseriesFetcher', function TimeseriesFetcher($filter, $http, $q, Datasets, $cacheFactory) {

        var cache = $cacheFactory('httpRequestsCache', {capacity: 200}); // LRU cache for all GET requests

        /*
         This method returns a provider for fetching data from a dataset without (!) reference. It works on concrete data.
         */
        this.newFixedDetailDataProvider = function (fullDatas, originalStartDate, originalEndDate) {
            if (fullDatas.length === 0) {
                throw new Error('Can\'t initialize mocked timeseries data fetcher without any data!');
            }
            var seriesCount = fullDatas.length;
            var seriesLen = fullDatas[0].length;
            var date2IdxScale = d3.scale.linear().domain([originalStartDate, originalEndDate]).range([0, seriesLen]);
            return {
                fetchData: function (startDate, endDate, numberDataPoints, sensitivity) {
                    var d = $q.defer();
                    numberDataPoints = Math.min(numberDataPoints, seriesLen);
                    var startIdx = Math.max(0, Math.floor(date2IdxScale(startDate))),
                        endIdx = Math.min(seriesLen - 1, Math.floor(date2IdxScale(endDate)));
                    var intervalLength = Math.max(1, Math.ceil((endIdx - startIdx) / numberDataPoints));
                    var res = [];
                    for (var i = 0; i < numberDataPoints; i++) {
                        var idx = i * intervalLength + startIdx;
                        var date = new Date(date2IdxScale.invert(idx));
                        var row = [date];
                        for (var j = 0; j < seriesCount; j++) {
                            var series = fullDatas[j];
                            var chunk = series.slice(idx, idx + intervalLength);
                            var extent = d3.extent(chunk);
                            var entry = [extent[0], d3.mean(chunk), extent[1]];
                            row.push(entry);
                        }
                        res.push(row);
                    }
                    appendFinalDatapoint(res);
                    appendSensitivity(res, sensitivity);
                    d.resolve(res);
                    return d.promise;
                },
                mergeData: mergeData
            };
        };
        /*
         This method returns a provider for fetching data from datasets by reference.
         It loads the data from the backend by seriesNames before fetching conrete values.
         */
        this.newDetailDataProvider = function (seriesNames) {
            return {
                fetchData: function (startDate, endDate, numberDataPoints, sensitivity) {
                    if (seriesNames.length === 0) {
                        var d = $q.defer();
                        d.resolve([]);
                        return d.promise;
                    } else {
                        return fetchDetails(seriesNames, startDate, endDate, numberDataPoints, sensitivity);
                    }
                },
                mergeData: mergeData
            };
        };

        function dateToUrlString(date) {
            //01.01.-10:00
            return $filter('date')(date, 'dd.MM.-HH:mm');
        }

        /*
         Loads data from the backend for an array for seriesNames String[].
         */
        function fetchDetails(seriesNames, startDate, endDate, count, sensitivity) {
            var startTime = dateToUrlString(startDate);
            var endTime = dateToUrlString(endDate);
            var ids = _(seriesNames).map(encodeURIComponent).join('&seriesid=');

            var url = '/backend/simulation/stammdaten/concretedata?seriesid=' + ids + '&start=' + startTime + '&end=' + endTime + '&maxcount=' + count;

            return $http.get(url,{cache:cache})
                .catch(function (data) {
                    console.error(data);
                })
                .then(function (response) {
                    /* The individual lengths of each series may be different, timestamps may not be perfectly aligned.
                     So, we need to convert these heterogeneous series into a Dygraph compatible format:
                     [[date,[min,avg,max],[...],null,[...]]
                     If there are no values for a series per time, insert a null instead of a [min,avg,max] array.
                     */
                    var result = [];
                    var i, d;
                    var data = response.data;

                    // reject series names which have no data
                    var rejectedSeriesNames = _.reject(seriesNames, function(seriesName) {
                        return _.contains(Object.keys(data), seriesName);
                    });

                    // only continue calculating dygraph data if no serienames were rejected
                    if(rejectedSeriesNames.length === 0) {
                        var maxLengths = _.map(seriesNames, function (seriesName) {
                            return data[seriesName].length;
                        });

                        var indices = _.range(0, seriesNames.length, 0);
                        while (true) {
                            var dates = [];
                            for (i = 0; i < indices.length; i++) {
                                if (indices[i] < maxLengths[i]) {
                                    // skip all entries in leap days
                                    while (inLeapDay(data[seriesNames[i]][indices[i]])) {
                                        indices[i]++;
                                    }
                                    d = data[seriesNames[i]][indices[i]];
                                    dates.push(toStandardYear(d.time).getTime());
                                }
                            }
                            if (dates.length === 0) {
                                break;
                            }
                            var minDate = _.min(dates);
                            // we ignore leap years, for simulation purposes only standard years are of interest
                            var gd = [toStandardYear(minDate)]; // one entry for each distinct element of the same index j per seriesName
                            for (i = 0; i < seriesNames.length; i++) {
                                var name = seriesNames[i];
                                var series = data[name];
                                d = series[indices[i]];
                                if (d !== undefined && toStandardYear(d.time).getTime() === minDate) {
                                    gd.push([d.min, d.avg, d.max]);
                                    indices[i]++;
                                } else {
                                    gd.push(null);
                                }
                            }
                            result.push(gd);
                        }
                        appendFinalDatapoint(result);
                        appendSensitivity(result, sensitivity);
                    } else {
                        // show console error if requested seriesnames were rejected
                        console.error('Rejected seriesnames', rejectedSeriesNames, ' because of no data from backend. Therefore no chart will be drawn.');
                    }

                    return result;
                });
        }


        /* We want to visualize time intervals. Dygraph only renders points. This means, that for example a series
         with just one value will be rendered as a single dot instead of a single horizontal line. Similarly,
         for longer series the chart will end at the last value's date, optically missing the last time interval.
         To mitigate this fact, we add a new dummy data point with a timestamp equidistant as the first pair of timestamps.
         */
      function appendFinalDatapoint(result) {
        var len = result.length;
        if (len >= 2) {
          var lastRow = result[len - 1];
          var sndToLastRow = result[len - 2];
          var tsLast = lastRow[0];
          var ts2ndLast = sndToLastRow[0];
          var ts = new Date(tsLast);
          ts.setTime(ts.getTime() + (tsLast.getTime() - ts2ndLast.getTime()));
          result.push([ts].concat(lastRow.slice(1)));
        }
        // if data has length 1, then add a second item at the end of the year due to draw a horizontal line on graph
        if (result.length === 1) {
          var currYear = result[0][0].getFullYear();
          var lastDayInYear = new Date(currYear+1, 0, 1);
          var lastDayInYearDygraphDataItem = angular.copy(result[0]);
          // set last day in year
          lastDayInYearDygraphDataItem[0] = lastDayInYear;
          result.push(lastDayInYearDygraphDataItem);
        }
      }
      // check if sensitivity is set and if true: calculate min and max values
      function appendSensitivity(result, sensitivity) {
        if (sensitivity && sensitivity.range.length === 2) {
          for (var i = 0; i < result.length; i++) {
            result[i].push(_.map(result[i][1], function (x) {
              if (sensitivity.mode === 'multiply') {
                return x * sensitivity.range[0];
              } else if (sensitivity.mode === 'add') {
                return x + sensitivity.range[0];
              }

            }));
            result[i].push(_.map(result[i][1], function (x) {
              if (sensitivity.mode === 'multiply') {
                return x * sensitivity.range[1];
              } else if (sensitivity.mode === 'add') {
                return x + sensitivity.range[1];
              }
            }));
          }
        }
      }

        function inLeapDay(long) {
            var date = new Date(long);
            return date.getDate() === 29 && date.getMonth() === 1;
        }

        function toStandardYear(long) {
            var date = new Date(long);
            return new Date(2015, date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
        }

        function mergeData(oldData, detailData) {
            if (!angular.isDefined(detailData) || detailData.length === 0) {
                return oldData;
            }
            // find the splicing point in oldData, insert detailData
            var lastLower = -1;
            var firstHigher = -1;
            var firstDetailDate = detailData[0][0];
            var lastDetailDate = detailData[detailData.length - 1][0];
            for (var i = 0; i < oldData.length; i++) {
                if (oldData[i][0] < firstDetailDate) {
                    lastLower = i;
                }
                if (firstHigher === -1 && oldData[i][0] > lastDetailDate) {
                    firstHigher = i;
                }
            }
            var lowerOld = (lastLower === -1) ? [] : oldData.slice(0, lastLower + 1);
            var upperOld = (firstHigher === -1) ? [] : oldData.slice(firstHigher);

            return lowerOld.concat(detailData).concat(upperOld);
        }
    });
