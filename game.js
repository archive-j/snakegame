//SYMBOL

function Game({ gameStartData, canvas, snakeLength, controlKeys, interFace, onGameEndAction }) {
  this.gameOver = false;
  this.ctrlFdbElement = document.getElementsByClassName('ctrl');
  //Save to the local storage
  this.endGameRequest = false;
  this.debugDiv = interFace[0];
  this.scoreDiv = interFace[1];
  this.ctrl = controlKeys;
  this.snkLength = snakeLength;
  this.onGameEndAction = onGameEndAction;
  this.playerName = gameStartData.name;
  this.sizeX = gameStartData.mapWidth;
  this.sizeY = gameStartData.mapHeight;
  this.unit = gameStartData.mapUnit;
  this.startFps = gameStartData.difficulty;// frame per second
  this.fps = gameStartData.difficulty;// frame per second
  this.speedChangeRequest = false;

  this.canvas = canvas;
  this.cxt = this.canvas.getContext ("2d");
  this.canvas.width = this.sizeX * this.unit; // a pálya méretének beállítása
  this.canvas.height = this.sizeY * this.unit;

  this.px = getRandomInt(this.sizeX); //snake on the middle
  this.py = getRandomInt(this.sizeY); // this on the middle
  this.vx = 0;
  this.vy = 0;
  this.nextVx = 1;
  this.nextVy = 0;
  this.trail = [];
  this.score =  0;
  // map 0 empty 1 snake trail 2 snake head 9 food
  this.map = new Array(this.sizeX).fill().map(()=>new Array(this.sizeY).fill(0)); // empty map

  this.ctrlQueue = [];
  this.ctrlQueValid = [];
};

Game.prototype.pauseGame = function() {
  if (this.SessionId) {
    clearInterval(this.SessionId);
  } // pause game
  this.isRunning = false;
};

Game.prototype.endGame = function() {
  if (this.SessionId) {
    clearInterval(this.SessionId);
  } // pause game
  console.log(this.endGameRequest);
};

Game.prototype.continueGame = function() {
  this.SessionId = setInterval(this.updateGame.bind(this), 1000/this.fps); // start game
};

Game.prototype.updateGame = function() {
  if(this.speedChangeRequest) {
    this.pauseGame();
  //  this.fps = this.fps + this.score*0.05;
    this.speedChangeRequest = false;
    this.continueGame();
  }
  this.clearBoard();
  this.moveSnake();
  this.drawBoard();
  this.isRunning = true;
};

Game.prototype.clearBoard = function() {
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

Game.prototype.getCurrentDirinString = function() {
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
  // check if the snake can go this direction and set the last pusded btn to next direction

  this.ctrlQueValid = [];
  for (var i = 0; i < this.ctrlQueue.length; i++) {
    this.ctrlQueValid[i] = this.ctrlQueue[i];
  }
  for (var i = 0; i < this.ctrlQueue.length; i++) {
    var vector = this.getDirVector(this.ctrlQueue[i]);
    if ((this.vx === (-1*vector.x) && this.vy === 0) || (this.vy === (-1*vector.y) && this.vx === 0)) {
      this.ctrlQueValid.removeElement(this.ctrlQueue[i]);
    }
  }
  if (this.ctrlQueValid.length > 0) {
    this.nextVx = this.getDirVector(this.ctrlQueValid[this.ctrlQueValid.length-1]).x;
    this.nextVy = this.getDirVector(this.ctrlQueValid[this.ctrlQueValid.length-1]).y;
  }
};

Game.prototype.moveSnake = function() {
  // read next position and increment position by speed
  this.vx = this.nextVx;
  this.vy = this.nextVy;
  this.getCurrentDirinString();

  // move snake
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

  //console.log("current vector",(this.getDirVector(this.currentDir)).x);
  while (this.snkLength<=this.trail.length) {
  //  console.log("this.trail", this.trail);
    this.map[this.trail[0].x][this.trail[0].y] = 0; // 0 for empty
    this.trail.shift();
  }


  for (var i = 0; i < this.trail.length; i++) {
    this.map[this.px][this.py] = 2; // 2 for Snake head
    this.map[this.trail[i].x][this.trail[i].y] = 1; // 1 for snake trail

    if (this.px === this.trail[i].x && this.py === this.trail[i].y)  {
      //If snake meets itself length reduced to 1 and score reduced to 0
      this.onGameEndAction();
    }
  }

  this.trail.push ({x:this.px,y:this.py});

  // if snake eat the food
  if (this.px === this.fx && this.py === this.fy) {
    this.snkLength++;// growing snake
    this.score += Math.floor(1000 * this.fps / (this.sizeX * this.sizeY)); //  plus 1 point
    this.generateFood(); // generate new apple pos
    this.speedChangeRequest = true;
  }


  this.debugDiv.innerHTML =
    '<div class="text-center">Debug</div>' +
    "<br>Position X: " + createDivForDebug(this.px) +
    "<br>Position Y: " + createDivForDebug(this.py) +
    "<br>Direction X: " + createDivForDebug(this.vx) +
    "<br>Direction Y: " + createDivForDebug(this.vy) +
    "<br>Food X: " + createDivForDebug(this.fx) +
    "<br>Food Y: " + createDivForDebug(this.fy) +
    "<br>FPS: " + createDivForDebug(this.fps) +
    "<br>Dir cmd: " + createDivForDebug(this.ctrlQueue) +
    "<br>Dir cmd valid: " + createDivForDebug(this.ctrlQueValid) +
    "<br> Current direction: " + createDivForDebug(this.currentDir)+
    "<br> Trail length " + createDivForDebug(this.trail.length)+
    "<br> snkLength " + createDivForDebug(this.snkLength);
};

Game.prototype.drawBoard = function() {
  this.scoreDiv.innerText = this.playerName + "'s score: " + this.score;

  for (var x=0;x < this.sizeX;x++) {
    for (var y=0;y < this.sizeY;y++)  {
      if (this.map[x][y] === 9)  { // 9 draw food
        this.drawPixel(x, y, "rgba(170,0,0,1)", this.unit);
      }

      if (this.map[x][y] === 1) { // snake trail
        this.drawPixel(x,y,"rgba(10,150,10,0.7)", this.unit, this.unit * 0.01);
      }
        if (this.map[x][y] === 2) { //snake head
          this.drawPixel(x,y,"rgba(50,150,50,1)", this.unit);
        }
      //chess board pattern for empty fields
      if (this.map[x][y] === 0) {
        if ( (x + y) % 2 === 0) {
          this.drawPixel(x,y,"rgba(10,30,10,0.5)", this.unit);
        }
        if ((x + y) % 2 === 1) { //chess table pattern
          this.drawPixel(x,y,"rgba(10,26,10,0.5)", this.unit);
        }
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

  this.map[this.fx][this.fy] = 9; // put food on the map
};

Game.prototype.drawCircle = function(posX, posY, color, size, offset) {
  if (typeof offset === 'undefined' || !offset) var offset = 0;
  this.cxt.fillStyle = color;
  this.cxt.beginPath();
  this.cxt.arc(posX * size + size/2 + offset, posY * size + size/2 + offset,  size/2 - 2 * offset, 0, Math.PI*2, true);
  this.cxt.closePath();
  this.cxt.fill();
};

Game.prototype.drawPixel = function(posX, posY, color, size, offset) {
  if (typeof offset === 'undefined' || !offset) var offset = 0;
  this.cxt.fillStyle = color;
  this.cxt.fillRect (posX * size + offset, posY * size + offset, size - 2 * offset, size - 2 * offset);
};
