/**
 * GRTVPlaysTurtle -> Client -> Services -> TurtlesList
 */

"use strict";

var app = angular.module("GRTVPlaysTurtle");

app.factory("TurtlesList", ["$rootScope", "Turtle", function($rootScope, Turtle) {
  var turtlesList = {};
  $rootScope.selectedTurtle = null;

  return {
    import: function(data) {
      turtlesList = {};
      for(var i in data) {
        var newTurtle = new Turtle(data[i]);
        turtlesList[newTurtle.getId()] = newTurtle;
      }

      return turtlesList;
    },
    add: function(turtle) {
      if(turtle instanceof Turtle) {
        turtlesList[turtle.getId()] = turtle;
      }
      else {
        var newTurtle = new Turtle(turtle);
        turtlesList[newTurtle.getId()] = newTurtle;
      }
    },
    remove: function(id) {
      delete turtlesList[id];
      return;
    },
    clear: function() {
      turtlesList = {};
      $rootScope.selectedTurtle = null;
      return;
    },
    getTurtle: function(id) {
      return turtlesList[id];
    },
    getList: function() {
      if(Object.keys(turtlesList).length === 0) return false;
      return turtlesList;
    },
    getSelectedTurtle: function() {
      return turtlesList[$rootScope.selectedTurtle] || false;
    },
    select: function(id) {
      if(id instanceof Turtle) {
        id = id.getId();
      }

      $rootScope.selectedTurtle = turtlesList.hasOwnProperty(id) ? id : null;
    },
    isSelected: function(turtle) {
      if(turtle instanceof Turtle) {
        return $rootScope.selectedTurtle === turtle.getId();
      }
      else {
        return $rootScope.selectedTurtle === turtle;
      }
    }
  };
}]);