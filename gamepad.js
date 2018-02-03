
function GamepadCTRL ({onAxisChange}) {
  this.onAxisChange = onAxisChange;
  this.directionCommand = [];
  this.lastAxes = [0,0];
  this.gamePadCache = {
    controller: {},
    buttons: [],
    buttonsCache: [],
    buttonsStatus: [],
    axesStatus: []
  };

window.addEventListener("gamepadconnected", this.connect.bind(this));
window.addEventListener("gamepaddisconnected", this.disconnect.bind(this));
this.update();
};


GamepadCTRL.prototype.connect = function(evt) {
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    evt.gamepad.index, evt.gamepad.id,
    evt.gamepad.buttons.length,  evt.gamepad.axes.length);

  this.gamePadCache.controller = evt.gamepad;
  console.log('Gamepad connected.', this.gamePadCache.controller);
};

GamepadCTRL.prototype.disconnect = function(evt) {
  delete this.gamePadCache.controller;
  console.log('Gamepad disconnected.');
};

GamepadCTRL.prototype.update = function() {
  this.gamePadCache.controller = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);

  //console.log("gamePadCache.controller",gamePadCache.controller);
  // get the gamepad object
  let  c = this.gamePadCache.controller[0] || {};

  // loop through axes and push their values to the array
  let axes = [];
  if(c.axes) {
    for(let a = 0, x = c.axes.length; a < x; a++) {
      axes.push(c.axes[a].toFixed(0)); // convert with keeping 2 decimals
    }
  }
  // assign received values
  this.gamePadCache.axesStatus = axes;
  //console.log("axes",axes);
  // return buttons for debugging purposes
  switch (this.gamePadCache.axesStatus[1]) {
    case  '-1':
      if (!this.directionCommand.includes("UP")) {
        this.directionCommand.push("UP");
        //console.log("this.ctrlFdbElement[0]",this.ctrlFdbElement[0]);
        console.log(this.directionCommand);
      }
      break;
    case '1':
      if (!this.directionCommand.includes("DOWN")) {
        this.directionCommand.push("DOWN");
        console.log(this.directionCommand);
      }
      break;
    default:
      if (this.directionCommand.includes("UP")) {
        this.directionCommand.removeElement("UP");
        console.log(this.directionCommand);
      }
      if (this.directionCommand.includes("DOWN")) {
        this.directionCommand.removeElement("DOWN");
        console.log(this.directionCommand);
      }
      break;
  };
  //console.log((this.gamePadCache.axesStatus[0]));
  switch (this.gamePadCache.axesStatus[0]) {
    case '-1':
      this.directionCommand.insertOnce("LEFT");
      console.log(this.directionCommand);
      break;
    case '1':
      this.directionCommand.insertOnce("RIGHT");
      console.log(this.directionCommand);
      break;
    default:
      if (this.directionCommand.includes("LEFT")) {
        this.directionCommand.removeElement("LEFT");
      }
      if (this.directionCommand.includes("RIGHT")) {
          this.directionCommand.removeElement("RIGHT");
        }
      break;
    }
    //console.log("this.cmdDirection",this.cmdDirection);


    if (typeof(this.directionCommand) !== "undefined")
    var change = this.lastAxes[0] !== this.gamePadCache.axesStatus[0] || this.lastAxes[1] !== this.gamePadCache.axesStatus[1];
    console.log("change",change);
    if (change) {
      this.onAxisChange(this.directionCommand);
      console.log("change");
    }
    this.lastAxes[0] = this.gamePadCache.axesStatus[0];
    this.lastAxes[1] = this.gamePadCache.axesStatus[1];
  requestAnimationFrame(function() { this.update(); }.bind(this));
};

Array.prototype.insertOnce = function(insert) {
  if (!this.includes(insert)) {
    this.push(insert);
  }
};


Array.prototype.removeOnce = function(insert) {
  if (this.includes(insert)) {
      this.removeElement(insert);
    }
};
