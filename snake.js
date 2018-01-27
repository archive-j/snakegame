var canvas = document.querySelector ('canvas');
var cxt = canvas.getContext ("2d");
var menuMain = document.getElementById ('menu');
var scoreDiv = document.getElementById ('score');
var newGameBtn = menu.children[0];
var continueBtn = menu.children[2];
var backBtn = document.getElementById ('btn-back');


var inputWidth;
var inputHeight;
var inputPlayersName;
var inputUnit;
var fps = 20;// frame per second
//Snake positions, speed, food position
var intervalID;
var game;
var gameData;
var snake, snake2;
var gameIsRunning = false;

// var newObjecting = {
// //  snake: snake, //  snake, //Egyenértékű
//
//   shit: "kaka",
//   szam: 3,
//   init: function(sizeX,sizeY){},
// //  init(sizeX,sizeY){},
//   szam1: 5
// };

function gameRun() {
  game.clear();
  game.moveSnake();
  game.drawBoard();
}


function Game(setupData, i_canvas, startLength, ctrl) {
  localStorage.setItem('gameData', JSON.stringify(setupData));

  this.isRunning = true;
  console.log("setupData", setupData);

  this.canvas = i_canvas;
  this.cxt = this.canvas.getContext ("2d");

  this.snkLength = startLength; //
  this.ctrl = ctrl;

  // setupData = {
  //   'name': inputPlayersName.value,
  //   'mapWidth': inputWidth.value,
  //   'mapHeight': inputHeight.value,
  //   'mapUnit': inputUnit.value,
  // };
  console.log("setupData.mapWidth",typeof(setupData.mapWidth));
  this.sizeX = setupData.mapWidth;
  this.sizeY = parseInt(inputHeight.value);
  this.unit = parseInt(inputUnit.value);
  this.canvas.width = this.sizeX * this.unit; // a pálya méretének beállítása
  this.canvas.height = this.sizeY * this.unit;
  this.px =  getRandomInt(this.sizeX); //snake on the middle
  this.py =  getRandomInt(this.sizeY); // this on the middle
  this.vx = 0;
  this.vy = 0;
  this.nextVx = 1;
  this.nextVy = 0;
  this.trail = [];
  this.fx = null;
  this.fy = null;
  this.map = new Array(this.sizeX).fill().map(()=>new Array(this.sizeY).fill("empty"));
  this.score =  0;


    //snake2 = new MySnake(sizeX, sizeY, 2, [38, 37, 12, 39]); //arrows
    //document.addEventListener('keydown', snake2.keyPushFunc.bind(snake2)); // fgv referencia-t vár
    // document.addEventListener('keydown', function(e) {
    //   snake.keyPushFunc(e);


  this.keyPushFunc = function(evt) {
  //  l("this:", this);
  //  l("Pushed keycode", evt.keyCode);
    switch (evt.keyCode) {
      case this.ctrl[1]:
        this.nextVx = -1; //  LEFT
        this.nextVy = 0;
        break;
      case this.ctrl[0]:
        this.nextVx = 0; // UP
        this.nextVy = -1;
        break;
      case this.ctrl[3]:
        this.nextVx = 1; // RIGHT
        this.nextVy = 0;
        break;
      case this.ctrl[2]:
        this.nextVx = 0; // DOWN
        this.nextVy = 1;
        break;
	  }
  };

  this.moveSnake = function() {

    //Constrain to move the opposite direction
    if (this.vx != (-1*this.nextVx) || this.vy != (-1*this.nextVy) ) {
      this.vx = this.nextVx;
      //  l(this.nextVx);
      this.vy = this.nextVy;
    }
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
        this.score =  0;
      }
    }

    //
    this.trail.push ({x:this.px,y:this.py});
    while (this.snkLength<this.trail.length) {
      this.map[this.trail[0].x][this.trail[0].y] = "empty";
      this.trail.shift();
    }

    // if food is on the snake head
    if (this.px === this.fx && this.py === this.fy) {
      this.generateApple(); // generate new apply pos
      this.snkLength++;// growing snake
      this.score++; //  plus 1 point
      //fps++;
    }
     //draw snake
    this.lastVx = this.vx;
    this.lastVy = this.vy;
  };

  this.clear = function() {
    this.cxt.clearRect (0, 0, this.canvas.width, this.canvas.height);
  };
  //
  // drawBoard(sizeY, sizeX, canvas) {
  //
  // }

  this.drawBoard = function() {
    scoreDiv.innerText = setupData.name+"'s score: " + this.score;

    for (var x=0;x < this.sizeX;x++) {
      for (var y=0;y < this.sizeY;y++)  {
        if (this.map[x][y] == "snake") {
          drawPixel(x,y,"rgba(10,150,10,0.7)", this.unit, this.unit * 0.01);
        }
          if (this.map[x][y] == "snakeHead") {
            drawPixel(x,y,"rgba(50,150,50,1)", this.unit);
          }
        if (this.map[x][y] == "empty") {
          if ( (x + y) % 2 == 0) {
            drawPixel(x,y,"rgba(10,30,10,0.5)", this.unit);
          }
          if ( (x + y) % 2 == 1) { //chess table pattern
            drawPixel(x,y,"rgba(10,10,10,0.5)", this.unit);
          }
        }
        if (this.map[x][y] == "food")  {
          this.cxt.fillStyle = "rgba(170,0,0,1)";
          this.cxt.fillRect (x * this.unit, y * this.unit, this.unit, this.unit);
        }
      }
    }
  };

  this.generateApple = function() {
    this.fx = getRandomInt(this.sizeX);
    this.fy = getRandomInt(this.sizeY);
    var foodOnSnake = false;
    for (var i = 0; i < this.trail.length; i++) {
      if (this.fx == this.trail[i].x && this.fy == this.trail[i].y) {
        foodOnSnake = true;
        break;
      }
    }

    if (foodOnSnake) {
      this.generateApple();
    }

    this.map[this.fx][this.fy] = "food"; // put food on the map
  };
}

window.onload = function() {
  document.addEventListener ('keydown', interfaceCtrl);
};

stateMachine ("mainMenuScreen");

function l(...toConsole) {
  console.log(...toConsole);
}


function interfaceCtrl(evt) {
  switch (evt.keyCode) {
    case 32: //pause on space
      switch  (currentState) {
        case "mainMenuScreen":
          stateMachine ("gameIsRunning");
          break;
        case "gameIsRunning":
          stateMachine ("mainMenuScreen");
          break;
        }
    break;
  }
}


newGameBtn.addEventListener ("click", function() { // új játék beállításai
  stateMachine ("newGameCreatinMenu");
});

continueBtn.addEventListener ("click", function() {
  if (gameIsRunning){
    stateMachine ("gameIsRunning");
  }
});

backBtn.addEventListener ("click", function() {
  stateMachine ("mainMenuScreen");
});

var btnStartgame = document.getElementById ('btn-startgame');
btnStartgame.addEventListener ("click", function() {
  var inputs = [inputWidth, inputHeight, inputUnit];

  gameData = {
    'name': inputPlayersName.value,
    'mapWidth': parseInt(inputWidth.value),
    'mapHeight': parseInt(inputHeight.value),
    'mapUnit': parseInt(inputUnit.value),
  };

  if(validateInput(inputs)) {
     game = new Game(gameData, canvas, 2, [87, 65, 83, 68]); //WASD
     game.generateApple();
     gameIsRunning = game.isRunning;
     document.addEventListener('keydown', function(e) {
         game.keyPushFunc(e);
       });
     stateMachine ("gameIsRunning");

  }
});


// function drawPixel (posX, posY, color, size, offset) {
//   if (typeof offset === 'undefined' || !offset) {
//     var offset = 0;
//   }
//   context = canvas.getContext ("2d");
//   context.fillStyle = color;
//   context.beginPath();
//   context.arc(posX, posY, size/2, 0, Math.PI*2, true);
//   context.closePath();
//   context.fill();
//   }

// drawPixel(10,10, "black", unit);

function drawPixel(posX, posY, color, size, offset) {
  if (typeof offset === 'undefined' || !offset)  {var offset = 0;}
  cxt.fillStyle = color;
  cxt.fillRect (posX * size + offset, posY * size + offset, size - 2 * offset, size - 2 * offset);
  // l("size:", posX*size+offset);
  // l("offset:", offset);
}


function validateInput(inputs) {
  console.log("inputs",inputs);
  var valid = true;
  for (var i = 0; i < inputs.length; i++) {
    valid &= inputs[i].checkValidity();
    // console.log("inputs[i].checkValidity()", inputs[i].checkValidity());
    // console.log("valid",valid);
  }
  return valid;
}

function stateMachine(nextState) {
  currentState = nextState;

  switch (currentState) {
    case "mainMenuScreen":
      if (intervalID)    {clearInterval(intervalID);} // pause game
      setVisibility(menu,true);
      setVisibility(canvas, false);
      setVisibility(newGameMenu, false);
      if(gameIsRunning) {
        setVisibility (scoreDiv, true);
        setVisibility(continueBtn, true);
      } else {
        setVisibility(continueBtn, false);
      }

      break;

    case "newGameCreatinMenu":
      setVisibility(menu, false);
      setVisibility(canvas, false);
      setVisibility(newGameMenu, true);
      if(gameIsRunning) {
        setVisibility(scoreDiv, true);
      }

      ///local storage mentes
      inputPlayersName = document.getElementById('inputPlayersName');
      inputWidth = document.getElementById('inputCanvasWidth');
      inputHeight = document.getElementById('inputCanvasHeight');
      inputUnit = document.getElementById('inputUnit');

      if (localStorage.getItem("gameData") !== null){
      	gameData= localStorage.getItem('gameData');
      	gameData = JSON.parse(gameData);
      	console.log('gameData= : ', gameData);

        inputPlayersName.value = gameData.name;
        inputWidth.value = gameData.mapWidth;
        inputHeight.value = gameData.mapHeight;
      	inputUnit.value = gameData.mapUnit;
      }

      break;
// Retrieve the object from storage
    case "gameIsRunning":
      setVisibility (menu, false);
      setVisibility (newGameMenu, false);
      setVisibility (canvas, true);

      intervalID = setInterval (gameRun, 1000/fps); // start game
      break;

    case "highScore":
      break;
  }
}
