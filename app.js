/**
 * GRTVPlaysTurtle -> Server -> App
 */


var config = require("./config.json"),
    express = require('express'),
    app = express(),
    server = require("http").createServer(app),
    compression = require("compression"),
    io = require("socket.io").listen(server, { log: false }),
    TurtlesController = require("./lib/turtlesController");


var controller = new TurtlesController(io, config);
controller.init();

app.use(compression())
app.use("/", express.static(__dirname + "/dist"))

server.listen(config.port);