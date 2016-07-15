'use strict';


angular.module('myApp.eventImport', []).controller('SaveConfigConfirmController', ['$scope','$uibModalInstance',
  function($scope, $uibModalInstance, editConfig) {

            $scope.ok = function () {
              $uibModalInstance.close();
            };

            $scope.cancel = function () {
              $uibModalInstance.dismiss();
            };
  }]);


angular.module('myApp.setup', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/setup', {
            templateUrl: 'setup/setup.html',
            controller: 'SetupCtrl'
        });
    }])

    .directive("fileread", [function () {
        return {
            scope: {
                fileread: "=",
                fileComplete: '&'
            },
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    var reader = new FileReader();
                    reader.onload = function (loadEvent) {
                      scope.fileComplete({arg: loadEvent.target.result});
                      element.val(null);
                    }
                    reader.readAsText(changeEvent.target.files[0]);
                });
            }
        }
    }])
    .controller('SetupCtrl', ['$scope', 'lpcService', '$uibModal',
        function($scope, lpc, $uibModal) {

          $scope.timelines = lpc.getTimelines();
          $scope.fileName = "";
          $scope.alerts = [];

          $scope.fileComplete = function(fileContent) {

              var results = Papa.parse(fileContent, {
              	dynamicTyping: true,
                //header: true,
                delimiter: ","
              });

              if(results.errors.length != 0) {
                console.error(results.errors);
                $scope.alerts.push({ type: 'danger',
                msg: 'Your file is not a valid CSV file. The file must have'
                + ' two columns (doy, timelineId) and have a header as a the'
                + ' first row. The values must be seperated by a comma.'});
                $scope.$apply();
                return;
              }

              var newEvents = results.data;
              var updatedEvents = [];
              var numEvents = newEvents.length;
              console.log("importing " + numEvents + " events");
              if(numEvents > 0) {
                var event = newEvents[0];
                if(!(event[0] === 'doy' && event[1] === 'timelineId')) {
                  $scope.alerts.push({ type: 'danger',
                  msg: 'The file must have a "doy" and "timelineId" column'});
                  $scope.$apply();
                  return;
                }
                else {
                  console.log("the file's headers are valid.");
                }
              }

              // skip the header's row
              for(i = 1 ; i < numEvents ; i++) {

                var event = newEvents[i];
                if(event.length != 2) {
                  continue;
                }
                var newDoy = event[0];
                if(newDoy < 1 || newDoy > 366) {
                  $scope.alerts.push({ type: 'danger',
                  msg: 'The day of year values must be greater than 0 and less'
                  +' than 367. Row ' + (i + 1) + ' has a value of ' + newDoy + '.'});
                  $scope.$apply();
                  return;
                }

                var dupIndex = updatedEvents.findIndex(function(existing) {
                  return existing.doy === newDoy;
                });

                if(dupIndex > -1) {
                  $scope.alerts.push({ type: 'danger',
                  msg: 'The day of year value ' + newDoy + ' is duplicated in your file.'});
                  $scope.$apply();
                  return;
                }
                updatedEvents.push({doy:newDoy, timelineId:event[1]});
              }

              $scope.updatedEvents = updatedEvents;

              var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'eventConfirm.html',
                controller: 'SaveConfigConfirmController',
                resolve: {}
              });

              modalInstance.result.then(function () {
                $scope.commitChanges();
              }, function () {
                $scope.cancelChanges();
              });
              console.log("events imported!");
          };

          $scope.commitChanges = function() {

            lpc.setAllEvents($scope.updatedEvents);
            $scope.alerts.push({ type: 'success',
              msg: 'Updates sent to controller'});
            console.log("updating LPC");
          }

          $scope.cancelChanges = function() {
            console.log("not imported");
            $scope.updatedEvents = null;
            $scope.fileName = "";
          }

          $scope.upload = function() {
            console.log("upload");
            reader.readAsText($scope.file);
          };

          $scope.import = function(fileName) {
            $scope.file = fileName.files[0];
            $scope.fileName = fileName.files[0].name;
            $scope.importExport = false;

            reader.readAsText($scope.file);
            // $scope.$apply();
          };

          $scope.export = function() {
            var csvData = Papa.unparse(lpc.getRawEventData());
            console.log(csvData);
            // FOR IE:
            var filename = "timed-events-" + moment().format('YYYY-MM-DD')+".csv"
            var blob = new Blob([csvData], {type: "application/csv"});
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blob, filename);
            }
            else{
                var e = document.createEvent('MouseEvents'),
                    a = document.createElement('a');

                a.download = filename;
                a.href = window.URL.createObjectURL(blob);
                a.dataset.downloadurl = ['text', a.download, a.href].join(':');
                e.initEvent('click', true, false, window,
                    0, 0, 0, 0, 0, false, false, false, false, 0, null);
                a.dispatchEvent(e);
            }
          };

          $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
            //$scope.$apply();
          };
        }]);
