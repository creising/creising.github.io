'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.overview',
  'myApp.calendar',
  'myApp.control',
  'myApp.version',
  'myApp.lpcservice',
  'myApp.eventEdit',
  'ui.bootstrap',
  'ngToast',
  'ui.calendar'
]).
config(['$locationProvider', '$routeProvider',
 function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/overview'});
}]);
