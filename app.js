/**
 * GRTVPlaysTurtle -> Server -> App
 */


var config = require("./config.json"),
    io = require("socket.io").listen(config.port, { log: false }),
    TurtlesController = require("./lib/turtlesController");


var controller = new TurtlesController(io, config);
controller.init();