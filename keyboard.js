

function keyboardCTRL ({controlKeys, onKeyChange}) {
  this.ctrl = controlKeys;
  this.onKeyChange = onKeyChange;
  this.directionCommand = [];


  document.addEventListener('keydown', function(e) {
    this.keyDownFunc(e);
    }.bind(this));
  document.addEventListener('keyup', function(e) {
    this.keyUpFunc(e);
    }.bind(this));

  document.addEventListener('keyup', function(e) {
    this.keyUpFunc(e);
    }.bind(this));

}
keyboardCTRL.prototype.keyUpFunc = function(evt) {
  switch (evt.keyCode) {
    case this.ctrl[1]:
      if (this.directionCommand.includes("LEFT")) {
        this.directionCommand.removeElement("LEFT");
      }
      break;
    case this.ctrl[0]:
      if (this.directionCommand.includes("UP")) {
        this.directionCommand.removeElement("UP");
      }
      break;
    case this.ctrl[3]:
      if (this.directionCommand.includes("RIGHT")) {
        this.directionCommand.removeElement("RIGHT");
      }
      break;
    case this.ctrl[2]:
      if (this.directionCommand.includes("DOWN")) {
        this.directionCommand.removeElement("DOWN");
      }
      break;
  }
   this.onKeyChange(this.directionCommand);

  //Check if snake can move this direction
};

keyboardCTRL.prototype.keyDownFunc = function(evt) {
  switch (evt.keyCode) {
    case this.ctrl[0]:
      if (!this.directionCommand.includes("UP")) {
        this.directionCommand.push("UP");
        //console.log("this.ctrlFdbElement[0]",this.ctrlFdbElement[0]);
      }
      break;
    case this.ctrl[1]:
      if (!this.directionCommand.includes("LEFT")) {
        this.directionCommand.push("LEFT");
      }
      break;
    case this.ctrl[2]:
      if (!this.directionCommand.includes("DOWN")) {
        this.directionCommand.push("DOWN");
      }
      break;
    case this.ctrl[3]:
      if (!this.directionCommand.includes("RIGHT")) {
        this.directionCommand.push("RIGHT");
      }
      break;
    }
    this.onKeyChange(this.directionCommand);

};
