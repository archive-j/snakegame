
var menuMain = document.getElementById ('menu');
var scoreDiv = document.getElementById ('score');
var debugDiv = document.getElementById("debug");
var controlFeedback = document.getElementById ('control-feedback');

var canvas = document.querySelector ('canvas');
var cxt = canvas.getContext ("2d");

var highScoreBtn = document.getElementById ('highScore-btn');
var continueBtn = document.getElementById ('continue-btn');
var startgameBtn = document.getElementById ('startgame-btn');
var backBtn = document.getElementById ('back-btn');

//Snake positions, speed, food position
//var snake, snake2;

var gameUI = new GameUI();

function GameUI() {
    this.gameStartData;
    this.gameIsRunning = false;




    const inputWidth = document.getElementById('inputCanvasWidth');
    const inputHeight = document.getElementById('inputCanvasHeight');
    const inputPlayersName = document.getElementById('inputPlayersName');
    const inputUnit = document.getElementById('inputUnit');
    var newGameBtn = document.getElementById ('newGame-btn');
    //ADD EVENT LISTENERS FOR BUTTONS


    this.validateInput = function(inputFields) {
      //console.log("inputs",inputs);
      var valid = true;
      for (var i = 0; i < inputFields.length; i++) {
        valid &= inputFields[i].checkValidity();
      }
      return valid;
    };



    this.stateMachine = function(nextState) {
      console.log("nextState", nextState);
      this.currentState = nextState;

      switch (this.currentState) {
        case "mainMenuScreen":
          if(typeof(this.game) !== "undefined") this.game.pauseGame();

          setVisibility(menu,true);
          setVisibility(canvas, false);
          setVisibility(newGameMenu, false);
          setVisibility(controlFeedback, false);

          if (this.gameIsRunning) {
            setVisibility(scoreDiv, true);
            setVisibility(continueBtn, true);
          } else {
            setVisibility(continueBtn, false);
          }

          break;

        case "newGameCreatinMenu":
          setVisibility(menu, false);
          setVisibility(canvas, false);
          setVisibility(newGameMenu, true);

          if (this.gameIsRunning) {
            setVisibility(scoreDiv, true);
          }

          ///local storage mentes

          // Load preset values for setup creen
          if (localStorage.getItem("gameStartData") !== null){
          	this.gameStartData= localStorage.getItem('gameStartData');
          	this.gameStartData = JSON.parse(this.gameStartData);
          	//console.log('gameStartData= : ', this.gameStartData);

            inputPlayersName.value = this.gameStartData.name;
            inputWidth.value = this.gameStartData.mapWidth;
            inputHeight.value = this.gameStartData.mapHeight;
          	inputUnit.value = this.gameStartData.mapUnit;
          }

          break;
    // Retrieve the object from storage
        case "gameIsRunning":
          if(typeof(this.game) !== "undefined") this.game.continueGame();
          setVisibility(menu, false);
          setVisibility(newGameMenu, false);
          setVisibility(canvas, true);
          setVisibility(controlFeedback, true);
          break;

        case "highScore":
          break;
      }
    };


    this.interfaceKeyDown = function(evt) { 
      switch (evt.keyCode) {
        case 32: //pause on space
          switch  (this.currentState) {
            case "mainMenuScreen":
              this.stateMachine ("gameIsRunning");
              break;
            case "gameIsRunning":
              this.stateMachine ("mainMenuScreen");
              break;
            }
        break;
      }
    };


    this.stateMachine("mainMenuScreen");
    //var self = this;
    newGameBtn.addEventListener ("click", function() {
      this.stateMachine("newGameCreatinMenu");
    }.bind(this));

    continueBtn.addEventListener ("click", function() {
      if (gameIsRunning){
        this.stateMachine("gameIsRunning");
      }
    }.bind(this));

    backBtn.addEventListener ("click", function() {
      this.stateMachine("mainMenuScreen");
    }.bind(this));

    startgameBtn.addEventListener ("click", function() {
      var inputFields = [inputWidth, inputHeight, inputUnit];

      this.gameStartData = {
        'name': inputPlayersName.value,
        'mapWidth': parseInt(inputWidth.value),
        'mapHeight': parseInt(inputHeight.value),
        'mapUnit': parseInt(inputUnit.value),
      };

      if (this.validateInput(inputFields)) {
         this.game = new Game(this.gameStartData, canvas, 2, [87, 65, 83, 68]); //WASD
         this.gameIsRunning = this.game.isRunning;
         this.game.generateFood();
         document.addEventListener('keydown', function(e) {
            this.game.keyDownFunc(e);
          }.bind(this));
         document.addEventListener('keyup', function(e) {
            this.game.keyUpFunc(e);
           }.bind(this));
         this.stateMachine("gameIsRunning");
      }
    }.bind(this));

    document.addEventListener ('keypress', this.interfaceKeyDown.bind(this));



};
