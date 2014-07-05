/**
 * GRTVPlaysTurtle -> Client -> Controllers -> AppCtrl
 */


"use strict";

var app = angular.module("GRTVPlaysTurtle");

app.controller("AppCtrl", function($rootScope, socket) {
  $rootScope.commands = {};
  socket.on("command list", function(data) {
    $rootScope.commands = data;
  });
});