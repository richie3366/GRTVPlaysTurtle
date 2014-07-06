/**
 * GRTVPlaysTurtle -> Client -> Controllers -> TurtleCtrl
 */


"use strict"; // <STRIP>

var app = angular.module("GRTVPlaysTurtle"); // <STRIP>

app.controller("TurtleCtrl", ["$rootScope", "TurtlesList", "socket", function($rootScope, TurtlesList, socket) {
  var self = this;

  $rootScope.$watch("selectedTurtle", function() {
    self.turtle = TurtlesList.getSelectedTurtle();
  });

  this.turtle = TurtlesList.getSelectedTurtle();

  this.sendCommand = function(turtle, command) {
    socket.emit("command", { id: turtle.getId(), command: command });
  };
}]);