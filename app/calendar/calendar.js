'use strict';

angular.module('myApp.eventEdit', ['ngRoute',
    'ui.calendar']).controller('EventEditCtrl', ['$scope','$uibModalInstance', 'timelines',
    function($scope, $uibModalInstance, editConfig) {
        //   $scope.items = items;
        $scope.timelines = editConfig.all;
        $scope.timeline = editConfig.current;;
        console.log($scope.timeline );

        $scope.setChoice = function(choice) {
            $scope.timeline = choice;
        }

        $scope.ok = function() {

            $uibModalInstance.close({
              date:editConfig.date,
              timeline:$scope.timeline
            });
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }]);

angular.module('myApp.calendar', ['ngRoute',
    'ui.calendar'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/calendar', {
            templateUrl: 'calendar/calendar.html',
            controller: 'CalendarCtrl'
        });
    }])

    .controller('CalendarCtrl', ['$scope', 'lpcService', '$uibModal',
        function($scope, lpc, $uibModal) {

            $scope.timelines = lpc.getTimelines();
            var openEdit = function(selectedTime) {

                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'eventEdit.html',
                    controller: 'EventEditCtrl',
                    //size: 'lg',
                    resolve: {
                        timelines: function() {
                            return {
                              date: selectedTime.start,
                              current: selectedTime.title,
                              all: $scope.timelines
                            };
                        },
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    var updatedIndex =
                      lpc.setEvent(selectedItem.timeline, selectedItem.date);
                    var newEvents = lpc.getAllEventsForYear(new Date().getFullYear());
                    $scope.events[updatedIndex] = newEvents[updatedIndex];
                }, function() {
                    console.log("no more");
                });
            };


            $scope.eventSources = [];
            // TODO this does not handle changing years
            $scope.events = lpc.getAllEventsForYear(new Date().getFullYear());

            $scope.uiConfig = {
                calendar: {
                    height: 450,
                    editable: false,
                    header: {
                        left: 'month basicWeek',
                        center: 'title',
                        right: 'today prev,next'
                    },
                    eventClick: openEdit,
                    eventDrop: $scope.alertOnDrop,
                    eventResize: $scope.alertOnResize
                }
            };

            $scope.eventSources = [$scope.events];
            // $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];

        }]);
