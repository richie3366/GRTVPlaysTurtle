/**
 * GRTVPlaysTurtle -> Server -> TurtlesController
 */

"use strict";

var Turtle = require("./turtle"), EntitiesController = require("./entitiesController");

var TurtlesController = function(io, store, config) {
  this._io = io;
  this._config = config;
  this._store = store;
  this.entities = new EntitiesController();

  this._sub = store.sub;
  this._pub = store.pub;

  store.subscribe("stats", this.handleSubStatUpdate.bind(this));
  store.subscribe("turtle connected", this.handleTurtleSubConnection.bind(this));
  store.subscribe("turtle disconnected", this.handleTurtleSubDisconnection.bind(this));
  store.subscribe("turtle command", this.handleSubCommand.bind(this));
  store.subscribe("turtle update", this.handleSubTurtleUpdate.bind(this));
  store.subscribe("entities update", this.handleSubEntitiesUpdate.bind(this));
};

TurtlesController.prototype = {
  _list: {},
  _lastIndex: 0,
  _controllersCount: 0,
  _commandsCount: 0,
  init: function() {
    Turtle.controller = this;
    this._turtles = this._io.of("/turtle");
    this._turtles.on("connection", this.handleTurtleConnection.bind(this));
    this._controllers = this._io.of("/control");
    this._controllers.on("connection", this.handleControllerConnection.bind(this));
    return this;
  },

  handleTurtleConnection: function(socket) {
    if(this._config["turtle key"] && socket.handshake.query.key !== this._config["turtle key"]) {
      socket.emit("unauthorized");
      console.log("Turtle unauthorized");
      return;
    }

    this._lastIndex++;
    var turtle = new Turtle({
      id: this._lastIndex,
      socket: socket,
      name: socket.handshake.query.name || null
    });

    this._list[this._lastIndex] = turtle;

    console.log("Turtle connected #" + turtle.getId() + " : " + turtle.getName());

    this._controllers.emit("turtle connected", turtle.serialize());
    this._store.publish("turtle connected", { turtle: turtle.serialize(), lastIndex: this._lastIndex });
  },

  handleTurtleSubConnection: function(data) {
    this._lastIndex = data.lastIndex;
    var turtle = new Turtle({
      id: data.turtle.id,
      name: data.turtle.name
    });

    this._list[data.turtle.id] = turtle;
  },

  handleTurtleDisconnection: function(id) {
    var turtle = this.getTurtle(id);
    if(turtle) {
      this._controllers.emit("turtle disconnected", turtle.getId());
      delete this._list[id];
    }

    console.log("Turtle disconnected #" + turtle.getId() + " : " + turtle.getName());
    this.entities.removeTurtle(id);
    this._controllers.emit("entities", this.entities.getEntities());
    this._store.publish("turtle disconnected", { id: turtle.getId() });
  },

  handleTurtleSubDisconnection: function(data) {
    var t = this.getTurtle(data.id);
    if(t) {
      this.entities.removeTurtle(data.id);
      delete this._list[data.id];
    }
  },

  handleControllerConnection: function(socket) {
    socket.on("disconnect", this.handleControllerDisconnection.bind(this));
    socket.on("command", this.handleCommand.bind(this, socket));

    socket.emit("command list", this._config.commands);
    socket.emit("turtles list", this.getTurtles());

    socket.emit("entities", this.entities.getEntities());

    this._controllersCount++;
    this._controllers.emit("stats", { connected: this._controllersCount, commands: this._commandsCount });
    this._store.publish("stats", { connected: this._controllersCount, commands: this._commandsCount });
  },

  handleSubStatUpdate: function(data) {
    this._controllersCount = data.connected;
    this._commandsCount = data.commands;
  },

  handleControllerDisconnection: function() {
    this._controllers.emit("client disconnected");
    this._controllersCount--;
    this._controllers.emit("stats", { connected: this._controllersCount, commands: this._commandsCount });
    this._store.publish("stats", { connected: this._controllersCount, commands: this._commandsCount });
  },

  handleCommand: function(socket, data) {
    var turtle = this.getTurtle(data.id),
        self = this;
    if(!this._config.commands.hasOwnProperty(data.command)) {
      socket.emit("error", "unknown command");
    }
    else if(!turtle) {
      socket.emit("error", "unknown turtle");
    }
    else {
      socket.get("lastCommandDate", function(err, lastCommandDate) {
        if(err) {
          socket.emit("error", "internal error");
          console.log("internal error", err);
        }
        else if(lastCommandDate && lastCommandDate > Date.now() - (self._config.slow * 1000)) {
          socket.emit("error", "command too fast");
          //console.log("Command too fast", data.command);
        }
        else {
          if(turtle.hasSocket) {
            turtle.sendCommand(data.command);
          }
          else {
            self._store.publish("turtle command", { id: turtle.getId(), command: data.command });
          }
          socket.set("lastCommandDate", Date.now());
          console.log("Command", data.command, "sent to turtle", turtle.getName());

          self._commandsCount++;
          self._controllers.volatile.emit("command", { turtleId: turtle.getId(), command: data.command });
          self._controllers.volatile.emit("stats", { connected: self._controllersCount, commands: self._commandsCount });
        }
      });
    }
  },

  handleSubCommand: function(data) {
    var t = this.getTurtle(data.id);
    if(t && t.hasSocket) {
      t.sendCommand(data.command);
    }
  },

  handleSubTurtleUpdate: function(data) {
    var t = this.getTurtle(data.id);
    if(t) {
      t.updateRaw(data);
    }
  },

  updateEntities: function(id, entities) {
    this.entities.update(id, entities);
    this._controllers.emit("entities", this.entities.getEntities());
    this._store.emit("entities update", { id: id, entities: entities });
    return this;
  },

  handleSubEntitiesUpdate: function(data) {
    this.entities.update(data.id, data.entities);
  },

  sendTurtleChanges: function(id) {
    this._controllers.emit("turtle update", this.getTurtle(id).serialize());
    this._store.publish("turtle update", this.getTurtle(id).serialize());
  },

  getTurtle: function(id) {
    return this._list[id];
  },

  getTurtles: function() {
    var t = [];
    for(var i in this._list) {
      t.push(this._list[i].serialize());
    }
    return t;
  }
};

module.exports = TurtlesController;