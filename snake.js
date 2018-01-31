function GameUI() {
    this.newGameMenu = document.getElementById ('newGameMenu');
    this.menuMain = document.getElementById ('menu');
    this.controlFeedback = document.getElementById ('control-feedback');
    this.scoreDiv = document.getElementById ('score');
    this.debugDiv = document.getElementById("debug");

    this.canvas = document.querySelector ('canvas');
    this.cxt = this.canvas.getContext ("2d");

    this.newGameBtn = document.getElementById ('newGame-btn');
    this.highScoreBtn = document.getElementById ('highScore-btn');
    this.continueBtn = document.getElementById ('continue-btn');
    this.startgameBtn = document.getElementById ('startgame-btn');
    this.backBtn = document.getElementById ('back-btn');

    this.interFace = [this.debugDiv, this.scoreDiv];

    //getting input fields
    newGameInputs = document.getElementsByTagName("input");
    for (var i = 0; i < newGameInputs.length; i++) {
      this[newGameInputs[i].id] = newGameInputs[i];
    }

    // Update the current slider value (each time you drag the slider handle)
    //PIXEL SIZE
    var outputP = document.getElementById("valueU");
    outputP.innerHTML = this.inputPixelSize.value; // Display the default slider value

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
    outputD.innerHTML = inputDifficulty.value; // Display the default slider value
    inputDifficulty.oninput  = function() {
        outputD.innerHTML = inputDifficulty.value;
    } ;

    // Pixel Size change
    inputPixelSize.oninput  = function() {
    //  console.log(inputAutoSize.checked);
        outputP.innerHTML = inputPixelSize.value;
    };

    var outputW = document.getElementById("valueW");
    outputW.innerHTML = inputHeight.value; // Display the default slider value
    inputWidth.oninput = function() {
        outputW.innerHTML = inputWidth.value;
    //    console.log(inputAutoSize.checked);
        if (inputAutoSize.checked){
            inputPixelSize.value = 600/Math.pow(inputWidth.value * inputHeight.value, 0.5);
            outputP.innerHTML = inputPixelSize.value;
        }
    };

    var outputH = document.getElementById("valueH");
    outputH.innerHTML = inputWidth.value; // Display the default slider value
    inputHeight.oninput = function() {
        outputH.innerHTML = inputHeight.value;
        if (inputAutoSize.checked){
    //      console.log(600/Math.pow(outputW.innerHTML*outputH.innerHTML,0.5));
        inputPixelSize.value = 600/Math.pow(inputWidth.value * inputHeight.value, 0.5);
          outputP.innerHTML = inputPixelSize.value;
        }
    };

    this.gameStarted = false;
    //ADD EVENT LISTENERS FOR BUTTONS

    this.stateMachine("mainMenuScreen");
    //var self = this;
    this.newGameBtn.addEventListener ("click", function() {
      this.stateMachine("newGameCreatinMenu");
    }.bind(this));

    this.continueBtn.addEventListener ("click", function() {
      if (this.game.isRunning) this.stateMachine("showBoard");
    }.bind(this));

    this.backBtn.addEventListener ("click", function() {
      this.stateMachine("mainMenuScreen");
    }.bind(this));

    //Click on start button
    this.startgameBtn.addEventListener ("click", function() {
      if (this.validateInputs(newGameInputs)) {
        this.saveGameData();
        this.game = new Game(this.gameStartData, this.canvas, 2, [87, 65, 83, 68], this.interFace); //WASD
        //console.log("this.game",this.game);
        this.game.generateFood();
        this.gameStarted = this.game.isRunning;

        document.addEventListener('keydown', function(e) {
          this.game.keyDownFunc(e);
        }.bind(this));
        document.addEventListener('keyup', function(e) {
          this.game.keyUpFunc(e);
        }.bind(this));
        this.stateMachine("showBoard");
      }
    }.bind(this));

    document.addEventListener ('keypress', this.interfaceKeyDown.bind(this));
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
      setVisibility(this.canvas, this.newGameMenu, this.controlFeedback, false);
      if (this.gameStarted) {
        setVisibility(this.scoreDiv, this.continueBtn, true);
      } else {
        setVisibility(this.continueBtn, false);
      }
      break;
    case "newGameCreatinMenu":
      setVisibility(this.menuMain, this.canvas, false);
      setVisibility(this.newGameMenu, true);
      if (this.gameStarted) {
        setVisibility(this.scoreDiv, true);
      }
      this.loadGameData();
      break;
    case "showBoard":
      if(typeof(this.game) !== "undefined") this.game.continueGame();
      setVisibility(this.menuMain, this.newGameMenu , false);
      setVisibility(this.canvas,this.controlFeedback, true);
      break;
    case "highScore":
      break;
  }
};

GameUI.prototype.saveGameData = function(){
  this.gameStartData = {
    'name': this.inputPlayersName.value,
    'mapWidth': parseInt(this.inputWidth.value),
    'mapHeight': parseInt(this.inputHeight.value),
    'mapUnit': parseInt(this.inputPixelSize.value),
    'autoPixelSize': this.inputAutoPixelSize.checked,
    'difficulty' : this.inputDifficulty.value
  };
  localStorage.setItem('gameStartData', JSON.stringify(this.gameStartData));
  console.log("GameSetupSavedToTheLocalStorage", this.gameStartData);
};

GameUI.prototype.loadGameData = function(){
  if (localStorage.getItem("gameStartData") !== undefined){
    this.gameStartData = localStorage.getItem('gameStartData');
    console.log("localStorage.getItem('gameStartData')", localStorage.getItem('gameStartData'));
    this.gameStartData = JSON.parse(this.gameStartData);

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
        if(typeof(this.game) !== "undefined"){
          this.stateMachine ("showBoard");
          break;
        }
        case "showBoard":
          this.stateMachine ("mainMenuScreen");
          break;
        }
    break;
  }
};

var gameUI = new GameUI();
