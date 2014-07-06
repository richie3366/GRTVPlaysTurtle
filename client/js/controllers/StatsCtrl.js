/**
 * GRTVPlaysTurtle -> Client -> Controllers -> StatsCtrl
 */


"use strict"; // <STRIP>

var app = angular.module("GRTVPlaysTurtle"); // <STRIP>

app.controller("StatsCtrl", ["socket", function(socket) {
  var self = this;
  this.connected = null;
  this.commands = null;
  
  socket.on("stats", function(data) {
    self.connected = data.connected;
    self.commands = data.commands;
  });
}]);