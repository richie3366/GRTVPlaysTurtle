var config = require("./config.json"),
    io = require("socket.io").listen(config.port, { log: false });



var turtles = io.of("/turtle"),
    controllers = io.of("/control"),
    turtleList = {};


function sendCommand(turtle, cmd, socket) {
  if(config.commands.indexOf(cmd) === -1) {
    socket.emit("error", "unknown command");
    console.log("Unknown command", cmd);
  }
  else if(!turtleList.hasOwnProperty(turtle)) {
    socket.emit("error", "unknown turtle");
    console.log("Unknown turtle", turtle);
  }
  else if(socket.store.data.lastCommandDate > Date.now() + 5000) {
    socket.emit("error", "command too fast");
    console.log("Command too fast", cmd);
  }
  else {
    turtleList[turtle].emit("command", cmd);
    controllers.emit("command", { turtle: turtle, command: cmd });
    socket.store.data.lastCommandDate = Date.now();
    console.log("Command", cmd, "sent to turtle", turtle);
  }
}

turtles.on("connection", function(socket) {
  if(socket.handshake.query.key != config["turtle key"]) {
    socket.emit("unauthorized");
    socket.disconnect();
    return;
  }

  var turtleName = socket.handshake.query.name

  console.log("New turtle connected!", turtleName);
  controllers.emit("turtle connected", { name: turtleName });

  turtleList[turtleName] = socket;

  socket.on("disconnect", function() {
    delete turtleList[turtleName];
    controllers.emit("turtle disconnected", { name: turtleName });
  });

  socket.on("infos", function(data) {
    controllers.emit("infos", {
      name: turtleName,
      infos: data
    });
  });

  socket.on("ent", function(data) {
    controllers.emit("entities", {
      name: turtleName,
      entities: data
    });
  });
});


controllers.on("connection", function(socket) {
  socket.on("register", function(data) {
    // TODO: Login
  });

  socket.on("command", function(data) {
    sendCommand(data.name, data.command, socket);
  });

  socket.emit("command list", config.commands);
  socket.emit("turtle list", Object.keys(turtleList));
})