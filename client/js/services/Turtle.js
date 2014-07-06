/**
 * GRTVPlaysTurtle -> Client -> Services -> Turtle
 */

"use strict"; // <STRIP>

var app = angular.module("GRTVPlaysTurtle"); // <STRIP>

app.factory("Turtle", function() {
  var Turtle = function(data) {
    this.id = data.id;
    this.name = data.name;
    this.location = data.location;
    this.data = data.data;
  };

  Turtle.prototype = {
    update: function(data) {
      this.name = data.name || this.name;
      this.location = data.location || this.location;
      for(var i in data.data) {
        this.data[i] = data.data[i];
      }
    },

    getId: function() { return this.id; },
    getName: function() { return this.name; },
    getLocation: function() { return this.location; },
    getData: function() { return this.data; }
  };

  return Turtle;
});