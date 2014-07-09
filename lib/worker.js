"use strict";

var config = require("../config.json"),
    path = require("path"),
    cluster = require("cluster"),
    chalk = require("chalk"),
    redis = require("redis"),
    socketio = require("socket.io"),
    express = require("express"),
    compression = require("compression"),
    morgan = require("morgan"),
    app = express(),
    server = require("http").createServer(app),
    TurtlesController = require("./turtlesController"),
    io = socketio.listen(server),
    redisPub, redisSub, store;

io.configure(function() {
  redisPub = redis.createClient();
  redisSub = redis.createClient();
  store = new socketio.RedisStore({
    redis: redis,
    redisPub: redisPub,
    redisSub: redisSub
  });
  store.on("error", console.error);
  io.set("store", store);
  io.disable("log");
});

io.configure("development", function() {
  io.set("transports", ["websocket"]);
});

var controller = new TurtlesController(io, store, config);
controller.init();

var staticDir = process.env.NODE_ENV === "production" ? "dist" : "client",
    port = process.argv[2] || config.port;

app.use(morgan("short"));
app.use(compression());

if(cluster.isWorker) {
  app.use(function(req, res, next) {
    res.set("Server", "Worker #" + cluster.worker.id);
    next();
  });
}
else {
  app.use(function(req, res, next) {
    res.set("Server", "Master");
    next();
  });
}

app.use("/", express.static(path.join(__dirname, "..", staticDir)));

server.listen(port, function() {
  console.log("Server is listening on port %s to serve %s", chalk.cyan(port), chalk.underline(staticDir));
});