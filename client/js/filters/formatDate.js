/**
 * GRTVPlaysTurtle -> Client -> Filters -> FormatDate
 */


"use strict"; // <STRIP>

var app = angular.module("GRTVPlaysTurtle"); // <STRIP>

app.filter("formatDate", function() {
  var fillZeros = function(i) { if(i < 10) return "0" + i.toString(); else return i; };
  return function(date) {
    date = new Date(date);
    return date.getHours() + ":" + fillZeros(date.getMinutes()) + ":" + fillZeros(date.getSeconds());
  };
});
