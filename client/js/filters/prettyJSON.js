/**
 * GRTVPlaysTurtle -> Client -> Filters -> PrettyJSON
 */


"use strict";

var app = angular.module("GRTVPlaysTurtle");

app.filter("prettyJSON", ["$sce", function($sce) {
  if(!window.hljs) {
    return function(object, flat) {
      return $sce.trustAsHtml(object ? JSON.stringify(object, null, flat ? undefined : "  ") : "");
    }
  }
  else {
    return function(object, flat) {
      return $sce.trustAsHtml(object ? hljs.highlight("json", JSON.stringify(object, null, flat ? undefined : "  ")).value : "");
    }
  }
}]);