var commandInput = document.getElementById("turtle-command"),
    turtleNameInput = document.getElementById("turtle-name"),
    sendCommandButton = document.getElementById("send-command"),
    logElem = document.getElementById("log"),
    socket = io.connect("/control", {
      host: "sandhose.fr",
      port: 4321
    });


function sendCommand(turtle, command) {
  if(socket.socket.connected) {
    socket.emit("command", { 
      command: command,
      name: turtle
    });
  }
  else {
    console.log("Socket disconnected!");
  }
}


sendCommandButton.addEventListener("click", function() {
  sendCommand(turtleNameInput.value, commandInput.value);
});

socket.on("error", function(data) {
  log.innerHTML += data + "\n";
});

socket.on("command", function(data) {
  log.innerHTML += "[" + data.turtle + "] " + data.command + "\n"; 
});

socket.on("turtle list", function(data) {
  log.innerHTML += "Turtle list: " + JSON.stringify(data) + "\n"; 
});

socket.on("command list", function(data) {
  log.innerHTML += "Available commands: " + JSON.stringify(data) + "\n"; 
});

socket.on("turtle connected", function(data) {
  log.innerHTML += "Turtle connected! " + data.name + "\n"; 
});

socket.on("turtle disconnected", function(data) {
  log.innerHTML += "Turtle disconnected: " + data.name + "\n"; 
});