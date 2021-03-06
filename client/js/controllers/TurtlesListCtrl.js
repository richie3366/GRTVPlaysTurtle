/**
 * GRTVPlaysTurtle -> Client -> Controllers -> TurtlesListCtrl
 */


"use strict"; // <STRIP>

var app = angular.module("GRTVPlaysTurtle"); // <STRIP>

app.controller("TurtlesListCtrl", ["socket", "TurtlesList", function(socket, TurtlesList) {
  var self = this;

  this.list = {};

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
}]);