/**
 * GRTVPlaysTurtle -> Server -> EntitiesController
 */

"use strict";

var EntitiesController = function() {
  this.entities = {};
  this.entitiesPerTurtle = {};
};

EntitiesController.prototype = {
  update: function(turtle, ent) {
    this.entitiesPerTurtle[turtle] = Object.keys(ent);

    for(var i in ent) {
      this.entities[i] = ent[i];
    }

    this.cleanup();
  },
  cleanup: function() {
    var temp = [];
    for(var i in this.entitiesPerTurtle) {
        temp.push(this.entitiesPerTurtle[i]);
    }
    var entitiesList = Array.prototype.concat.apply([], temp);

    for(var j in this.entities) {
      if(entitiesList.indexOf(j) === -1) {
        delete this.entities[j];
      }
    }
  },
  getEntities: function() {
    return this.entities;
  },
  removeTurtle: function(turtle) {
    delete this.entitiesPerTurtle[turtle];
    this.cleanup();
  }
};

module.exports = EntitiesController;