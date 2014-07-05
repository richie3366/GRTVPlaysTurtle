/**
 * GRTVPlaysTurtle -> Client -> Controllers -> StatsCtrl
 */


"use strict";

var app = angular.module("GRTVPlaysTurtle");

app.controller("StatsCtrl", function(socket) {
  var self = this;
  this.connected = null;
  this.commands = null;
  
  socket.on("stats", function(data) {
    self.connected = data.connected;
    self.commands = data.commands;
  });
});