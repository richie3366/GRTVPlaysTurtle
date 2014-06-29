/**
 * GRTVPlaysTurtle -> Client -> Controllers -> TurtleCtrl
 */


"use strict";

var app = angular.module("GRTVPlaysTurtle");

app.controller("TurtleCtrl", function($rootScope, $scope, TurtlesList, socket) {
  $rootScope.$watch("selectedTurtle", function() {
    $scope.turtle = TurtlesList.getSelectedTurtle();
  });

  $scope.turtle = TurtlesList.getSelectedTurtle();

  $scope.sendCommand = function(turtle, command) {
    socket.emit("command", { id: turtle.getId(), command: command });
  };
});