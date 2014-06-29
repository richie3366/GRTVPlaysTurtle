/**
 * GRTVPlaysTurtle -> Client -> Controllers -> EntityCtrl
 */


"use strict";

var app = angular.module("GRTVPlaysTurtle");

app.controller("EntityCtrl", function($rootScope, $scope, EntitiesList, socket) {
  $rootScope.$watch("selectedEntity", function() {
    $scope.entity = EntitiesList.getSelectedEntity();
  });

  $rootScope.$on("entities update", function() {
    $scope.entity = EntitiesList.getSelectedEntity();
  });

  $scope.turtle = EntitiesList.getSelectedEntity();
});