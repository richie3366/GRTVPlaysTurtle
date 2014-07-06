/**
 * GRTVPlaysTurtle -> Client -> Controllers -> AppCtrl
 */


"use strict"; // <STRIP>

var app = angular.module("GRTVPlaysTurtle"); // <STRIP>

app.controller("AppCtrl", ["$rootScope", "socket", function($rootScope, socket) {
  $rootScope.commands = {};
  socket.on("command list", function(data) {
    $rootScope.commands = data;
  });
}]);