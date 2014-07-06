/**
 * GRTVPlaysTurtle -> Client -> Services -> Socket
 */

"use strict"; // <STRIP>

var app = angular.module("GRTVPlaysTurtle"); // <STRIP>

app.factory("socket", ["socketFactory", function(socketFactory) {
  if(!window.io) {
    throw new Error("Socket.io is not loaded");
  }

  var socket = io.connect("/control", {
    port: 4321
  });

  return socketFactory({
    ioSocket: socket
  });
}]);