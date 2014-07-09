/**
 * GRTVPlaysTurtle -> Server -> App
 */

"use strict";

var config = require("./config.json"),
    cluster = require("cluster"),
    numCPUs = require("os").cpus().length,
    chalk = require("chalk"), 
    winston = require("winston"),
    l = {},
    colors = ["green", "yellow", "blue", "magenta", "cyan", "gray", "white", "dim"];

winston.add(winston.transports.File, { filename: "logs/all.log"})

l.master = winston.loggers.add("master", {
  console: {
    colorize: "true",
    label: chalk.red("Master")
  },
  file: {
    filename: "logs/master.log"
  }
});


if(cluster.isMaster) {
  var timeouts = [];
  var workerCount = config.workerCount === "CPU count" ? numCPUs : config.workerCount;

  cluster.setupMaster({
    silent: true,
    exec: "lib/worker.js"
  });

  cluster.on("fork", function(worker) {
    l.master.info("forked #" + worker.id);
    timeouts[worker.id] = setTimeout(l.master.warn.bind(l.master, "worker #" + worker.id + " is not listening..."), 2000);
  });
  
  cluster.on("listening", function(worker) {
    l.master.info("worker #" + worker.id + " is listening");
    clearTimeout(timeouts[worker.id]);
  });

  cluster.on("exit", function(worker) {
    l.master.info("worker #" + worker.id + " died");
  });

  l.master.info(chalk.italic("Starting", chalk.bold(workerCount), "workers"));

  for (var i = 0; i < workerCount; i++) {
    cluster.fork();
  }


  if(cluster.settings.silent) {
    for(var j in cluster.workers) {

      l["worker" + j] = winston.loggers.add("worker" + j, {
        console: {
          colorize: true,
          label: chalk[colors[j % colors.length]]("Wrk #" + j)
        },
        file: {
          filename: "logs/worker-" + j + ".log" 
        }
      });

      cluster.workers[j].process.stdout.on("data", function(id, chunk) {
        var str = chunk.toString();
        l["worker" + id].info(str.substring(0, str.length - 1));
      }.bind(cluster.workers[j].process.stderr, j));

      cluster.workers[j].process.stderr.on("data", function(id, chunk) {
        var str = chunk.toString();
        l["worker" + id].warn(str.substring(0, str.length - 1));
      }.bind(cluster.workers[j].process.stderr, j));
    }
  }
}
else {
  console.log(chalk.error("I used to be the master."));
}