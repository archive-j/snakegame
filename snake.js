
var menuMain = document.getElementById ('menu');
var scoreDiv = document.getElementById ('score');
var debugDiv = document.getElementById("debug");
var controlFeedback = document.getElementById ('control-feedback');

var canvas = document.querySelector ('canvas');
var cxt = canvas.getContext ("2d");

var newGameBtn = document.getElementById ('newGame-btn');
var highScoreBtn = document.getElementById ('highScore-btn');
var continueBtn = document.getElementById ('continue-btn');
var startgameBtn = document.getElementById ('startgame-btn');
var backBtn = document.getElementById ('back-btn');

var inputWidth;
var inputHeight;
var inputPlayersName;
var inputUnit;
//Snake positions, speed, food position
var game;
var gameData;
var gameIsRunning = false;
//var snake, snake2;

setup();

function setup() {
  //ADD EVENT LISTENERS FOR BUTTONS
  stateMachine ("mainMenuScreen");

  document.addEventListener ('keypress', interfaceKeyDown);

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

  startgameBtn.addEventListener ("click", function() {
    var inputs = [inputWidth, inputHeight, inputUnit];

    gameData = {
      'name': inputPlayersName.value,
      'mapWidth': parseInt(inputWidth.value),
      'mapHeight': parseInt(inputHeight.value),
      'mapUnit': parseInt(inputUnit.value),
    };
 
    if (validateInput(inputs)) {
       game = new Game(gameData, canvas, 2, [87, 65, 83, 68]); //WASD
       gameIsRunning = game.isRunning;
       game.generateFood();
       document.addEventListener('keydown', function(e) {
           game.keyDownFunc(e);
         });
       document.addEventListener('keyup', function(e) {
           game.keyUpFunc(e);
         });
       stateMachine ("gameIsRunning");
    }
  });
}

function validateInput(inputs) {
  //console.log("inputs",inputs);
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
      if(typeof(game) !== "undefined") game.pauseGame();

      setVisibility(menu,true);
      setVisibility(canvas, false);
      setVisibility(newGameMenu, false);
      setVisibility(controlFeedback, false);

      if (gameIsRunning) {
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

      if (gameIsRunning) {
        setVisibility(scoreDiv, true);
      }

      ///local storage mentes
      inputPlayersName = document.getElementById('inputPlayersName');
      inputWidth = document.getElementById('inputCanvasWidth');
      inputHeight = document.getElementById('inputCanvasHeight');
      inputUnit = document.getElementById('inputUnit');

      // Load preset values for setup creen
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
      if(typeof(game) !== "undefined") game.continueGame();
      setVisibility (menu, false);
      setVisibility (newGameMenu, false);
      setVisibility (canvas, true);
      setVisibility(controlFeedback, true);
      break;

    case "highScore":
      break;
  }
}
