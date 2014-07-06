/**
 * GRTVPlaysTurtle -> Client -> Controllers -> EntitiesListCtrl
 */


"use strict"; // <STRIP>

var app = angular.module("GRTVPlaysTurtle"); // <STRIP>

app.controller("EntitiesListCtrl", ["socket", "EntitiesList", function(socket, EntitiesList) {
  var self = this;

  this.list = {};

  socket.on("entities", function(data) {
    EntitiesList.update(data);
    self.list = EntitiesList.get();
  });

  this.select = function(id) {
    EntitiesList.select(id);
  };

  this.isSelected = function(turtle) {
    return EntitiesList.isSelected(turtle);
  };
}]);