var config = require("./config.json"),
    io = require("socket.io").listen(config.port),
    TurtlesController = require("./lib/turtlesController");


var controller = new TurtlesController(io, config);
controller.init();