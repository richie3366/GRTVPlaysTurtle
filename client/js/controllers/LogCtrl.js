/**
 * GRTVPlaysTurtle -> Client -> Controllers -> LogCtrl
 */


"use strict";

var app = angular.module("GRTVPlaysTurtle");

app.controller("LogCtrl", function(TurtlesList, socket) {
  var self = this;

  this.lines = [];

  this.clear = function() {
    self.lines = [];
  };

  this.logMessage = function(message) {
    self.lines.unshift({
      date: Date.now(),
      message: message
    });
  }
  socket.on("command", function(data) {
    var t = TurtlesList.getTurtle(data.turtleId);
    self.logMessage("[" + (t ? t.getName() : "#" + data.turtleId) + "] Command: " + data.command);
  });

  this.logMessage("Connected");
});