'use strict';

angular.module('myApp.control', ['ngRoute', 'ui.bootstrap', 'ngAnimate',
  'ngSanitize',
  'ngToast'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/control', {
            templateUrl: 'control/control.html',
            controller: 'ControlCtrl'
        });
    }])

    .config(['ngToastProvider', function(ngToastProvider) {
        ngToastProvider.configure({
            animation: 'fade',
            verticalPosition: 'bottom'
        });
    }])

    .controller('ControlCtrl', ['$scope','lpcService', 'ngToast',
     function($scope, lpc, ngToast) {
        var timelines = lpc.getTimelines();
        if(timelines.length > 0) {
            $scope.timeline = timelines[0];
        }

        $scope.timelines = timelines;

        $scope.setChoice = function(data) {
            $scope.timeline = data;
        }

        $scope.playShow = function () {
            ngToast.create('Now playing: ' + $scope.timeline);
        }
    }]);
