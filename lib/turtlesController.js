var Turtle = require("./turtle");

var TurtlesController = function(io, config) {
  this._io = io;
  this._config = config;
};

TurtlesController.prototype = {
  _list: {},
  _lastIndex: 0,
  init: function() {
    Turtle.controller = this;
    this._turtles = this._io.of("/turtle");
    this._turtles.on("connection", this.handleTurtleConnection.bind(this));
    this._controllers = this._io.of("/control");
    this._controllers.on("connection", this.handleControllerConnection.bind(this));
    return this;
  },

  handleTurtleConnection: function(socket) {
    if(this._config["turtle key"] && socket.handshake.query.key != this._config["turtle key"]) {
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

    this._controllers.emit("turtle connected", turtle.serialize());
  },

  handleTurtleDisconnection: function(id) {
    var turtle = this.getTurtle(id);
    if(turtle) {
      this._controllers.emit("turtle disconnected", turtle.getId());
      delete this._list[id];
    }
  },

  handleControllerConnection: function(socket) {
    socket.broadcast.emit("client connected");
    socket.on("disconnect", this.handleControllerDisconnection.bind(this));
    socket.on("command", this.handleCommand.bind(this, socket));

    socket.emit("command list", this._config.commands);
    socket.emit("turtles list", this.getTurtles());
  },

  handleControllerDisconnection: function() {
    this._controllers.emit("client disconnected");
  },

  handleCommand: function(socket, data) {
    var turtle = this.getTurtle(data.id);
    if(this._config.commands.indexOf(data.command) === -1) {
      socket.emit("error", "unknown command");
      console.log("Unknown command", data.command);
    }
    else if(!turtle) {
      socket.emit("error", "unknown turtle");
      console.log("Unknown turtle", data.id);
    }
    else if(socket.store.data.lastCommandDate > Date.now() + 5000) {
      socket.emit("error", "command too fast");
      console.log("Command too fast", data.command);
    }
    else {
      turtle.sendCommand(data.command);
      this._controllers.emit("command", { turtleId: turtle.getId(), command: data.command });
      socket.store.data.lastCommandDate = Date.now();
      console.log("Command", data.command, "sent to turtle", turtle.getName());
    }
  },

  sendTurtleChanges: function(id) {
    this._controllers.emit("turtle update", this.getTurtle(id).serialize());
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