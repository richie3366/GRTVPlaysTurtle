/**
 * GRTVPlaysTurtle -> Server -> App
 */

"use strict";

var config = require("./config.json"),
    express = require("express"),
    compression = require("compression"),
    socketio = require("socket.io"),
    redis = require("redis"),
    cluster = require("cluster"),
    numCPUs = require("os").cpus().length,
    chalk = require("chalk");

if(cluster.isMaster) {
  var timeouts = [];
  var d = chalk.red("[MASTER]");
  var workerCount = config.workerCount === "CPU count" ? numCPUs : config.workerCount;

  cluster.setupMaster({ silent: true });
  cluster.on("fork", function(worker) {
    console.log(d, "forked #" + worker.id);
    timeouts[worker.id] = setTimeout(console.error.bind(console, d, "worker #" + worker.id + " is not listening..."), 2000);
  });
  
  cluster.on("listening", function(worker) {
    console.log(d, "worker #" + worker.id + " is listening");
    clearTimeout(timeouts[worker.id]);
  });

  cluster.on("exit", function(worker) {
    console.log(d, "worker #" + worker.id + " died");
  });

  console.log(d, chalk.italic("Starting", chalk.bold(workerCount), "workers"));

  for (var i = 0; i < workerCount; i++) {
    cluster.fork();
  }

  if(cluster.settings.silent) {
    var colors = ["green", "yellow", "blue", "magenta", "cyan", "gray", "white", "dim"];
    for(var j in cluster.workers) {
      cluster.workers[j].process.stdout.on("data", function(id, chunk) {
        var str = chalk[colors[id % colors.length]]("[WRK #" + id + "]") + " " + chunk;
        console.log(str.substring(0, str.length - 1));
      }.bind(cluster.workers[j].process.stderr, j));
      cluster.workers[j].process.stderr.on("data", function(id, chunk) {
        var str = chalk[colors[id % colors.length]]("[WRK #" + id + "]") + " " + chalk.red(chunk);
        console.warn(str.substring(0, str.length - 1));
      }.bind(cluster.workers[j].process.stderr, j));
    }
  }
}
else {
  var app = express(),
      server = require("http").createServer(app),
      io = socketio.listen(server),
      TurtlesController = require("./lib/turtlesController"),
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
    io.disable("log");
    io.set("transports", ["websocket"]);
  });

  var controller = new TurtlesController(io, store, config);
  controller.init();

  var staticDir = __dirname + (process.env.NODE_ENV === "production" ? "/dist" : "/client");

  app.use(compression());
  app.use("/", express.static(staticDir));

  server.listen(config.port);
}