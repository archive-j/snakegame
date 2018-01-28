//SYMBOL

function Game(setupData, i_canvas, startLength, ctrl) {
//  console.log(document.getElementsByClassName('ctrl'));
  this.ctrlFdbElement = document.getElementsByClassName('ctrl');
  //  console.log("ctrl",ctrlFdbElement);
  this.isRunning = true;
  //Save to the local storage
  localStorage.setItem('gameStartData', JSON.stringify(setupData));
  console.log("GameSetupSavedToTheLocalStorage", setupData);

  this.canvas = i_canvas;
  this.cxt = this.canvas.getContext ("2d");

  this.ctrl = ctrl;
  this.snkLength = startLength;

  this.sizeX = setupData.mapWidth;
  this.sizeY = setupData.mapHeight;
  this.unit = setupData.mapUnit;

  this.canvas.width = this.sizeX * this.unit; // a pálya méretének beállítása
  this.canvas.height = this.sizeY * this.unit;
  this.px = getRandomInt(this.sizeX); //snake on the middle
  this.py = getRandomInt(this.sizeY); // this on the middle
  this.vx = 0;
  this.vy = 0;
  this.nextVx = 1;
  this.nextVy = 0;
  this.trail = [];
  this.fps = 3;// frame per second
  this.score =  0;

  this.map = new Array(this.sizeX).fill().map(()=>new Array(this.sizeY).fill("empty"));
  this.ctrlQueue = [];
  this.ctrlQueValid = [];
    //snake2 = new MySnake(sizeX, sizeY, 2, [38, 37, 12, 39]); //arrows
    //document.addEventListener('keydown', snake2.keyPushFunc.bind(snake2)); // fgv referencia-t vár
    // document.addEventListener('keydown', function(e) {
    //   snake.keyPushFunc(e);

}

Game.prototype.pauseGame = function() {
  console.log("this.SessionId", this.SessionId);
  if (this.SessionId) {
    console.log("this.SessionId", this.SessionId);
    clearInterval(this.SessionId);
  } // pause game
};

Game.prototype.continueGame = function() {
  this.SessionId = setInterval(this.updateGame.bind(this), 1000/this.fps); // start game
};

Game.prototype.updateGame = function() {
  this.clearBoard();
  this.moveSnake();
  this.drawBoard();
};

this.clearBoard = function() {
    this.cxt.clearRect (0, 0, this.canvas.width, this.canvas.height);
};

Game.prototype.keyUpFunc = function(evt) {
  switch (evt.keyCode) {
    case this.ctrl[1]:
      if (this.ctrlQueue.includes("LEFT")) {
        this.ctrlQueue.removeElement("LEFT");
        setPressed(this.ctrlFdbElement[1], false);
      }
      break;
    case this.ctrl[0]:
      if (this.ctrlQueue.includes("UP")) {
        this.ctrlQueue.removeElement("UP");
        setPressed(this.ctrlFdbElement[0], false);
      }
      break;
    case this.ctrl[3]:
      if (this.ctrlQueue.includes("RIGHT")) {
        this.ctrlQueue.removeElement("RIGHT");
        setPressed(this.ctrlFdbElement[3], false);
      }
      break;
    case this.ctrl[2]:
      if (this.ctrlQueue.includes("DOWN")) {
        this.ctrlQueue.removeElement("DOWN");
        setPressed(this.ctrlFdbElement[2], false);
      }
      break;
  }
  //Check if snake can move this direction
  this.validateDir();
};

Game.prototype.keyDownFunc = function(evt) {
  switch (evt.keyCode) {
    case this.ctrl[0]:
      if (!this.ctrlQueue.includes("UP")) {
        this.ctrlQueue.push("UP");
        //console.log("this.ctrlFdbElement[0]",this.ctrlFdbElement[0]);
        setPressed(this.ctrlFdbElement[0], true);
      }

      break;
    case this.ctrl[1]:
      if (!this.ctrlQueue.includes("LEFT")) {
        this.ctrlQueue.push("LEFT");
        setPressed(this.ctrlFdbElement[1], true);
      }
      break;

    case this.ctrl[2]:
      if (!this.ctrlQueue.includes("DOWN")) {
        this.ctrlQueue.push("DOWN");
        setPressed(this.ctrlFdbElement[2], true);
      }
      break;
    case this.ctrl[3]:
      if (!this.ctrlQueue.includes("RIGHT")) {
        this.ctrlQueue.push("RIGHT");
        setPressed(this.ctrlFdbElement[3], true);
      }
      break;
    }
    this.validateDir();

//    console.log("ctrlQue", this.ctrlQueue);
};

Game.prototype.getDirVector = function(dir) {
  switch (dir) {
    case "UP":
      return {x: 0,y: -1};
      break;
    case "LEFT":
      return {x: -1,y: 0};
      break;
    case "DOWN":
      return {x: 0,y: 1};
      break;
    case "RIGHT":
      return {x: 1,y: 0};
      break;
    default:
      return {x: null, y: null};
  }
};

Game.prototype.getCurrentDir = function() {
  if (this.vx === 0 && this.vy === -1 ){
    this.currentDir = "UP";
  }
  if (this.vx === -1 && this.vy === 0 ){
    this.currentDir = "LEFT";
  }
  if (this.vx === 0 && this.vy === 1 ){
    this.currentDir = "DOWN";
  }
  if (this.vx === 1 && this.vy === 0 ){
    this.currentDir = "RIGHT";
  }
};

Game.prototype.validateDir = function() {

  this.ctrlQueValid = [];
  for (var i = 0; i < this.ctrlQueue.length; i++) {
    this.ctrlQueValid[i] = this.ctrlQueue[i];
  }
  //console.log("validbefore",this.ctrlQueValid);
//  console.log("vectorx",this.getDirVector(this.currentDir).vectorX);
  for (var i = 0; i < this.ctrlQueue.length; i++) {
    var vector = this.getDirVector(this.ctrlQueue[i]);
    if ((this.vx === (-1*vector.x) && this.vy === 0) || (this.vy === (-1*vector.y) && this.vx === 0)) {

//  console.log("this.vx", this.vx, "vector.x",(-1*vector.x));
//  console.log("this.vy", this.vy, "vector.y",(-1*vector.y));
//  console.log("Remove");
      //removeElement(this.ctrlQueValid, this.ctrlQueue[i]);
      this.ctrlQueValid.removeElement(this.ctrlQueue[i]);
//      console.log("this.ctrlQueValid", this.ctrlQueValid, "i", i);
    }
  }
  if (this.ctrlQueValid.length > 0) {
//    console.log("this.ctrlQueValid", this.ctrlQueValid);
//    console.log("this.ctrlQueValid.length-1" ,this.ctrlQueValid.length-1);
//    console.log("this.ctrlQueValid[this.ctrlQueValid.length-1]", this.ctrlQueValid[this.ctrlQueValid.length-1]);
//    console.log("this.nextVx", this.getDirVector(this.ctrlQueValid[this.ctrlQueValid.length-1]).x);
//    console.log("this.nextVy", this.getDirVector(this.ctrlQueValid[this.ctrlQueValid.length-1]).y);
    this.nextVx = this.getDirVector(this.ctrlQueValid[this.ctrlQueValid.length-1]).x;
    this.nextVy = this.getDirVector(this.ctrlQueValid[this.ctrlQueValid.length-1]).y;
  }
};
Game.prototypethis.moveSnake = function() {

//Constrain to move the opposite direction
  if (this.vx !== (-1*this.nextVx) || this.vy !== (-1*this.nextVy) ) {
    this.vx = this.nextVx;
    //  l(this.nextVx);
    this.vy = this.nextVy;
  }
  this.getCurrentDir();
  //Get current status
//  console.log("current vector",(this.getDirVector(this.currentDir)).x);

  // increment position by speed
  this.px += this.vx;
  this.py += this.vy;

  // goes out on map edge come in opposite side
  if (this.px<0) {
    this.px = this.sizeX-1;
  }
  if (this.px > this.sizeX-1) {
    this.px = 0;
  }

  if (this.py<0) {
    this.py = this.sizeY-1;
  }
  if (this.py>this.sizeY-1) {
    this.py = 0;
  }

  for (var i = 0; i <   this.trail.length; i++) {
    this.map[this.px][this.py] = "snakeHead";
    this.map[this.trail[i].x][this.trail[i].y] = "snake";

    if (this.px === this.trail[i].x && this.py === this.trail[i].y)  { //If snake meets itself length reduced to 1 and score reduced to 0
      this.snkLength = 1;
      this.score =  0;}
  }

  this.trail.push ({x:this.px,y:this.py});
  while (this.snkLength<this.trail.length) {
    this.map[this.trail[0].x][this.trail[0].y] = "empty";
    this.trail.shift();
  }

  // if snake eat the food
  if (this.px === this.fx && this.py === this.fy) {
    this.generateFood(); // generate new apply pos
    this.snkLength++;// growing snake
    this.score++; //  plus 1 point
  }

  debugDiv.innerHTML =
    '<div class="text-center">Debug</div>' +
    "<br>Position X: " + createDivForDebug(this.px) +
    "<br>Position Y: " + createDivForDebug(this.py) +
    "<br>Direction X: " + createDivForDebug(this.vx) +
    "<br>Direction Y: " + createDivForDebug(this.vy) +
    "<br>FPS: " + createDivForDebug(this.fps) +
    "<br>Dir cmd: " + createDivForDebug(this.ctrlQueue) +
    "<br>Dir cmd valid: " + createDivForDebug(this.ctrlQueValid) +
    "<br> Current direction: " + createDivForDebug(this.currentDir);
};

Game.prototype.drawBoard = function() {
  scoreDiv.innerText = setupData.name + "'s score: " + this.score;

  for (var x=0;x < this.sizeX;x++) {
    for (var y=0;y < this.sizeY;y++)  {
      if (this.map[x][y] == "snake") {
        this.drawPixel(x,y,"rgba(10,150,10,0.7)", this.unit, this.unit * 0.01);
      }
        if (this.map[x][y] == "snakeHead") {
          this.drawPixel(x,y,"rgba(50,150,50,1)", this.unit);
        }
      //chess board pattern for empty fields
      if (this.map[x][y] == "empty") {
        if ( (x + y) % 2 == 0) {
          this.drawPixel(x,y,"rgba(10,30,10,0.5)", this.unit);
        }
        if ((x + y) % 2 == 1) { //chess table pattern
          this.drawPixel(x,y,"rgba(10,10,10,0.5)", this.unit);
        }
      }

      if (this.map[x][y] == "food")  {
        this.drawPixel(x, y, "rgba(170,0,0,1)", this.unit);
      }
    }
  }
};

Game.prototype.generateFood = function() {
  this.fx = getRandomInt(this.sizeX);
  this.fy = getRandomInt(this.sizeY);
  var foodOnSnake = false;
  //If food is on snake generate again
  for (var i = 0; i < this.trail.length; i++) {
    if (this.fx === this.trail[i].x && this.fy === this.trail[i].y) {
      foodOnSnake = true;
      break;
    }
  }

  if (foodOnSnake) {
    this.generateFood();
  }

  this.map[this.fx][this.fy] = "food"; // put food on the map
};

Game.prototype.drawCircle = function(posX, posY, color, size, offset) {
  if (typeof offset === 'undefined' || !offset) var offset = 0;
  cxt.fillStyle = color;
  cxt.beginPath();
  cxt.arc(posX * size + size/2 + offset, posY * size + size/2 + offset,  size/2 - 2 * offset, 0, Math.PI*2, true);
  cxt.closePath();
  cxt.fill();
};

Game.prototype.drawPixel = function(posX, posY, color, size, offset) {
  if (typeof offset === 'undefined' || !offset) var offset = 0;
  cxt.fillStyle = color;
  cxt.fillRect (posX * size + offset, posY * size + offset, size - 2 * offset, size - 2 * offset);
};
