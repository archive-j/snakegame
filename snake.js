

//flag leütés felengedés törlés




//Snake positions, speed, food position
//var snake, snake2;


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


    newGameInputs = document.getElementsByTagName("input");
    this.interFace = [this.debugDiv, this.scoreDiv];
    this.inputPlayersName = newGameInputs[0];
    this.inputDifficulty = newGameInputs[1];
    this.inputUnit = newGameInputs[2];
    this.inputAutoSize = newGameInputs[3]; // switch for auto pixel size
    this.inputWidth = newGameInputs[4];
    this.inputHeight = newGameInputs[5];

    // Update the current slider value (each time you drag the slider handle)
    //PIXEL SIZE
    this.outputU = document.getElementById("valueU");
    this.outputU.innerHTML = this.inputUnit.value; // Display the default slider value

    //Auto size switch changing detection
    this.inputAutoSize.onchange  = function() {
      this.inputUnit.disabled = this.inputAutoSize.checked; // if checked dont let change size input
        if (this.inputAutoSize.checked){
          this.inputUnit.value = 600/Math.pow(this.inputWidth.value * this.inputHeight.value, 0.5);
          this.outputU.innerHTML = this.inputUnit.value;
          this.inputUnit.disabled = true;
        }
    }.bind(this);

    // DIFFICULTY
    this.outputD = document.getElementById("valueD");
    this.outputD.innerHTML = this.inputDifficulty.value; // Display the default slider value
    this.inputDifficulty.oninput  = function() {
        this.outputD.innerHTML = this.inputDifficulty.value;
    }.bind(this);

    // Pixel Size change
    this.inputUnit.oninput  = function() {
    //  console.log(inputAutoSize.checked);
        this.outputU.innerHTML = this.inputUnit.value;
    }.bind(this);

    this.outputW = document.getElementById("valueW");
    this.outputW.innerHTML = this.inputHeight.value; // Display the default slider value
    this.inputWidth.oninput = function() {
        this.outputW.innerHTML = this.inputWidth.value;
    //    console.log(inputAutoSize.checked);
        if (this.inputAutoSize.checked){
            this.inputUnit.value = 600/Math.pow(this.inputWidth.value * this.inputHeight.value, 0.5);
            this.outputU.innerHTML = this.inputUnit.value;
        }
    }.bind(this);

    this.outputH = document.getElementById("valueH");
    this.outputH.innerHTML = this.inputWidth.value; // Display the default slider value
    this.inputHeight.oninput = function() {
        this.outputH.innerHTML = this.inputHeight.value;
        if (this.inputAutoSize.checked){
    //      console.log(600/Math.pow(outputW.innerHTML*outputH.innerHTML,0.5));
        this.inputUnit.value = 600/Math.pow(this.inputWidth.value * this.inputHeight.value, 0.5);
          this.outputU.innerHTML = this.inputUnit.value;
        }
    }.bind(this);

    this.gameStartData;
    this.gameStarted = false;
    //ADD EVENT LISTENERS FOR BUTTONS


    this.stateMachine("mainMenuScreen");
    //var self = this;
    this.newGameBtn.addEventListener ("click", function() {
      this.stateMachine("newGameCreatinMenu");
    }.bind(this));

    this.continueBtn.addEventListener ("click", function() {

        console.log(typeof(this.game.isRunning));
      if (this.game.isRunning){
        this.stateMachine("showBoard");
      }
    }.bind(this));

    this.backBtn.addEventListener ("click", function() {
      this.stateMachine("mainMenuScreen");
    }.bind(this));

    this.startgameBtn.addEventListener ("click", function() {

      //fix this
      let inputFields = [this.inputWidth, this.inputHeight, this.inputUnit];

      if (this.validateInput(newGameInputs)) {
        console.log("true");
        console.log("inputPlayersName", this.inputPlayersName);
        this.gameStartData = {

          'name': this.inputPlayersName.value,
          'mapWidth': parseInt(this.inputWidth.value),
          'mapHeight': parseInt(this.inputHeight.value),
          'mapUnit': parseInt(this.inputUnit.value),
          'difficulty' : this.inputDifficulty.value
        };
         this.game = new Game(this.gameStartData, this.canvas, 2, [87, 65, 83, 68], this.interFace); //WASD
         console.log("this.game",this.game);
         this.gameStarted = this.game.isRunning;
         this.game.generateFood();
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

GameUI.prototype.validateInput = function(inputFields) {
  //console.log("inputs",inputs);
  var valid = true;
  for (var i = 0; i < inputFields.length; i++) {
    valid &= inputFields[i].checkValidity();
  }
  return valid;
};

GameUI.prototype.stateMachine = function(nextState) {
  console.log("nextState", nextState);
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
      // Load preset values for setup creen
      //console.log("localStorage.getItem('gameStartData') !== undefined",localStorage.getItem("gameStartData") !== undefined);
      if (localStorage.getItem("gameStartData") !== undefined){
      	this.gameStartData = localStorage.getItem('gameStartData');
        console.log("localStorage.getItem('gameStartData')", localStorage.getItem('gameStartData'));
  //      console.log("this.gameStartData" , this.gameStartData);
      	this.gameStartData = JSON.parse(this.gameStartData);
      	//console.log('gameStartData= : ', this.gameStartData);
    //    console.log("inputPlayersName.value before",inputPlayersName.value);
        this.inputPlayersName.value = this.gameStartData.name;
    //    console.log("inputPlayersName.value after",inputPlayersName.value);
        this.inputWidth.value = this.gameStartData.mapWidth;
        this.inputHeight.value = this.gameStartData.mapHeight;
      	this.inputUnit.value = this.gameStartData.mapUnit;
        this.inputDifficulty.value = this.gameStartData.difficulty;
      }

      break;
// recieve the object from storage
    case "showBoard":
      if(typeof(this.game) !== "undefined") this.game.continueGame();
      setVisibility(this.menuMain, this.newGameMenu , false);
      setVisibility(this.canvas,this.controlFeedback, true);
      break;

    case "highScore":
      break;
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
