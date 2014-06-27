var commandInput = document.querySelector("#turtle-command"),
    turtleNameInput = document.querySelector("#turtle-name"),
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
      name: selectedTurtle
    });
  }
  else {
    console.log("Socket disconnected!");
  }
}

function updateTurtles() {
  turtlesListElem.innerHTML = "";

  for(var i in turtlesList)  {
    if(selectedTurtle === i) {
      turtlesList[i].elem.classList.add("selected");
    }
    else {
      turtlesList[i].elem.classList.remove("selected");
    }
    turtlesListElem.appendChild(turtlesList[i].elem);
  }

  turtleView.querySelector("h2").innerHTML = selectedTurtle || "No Turtle selected";

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

socket.on("turtle list", function(data) {
  outputLog("Turtle list: " + JSON.stringify(data)); 
  for(var i in data) {
    turtlesList[data[i]] = new Turtle({ name: data[i], infos: { pos: {}}});
  }

  updateTurtles();
});

socket.on("command list", function(data) {
  outputLog("Available commands: " + JSON.stringify(data) ); 
});

socket.on("turtle connected", function(data) {
  outputLog("Turtle connected! " + data.name); 
  turtlesList[data.name] = new Turtle(data);

  updateTurtles();
});

socket.on("turtle disconnected", function(data) {
  outputLog("Turtle disconnected: " + data.name); 
  delete turtlesList[data.name];
  updateTurtles();
});

socket.on("entities", function(data) {
  if(turtleList[data.name]) {
    turtleList[data.name].updateData("entities", data.entities);
  }

  updateTurtles();
});

socket.on("infos", function(data) {
  if(turtleList[data.name]) {
    turtleList[data.name].updateData("infos", data.infos);
  }

  updateTurtles();
});


var Turtle = function(data) {
  this.data = {
    name: data.name || "No name",
    infos: {
      pos: {
        x: 0,
        y: 0,
        z: 0
      }
    }
  };
  this.buildDom();
}

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
    this._turtlePos.innerHTML = "X: " + this.data.infos.pos.x + " - Y: " + this.data.infos.pos.y + " - Y: " + this.data.infos.pos.z;
  },

  updateData: function(key, value) {
    this.data[key] = value;
  },

  _click: function() {
    selectedTurtle = this.data.name;
    updateTurtles();
  }
}