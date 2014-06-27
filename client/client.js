"use strict";

var commandInput = document.querySelector("#turtle-command"),
    sendCommandButton = document.querySelector("#send-command"),
    turtlesListElem = document.querySelector("#turtles .content"),
    turtlesList = {},
    turtleView = document.querySelector("#turtle-view"),
    logElem = document.querySelector("#log .content"),
    selectedTurtle = "",
    socket = io.connect("/control", {
      host: "sandhose.fr",
      port: 4321
    });


function sendCommand(command) {
  if(socket.socket.connected) {
    socket.emit("command", {
      command: command,
      id: selectedTurtle
    });
  }
  else {
    console.log("Socket disconnected!");
  }
}

function updateTurtles() {
  turtlesListElem.innerHTML = "";
  if(Object.keys(turtlesList).length === 0) {
    turtlesListElem.innerHTML = "No Turtle connected";
  }
  else {
    for(var i in turtlesList)  {
      if(selectedTurtle === turtlesList[i].data.id) {
        turtlesList[i].elem.classList.add("selected");
      }
      else {
        turtlesList[i].elem.classList.remove("selected");
      }
      turtlesListElem.appendChild(turtlesList[i].elem);
    }
  }

  turtleView.querySelector("h2").innerHTML = turtlesList[selectedTurtle] ? turtlesList[selectedTurtle].data.name : "No Turtle selected";

  var d = "";
  if(turtlesList[selectedTurtle]) { d = JSON.stringify(turtlesList[selectedTurtle].data, null, "  "); }
  turtleView.querySelector(".content").innerHTML = d;
}

function outputLog(message) {
  var e = document.createElement("div");
  e.className = "line";
  e.innerHTML = message;
  logElem.appendChild(e);
}

sendCommandButton.addEventListener("click", function() {
  sendCommand(commandInput.value);
});

socket.on("error", function(data) {
  outputLog(data);
});

socket.on("command", function(data) {
  outputLog("[" + data.turtle + "] " + data.command); 
});

socket.on("turtles list", function(data) {
  outputLog("Turtle list: " + JSON.stringify(data)); 
  for(var i in data) {
    turtlesList[data[i].id] = new Turtle(data[i]);
  }

  updateTurtles();
});

socket.on("command list", function(data) {
  outputLog("Available commands: " + JSON.stringify(data) ); 
});

socket.on("turtle connected", function(data) {
  outputLog("Turtle connected: #" + data.id + " - " + data.name); 
  turtlesList[data.id] = new Turtle(data);

  updateTurtles();
});

socket.on("turtle disconnected", function(id) {
  outputLog("Turtle disconnected: " + id); 
  delete turtlesList[id];
  updateTurtles();
});

socket.on("turtle update", function(data) {
  if(turtlesList[data.id]) {
    turtlesList[data.id].updateData(data);
  }

  updateTurtles();
});


var Turtle = function(data) {
  this.data = data;
  this.buildDom();
};

Turtle.prototype = {
  buildDom: function() {
    this.elem = document.createElement("div");
    this.elem.className = "turtle";

    this.elem.addEventListener("click", this._click.bind(this));

    this._turtleName = document.createElement("div");
    this._turtleName.className = "turtle-name";

    this._turtlePos = document.createElement("div");
    this._turtlePos.className = "turtle-pos";

    this.elem.appendChild(this._turtleName);
    this.elem.appendChild(this._turtlePos);

    this.updateDom();
  },

  updateDom: function() {
    this._turtleName.innerHTML = this.data.name;
    this._turtlePos.innerHTML = "X: " + this.data.location.x + " ; Y: " + this.data.location.y + " ; Y: " + this.data.location.z;
  },

  updateData: function(data) {
    this.data = data;
    this.updateDom();
  },

  _click: function() {
    selectedTurtle = this.data.id;
    updateTurtles();
  }
};