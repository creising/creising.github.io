'use strict';

angular.module('myApp.overview', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/overview', {
            templateUrl: 'overview/overview.html',
            controller: 'OverviewCtrl'
        });
    }])

    .controller('OverviewCtrl', ['$scope', 'lpcService', function(sc, lpc) {

        var newArr = [];
        for (var i = 0; i < 10 ; i++) {
            var data = {key:"Fiat", value:"500"};
            newArr.push(data);
        }
        sc.systemData = lpc.getSystemData();
        sc.clockData = lpc.getClock();
        sc.projectInfo = lpc.getProjectInfo();
        sc.softwareVersion = lpc.getSoftwareVersion();
        sc.upcomingEvents = lpc.getUpcomingEvents();

    }]);
