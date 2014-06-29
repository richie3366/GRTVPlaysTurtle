/**
 * GRTVPlaysTurtle -> Client -> Controllers -> TurtlesListCtrl
 */


"use strict";

var app = angular.module("GRTVPlaysTurtle");

app.controller("TurtlesListCtrl", function(socket, TurtlesList) {
  var self = this;

  socket.on("turtles list", function(data) {
    TurtlesList.import(data);
    self.list = TurtlesList.getList();
  });

  socket.on("turtle connected", function(data) {
    TurtlesList.add(data);
    self.list = TurtlesList.getList();
  });

  socket.on("turtle disconnected", function(id) {
    TurtlesList.remove(id);
    self.list = TurtlesList.getList();
  });

  socket.on("turtle update", function(data) {
    var t = TurtlesList.getTurtle(data.id);
    if(t) {
      t.update(data);
    }

    self.list = TurtlesList.getList();
  });

  this.select = function(id) {
    TurtlesList.select(id);
  };

  this.isSelected = function(turtle) {
    return TurtlesList.isSelected(turtle);
  };
});