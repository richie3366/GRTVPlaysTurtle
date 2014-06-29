/**
 * GRTVPlaysTurtle -> Client -> Controllers -> LogCtrl
 */


"use strict";

var app = angular.module("GRTVPlaysTurtle");

app.controller("LogCtrl", function($scope, socket) {
  socket.on("command", function(data) {
    console.log(data);
  })
});