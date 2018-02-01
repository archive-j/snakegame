function GameUI() {
    this.gameStarted = false;
    this.newGameMenu = document.getElementById ('newGameMenu');
    this.menuMain = document.getElementById ('menu');
    this.controlFeedback = document.getElementById ('control-feedback');
    this.scoreDiv = document.getElementById ('score');
    this.debugDiv = document.getElementById("debug");
    this.endGameDiv = document.getElementById("endgamemenu");
  //  setVisibility(this.endGameDiv, false);
    this.canvas = document.querySelector ('canvas');
    this.cxt = this.canvas.getContext ("2d");

    setVisibility(this.endGameDiv, false);
    this.highScoreBtn = document.getElementById ('highScore-btn');
    this.continueBtn = document.getElementById ('continue-btn');

    this.newGameBtns = [
      document.getElementById('newGame-btn'),
      document.getElementById('endCreateNewGame-btn')
    ];

    this.startGameBtns = [
      document.getElementById('startgame-btn'),
      document.getElementById('endRestart-btn')
    ];

    this.mainMenuBtns = [
      document.getElementById('back-btn'),
      document.getElementById('endMainMenu-btn')
    ];
    this.interFace = [this.debugDiv, this.scoreDiv];

     //flags = {
      //set endGameFlag(endFlag{this.game = undefined;}};
     //getting input fields
     newGameInputs = document.getElementsByTagName("input");
     for (var i = 0; i < newGameInputs.length; i++) {
       this[newGameInputs[i].id] = newGameInputs[i];
     }

    // Update the current slider value (each time you drag the slider handle)
    //PIXEL SIZE
    var outputP = document.getElementById("valueU");

    //Auto size switch changing detection
    inputAutoPixelSize.onchange  = function() {
      inputPixelSize.disabled = inputAutoPixelSize.checked; // if checked dont let change size input
        if (inputAutoPixelSize.checked){
          inputPixelSize.value = 600/Math.pow(inputWidth.value * inputHeight.value, 0.5);
          outputP.innerHTML = inputPixelSize.value;
          inputPixelSize.disabled = true;
        }
    };

    // DIFFICULTY
    var outputD = document.getElementById("valueD");
    inputDifficulty.oninput  = function() {
        outputD.innerHTML = inputDifficulty.value;
    } ;

    // Pixel Size change
    inputPixelSize.oninput  = function() {
    //  console.log(inputAutoPixelSize.checked);
        outputP.innerHTML = inputPixelSize.value;
    };

    var outputW = document.getElementById("valueW");
    inputWidth.oninput = function() {
        outputW.innerHTML = inputWidth.value;
    //    console.log(inputAutoPixelSize.checked);
        if (inputAutoPixelSize.checked){
            inputPixelSize.value = 600/Math.pow(inputWidth.value * inputHeight.value, 0.5);
            outputP.innerHTML = inputPixelSize.value;
        }
    };

    var outputH = document.getElementById("valueH");
    inputHeight.oninput = function() {
        outputH.innerHTML = inputHeight.value;
        if (inputAutoPixelSize.checked){
    //      console.log(600/Math.pow(outputW.innerHTML*outputH.innerHTML,0.5));
        inputPixelSize.value = 600/Math.pow(inputWidth.value * inputHeight.value, 0.5);
          outputP.innerHTML = inputPixelSize.value;
        }
    };

    this.finalScore = document.getElementById("final-score");

    //ADD EVENT LISTENERS FOR BUTTONS
    this.stateMachine("mainMenuScreen");

    this.continueBtn.addEventListener ("click", function() {
        this.stateMachine("showBoard");
    }.bind(this));

    for (var i = 0; i < this.mainMenuBtns.length; i++) {
      this.mainMenuBtns[i].addEventListener("click",  function() {
      this.stateMachine("mainMenuScreen");
      }.bind(this));
    }

    for (var i = 0; i < this.newGameBtns.length; i++) {
      this.newGameBtns[i].addEventListener("click",  function() {
      this.stateMachine("newGameCreatinMenu");
      }.bind(this));
    }

    //Click on start button

    for (var i = 0; i < this.startGameBtns.length; i++) {
      this.startGameBtns[i].addEventListener ("click", this.newGameInit.bind(this));
    }

    document.addEventListener ('keypress', this.interfaceKeyDown.bind(this));
};


GameUI.prototype.newGameInit = function() {
  if (this.validateInputs(newGameInputs)) {
    this.saveGameData();

    this.game = new Game({
      gameStartData: this.gameStartData,
      canvas: this.canvas,
      snakeLength: 2,
      controlKeys: [87, 65, 83, 68],
      interFace: this.interFace,
      onGameEndAction: () => { this.stateMachine("gameOver"); }
    }); //WASD

    //console.log("this.game",this.game);
    this.game.generateFood();

    document.addEventListener('keydown', function(e) {
      if(typeof(this.game) !== "undefined") this.game.keyDownFunc(e);
    }.bind(this));
    document.addEventListener('keyup', function(e) {
      if(typeof(this.game) !== "undefined") this.game.keyUpFunc(e);
    }.bind(this));
    this.stateMachine("showBoard");
  }
};

GameUI.prototype.validateInputs = function(inputsToCheck) {
  var valid = true;
  for (var i = 0; i < inputsToCheck.length; i++) {
    valid &= inputsToCheck[i].checkValidity();
  }
  return valid;
};

GameUI.prototype.stateMachine = function(nextState) {
  this.currentState = nextState;
  switch (this.currentState) {
    case "mainMenuScreen":
      if(typeof(this.game) !== "undefined") this.game.pauseGame();
      setVisibility(this.menuMain, true);
      setVisibility(this.canvas, this.newGameMenu, this.controlFeedback, this.endGameDiv, false);

      if (typeof(this.game) !== "undefined" && !this.gameOver) {
        setVisibility(this.scoreDiv, this.continueBtn, true);
      } else {
        setVisibility(this.continueBtn, false);
      }
      break;
    case "newGameCreatinMenu":
      setVisibility(this.menuMain, this.canvas, this.endGameDiv, false);
      setVisibility(this.newGameMenu, true);

      if (typeof(this.game) !== "undefined") {
        setVisibility(this.scoreDiv, true);
      }
      this.loadGameData();
      break;
    case "showBoard":
      if(typeof(this.game) !== "undefined") this.game.continueGame();
      setVisibility(this.menuMain, this.newGameMenu, this.endGameDiv, false);
      setVisibility(this.canvas,this.controlFeedback, true);
      break;
    case "gameOver":
        this.game.pauseGame();
        this.gameOver = true;
        setVisibility(this.endGameDiv, true);
        this.finalScore.innerHTML = "Player's score: " + this.game.score;
      break;
    case "highScore":
      break;
  }
};


GameUI.prototype.saveGameData = function(){
  this.gameStartData = {
    name: this.inputPlayersName.value,
    mapWidth: parseInt(this.inputWidth.value),
    mapHeight: parseInt(this.inputHeight.value),
    mapUnit: parseInt(this.inputPixelSize.value),
    autoPixelSize: this.inputAutoPixelSize.checked,
    difficulty: parseInt(this.inputDifficulty.value)
  };
  localStorage.setItem('gameStartData', JSON.stringify(this.gameStartData));
  console.log("GameSetupSavedToTheLocalStorage", this.gameStartData);
};

GameUI.prototype.loadGameData = function(){
  if (localStorage.getItem("gameStartData") !== undefined){
    this.gameStartData = localStorage.getItem('gameStartData');
    console.log("localStorage.getItem('gameStartData')", localStorage.getItem('gameStartData'));
    this.gameStartData = JSON.parse(this.gameStartData);

    outputH.innerHTML = inputWidth.value; // Display the default slider value
    outputW.innerHTML = inputHeight.value; // Display the default slider value
    outputD.innerHTML = inputDifficulty.value; // Display the default slider value
    outputP.innerHTML = this.inputPixelSize.value; // Display the default slider value
    this.inputPlayersName.value = this.gameStartData.name;
    this.inputWidth.value = this.gameStartData.mapWidth;
    this.inputHeight.value = this.gameStartData.mapHeight;
    this.inputPixelSize.value = this.gameStartData.mapUnit;
    this.inputAutoPixelSize.checked = this.gameStartData.autoPixelSize;
    this.inputDifficulty.value = this.gameStartData.difficulty;
  }
};

GameUI.prototype.interfaceKeyDown = function(evt) {
  switch (evt.keyCode) {
    case 32: //pause on space
      switch  (this.currentState) {
        case "mainMenuScreen":
          if(typeof(this.game) !== undefined && !this.gameOver){
              this.stateMachine ("showBoard");
          }
          break;
        case "showBoard":
           if(typeof(this.game) !== undefined ){
            this.stateMachine ("mainMenuScreen");
          }
          break;
      }
    break;
  }
};

var gameUI = new GameUI();
