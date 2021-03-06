/**
 * GRTVPlaysTurtle -> Client -> Controllers -> LogCtrl
 */


"use strict"; // <STRIP>

var app = angular.module("GRTVPlaysTurtle"); // <STRIP>

app.controller("LogCtrl", ["TurtlesList", "socket", function(TurtlesList, socket) {
  var self = this;

  this.lines = [];

  this.clear = function() {
    self.lines = [];
  };

  this.logMessage = function(message) {
    if(self.lines[0] && message === self.lines[0].message) {
      self.lines[0].count++;
      self.lines[0].date = Date.now();
    }
    else {
      self.lines.unshift({
        date: Date.now(),
        message: message,
        count: 1
      });  
    }
    self.lines = self.lines.slice(0, 14);
  };

  socket.on("command", function(data) {
    var t = TurtlesList.getTurtle(data.turtleId);
    self.logMessage("[" + (t ? t.getName() : "#" + data.turtleId) + "] Command: " + data.command);
  });

  socket.on("error", function(data) {
    console.log(data);
    if(data === "command too fast") {
      self.logMessage("Please wait 5sec between commands");
    }
  });

  socket.on("connect", function() {
    self.logMessage("Connected");
  });
  socket.on("disconnect", function() {
    self.logMessage("Disconnected");
  });
}]);