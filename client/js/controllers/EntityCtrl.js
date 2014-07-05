/**
 * GRTVPlaysTurtle -> Client -> Controllers -> EntityCtrl
 */


"use strict";

var app = angular.module("GRTVPlaysTurtle");

app.controller("EntityCtrl", function($rootScope, EntitiesList, socket) {
  var self = this;

  $rootScope.$watch("selectedEntity", function() {
    self.entity = EntitiesList.getSelectedEntity();
  });

  $rootScope.$on("entities update", function() {
    self.entity = EntitiesList.getSelectedEntity();
  });

  this.entity = EntitiesList.getSelectedEntity();
});