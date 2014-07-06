/**
 * GRTVPlaysTurtle -> Client -> Controllers -> EntityCtrl
 */


"use strict"; // <STRIP>

var app = angular.module("GRTVPlaysTurtle"); // <STRIP>

app.controller("EntityCtrl", ["$rootScope", "EntitiesList", function($rootScope, EntitiesList) {
  var self = this;

  $rootScope.$watch("selectedEntity", function() {
    self.entity = EntitiesList.getSelectedEntity();
  });

  $rootScope.$on("entities update", function() {
    self.entity = EntitiesList.getSelectedEntity();
  });

  this.entity = EntitiesList.getSelectedEntity();
}]);