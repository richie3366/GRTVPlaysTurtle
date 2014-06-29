/**
 * GRTVPlaysTurtle -> Client -> Services -> EntitiesList
 */

"use strict";

var app = angular.module("GRTVPlaysTurtle");

app.factory("EntitiesList", ["$rootScope", function($rootScope, Turtle) {
  var entities = {};
  $rootScope.selectedEntity = null;

  return {
    update: function(data) {
      entities = data;
      $rootScope.$emit("entities update");
    },
    get: function() {
      return entities;
    },
    isSelected: function(id) {
      return $rootScope.selectedEntity === id;
    },
    select: function(id) {
      $rootScope.selectedEntity = entities.hasOwnProperty(id) ? id : null;
    },
    getSelectedEntity: function() {
      return entities[$rootScope.selectedEntity];
    }
  };
}]);