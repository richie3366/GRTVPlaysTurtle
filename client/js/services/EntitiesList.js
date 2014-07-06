/**
 * GRTVPlaysTurtle -> Client -> Services -> EntitiesList
 */

"use strict"; // <STRIP>

var app = angular.module("GRTVPlaysTurtle"); // <STRIP>

app.factory("EntitiesList", ["$rootScope", function($rootScope) {
  var entities = {};
  $rootScope.selectedEntity = null;

  return {
    update: function(data) {
      entities = data;
      $rootScope.$emit("entities update");
    },
    get: function() {
      if(Object.keys(entities).length === 0) return false;
      return entities;
    },
    isSelected: function(id) {
      return $rootScope.selectedEntity === id;
    },
    select: function(id) {
      $rootScope.selectedEntity = entities.hasOwnProperty(id) ? id : null;
    },
    getSelectedEntity: function() {
      return entities[$rootScope.selectedEntity] || null;
    }
  };
}]);