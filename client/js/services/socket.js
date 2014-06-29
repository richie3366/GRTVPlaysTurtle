/**
 * GRTVPlaysTurtle -> Client -> Services -> Socket
 */

"use strict";

var app = angular.module("GRTVPlaysTurtle");

app.factory("socket", ["$rootScope", function($rootScope) {
  if(!window.io) {
    throw new Error("Socket.io is not loaded");
  }

  var socket = io.connect("/control", {
    port: 4321
  });

  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
}]);