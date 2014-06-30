/**
 * GRTVPlaysTurtle -> Client -> Filters -> FormatDate
 */


"use strict";

var app = angular.module("GRTVPlaysTurtle");

app.filter("formatDate", function() {
  var fillZeros = function(i) { if(i < 10) return "0" + i.toString(); else return i}
  if(!window.moment) {
    return function(date) {
      date = new Date(date);
      return date.getHours() + ":" + fillZeros(date.getMinutes()) + ":" + fillZeros(date.getSeconds());
    }
  }
  else {
    return function(date) {
      return moment(date).fromNow(); // lol nope
    }
  }
});
