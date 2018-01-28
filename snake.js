
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
//var snake, snake2;

var gameUI = new GameUI();


function GameUI() {
    var gameStartData;
    var gameIsRunning = false;
    //ADD EVENT LISTENERS FOR BUTTONS
    this.stateMachine("mainMenuScreen");

    document.addEventListener ('keypress', interfaceKeyDown);
    newGameBtn.addEventListener ("click", function() {
      this.stateMachine("newGameCreatinMenu");
    });

    continueBtn.addEventListener ("click", function() {
      if (gameIsRunning){
        this.stateMachine("gameIsRunning");
      }
    });

    backBtn.addEventListener ("click", function() {
      this.stateMachine("mainMenuScreen");
    });

    startgameBtn.addEventListener ("click", function() {
      var inputFields = [inputWidth, inputHeight, inputUnit];

      gameStartData = {
        'name': inputPlayersName.value,
        'mapWidth': parseInt(inputWidth.value),
        'mapHeight': parseInt(inputHeight.value),
        'mapUnit': parseInt(inputUnit.value),
      };

      if (validateInput(inputFields)) {
         var game = new Game(gameStartData, canvas, 2, [87, 65, 83, 68]); //WASD
         gameIsRunning = game.isRunning;
         game.generateFood();
         document.addEventListener('keydown', function(e) {
             game.keyDownFunc(e);
           });
         document.addEventListener('keyup', function(e) {
             game.keyUpFunc(e);
           });
         this.stateMachine("gameIsRunning");
      }
    });

    this.stateMachine = function(nextState) {
      currentState = nextState;

      switch (currentState) {
        case "mainMenuScreen":
          if(typeof(this.game) !== "undefined") this.game.pauseGame();

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
          if (localStorage.getItem("gameStartData") !== null){
          	gameStartData= localStorage.getItem('gameStartData');
          	gameStartData = JSON.parse(gameStartData);
          	console.log('gameStartData= : ', gameStartData);

            inputPlayersName.value = gameStartData.name;
            inputWidth.value = gameStartData.mapWidth;
            inputHeight.value = gameStartData.mapHeight;
          	inputUnit.value = gameStartData.mapUnit;
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

};
