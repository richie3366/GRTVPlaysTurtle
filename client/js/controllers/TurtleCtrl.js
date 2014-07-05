/**
 * GRTVPlaysTurtle -> Client -> Controllers -> TurtleCtrl
 */


"use strict";

var app = angular.module("GRTVPlaysTurtle");

app.controller("TurtleCtrl", function($rootScope, TurtlesList, socket) {
  var self = this;

  $rootScope.$watch("selectedTurtle", function() {
    self.turtle = TurtlesList.getSelectedTurtle();
  });

  this.turtle = TurtlesList.getSelectedTurtle();

  this.sendCommand = function(turtle, command) {
    socket.emit("command", { id: turtle.getId(), command: command });
  };
});