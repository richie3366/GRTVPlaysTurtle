/**
 * GRTVPlaysTurtle -> Server -> Turtle
 */

"use strict";

var Turtle = function(data) {
  this.controller = Turtle.controller;
  this._id = data.id;
  this._socket = data.socket;
  this._name = data.name;

  this._location = {
    x: null,
    y: null,
    z: null
  };

  this._data = {};

  this.init();
};

Turtle.prototype = {
  init: function() {
    this._socket.on("set name", this.setName.bind(this));
    this._socket.on("set location", this.setLocation.bind(this));
    this._socket.on("update data", this.updateData.bind(this));
    this._socket.on("echo", console.log.bind(console));
    this._socket.on("disconnect", this.controller.handleTurtleDisconnection.bind(this.controller, this.getId()));
    this._socket.on("update entities", this.controller.updateEntities.bind(this.controller, this.getId()));
  },

  serialize: function() {
    return {
      id: this._id,
      name: this._name,
      location: this._location,
      data: this._data
    };
  },

  deserialize: function(/* data */) {

  },

  sendCommand: function(command) {
    this._socket.emit("command", command);
  },

  updateData: function(data) {
    for(var i in data) {
      this._data[i] = data[i];
    }
    this.controller.sendTurtleChanges(this.getId());

    return;
  },

  // Getters
  getSocket:    function() { return this._socket; },
  getName:      function() { return this._name; },
  getId:        function() { return this._id; },
  getLocation:  function() { return this._location; },
  getData:      function() { return this._data; },

  // Setters
  setSocket: function(s) { 
    this._socket = s;
    this.controller.sendTurtleChanges(this.getId());
    return this;
  },
  setName: function(n) { 
    this._name = n;
    this.controller.sendTurtleChanges(this.getId());
    return this;
  },
  setId: function(i) { 
    this._id = i;
    this.controller.sendTurtleChanges(this.getId());
    return this;
  },
  setLocation: function(l) { 
    this._location = l;
    this.controller.sendTurtleChanges(this.getId());
    return this;
  },
  setData: function(d) { 
    this._data = d;
    this.controller.sendTurtleChanges(this.getId());
    return this;
  }
};

module.exports = Turtle;