

//flag leütés felengedés törlés




//Snake positions, speed, food position
//var snake, snake2;

var gameUI = new GameUI();

function GameUI() {
    const menuMain = document.getElementById ('menu');
    const scoreDiv = document.getElementById ('score');
    const debugDiv = document.getElementById("debug");
    const controlFeedback = document.getElementById ('control-feedback');

    const canvas = document.querySelector ('canvas');
    const cxt = canvas.getContext ("2d");
    const newGameBtn = document.getElementById ('newGame-btn');
    const highScoreBtn = document.getElementById ('highScore-btn');
    const continueBtn = document.getElementById ('continue-btn');
    const startgameBtn = document.getElementById ('startgame-btn');
    const backBtn = document.getElementById ('back-btn');

    this.interFace = [debugDiv, scoreDiv];
    console.log("this.interFace",this.interFace);

    const inputPlayersName = document.getElementById('inputPlayersName');
    const inputDifficulty = document.getElementById('inputDifficulty');
    const inputUnit = document.getElementById('inputUnit');
    const inputWidth = document.getElementById('inputCanvasWidth');
    const inputHeight = document.getElementById('inputCanvasHeight');
    const inputAutoSize = document.getElementById("switch"); // switch for auto pixel size

    //Auto size switch changing detection
    inputAutoSize.onchange  = function() {
        console.log("Hello");
        inputUnit.disabled = inputAutoSize.checked; // if checked dont let change size input
      if (inputAutoSize.checked){
          inputUnit.value = 600/Math.pow(outputW.innerHTML*outputH.innerHTML,0.5);
          inputUnit.disabled = true;
          console.log("disabled?", outputU.disabled);
          outputU.innerHTML = this.value;
      }
    };

    const outputD = document.getElementById("valueD");
    outputD.innerHTML = inputDifficulty.value; // Display the default slider value
    inputDifficulty.oninput  = function() {
        outputD.innerHTML = inputDifficulty.value;
    };

    // Update the current slider value (each time you drag the slider handle)
    const outputU = document.getElementById("valueU"); //pixel size
    outputU.innerHTML = inputUnit.value; // Display the default slider value

    inputUnit.oninput  = function() {
      console.log(inputAutoSize.checked);
        outputU.innerHTML = inputUnit.value;
    };

    const outputW = document.getElementById("valueW");
    outputW.innerHTML = inputHeight.value; // Display the default slider value
    inputWidth.oninput = function() {
        outputW.innerHTML = this.value;
        console.log(inputAutoSize.checked);
        if (inputAutoSize.checked){
            inputUnit.value = 600/Math.pow(outputW.innerHTML*outputH.innerHTML,0.5);
            outputU.innerHTML = inputUnit.value;
        }
    };

    const outputH = document.getElementById("valueH");
    outputH.innerHTML = inputWidth.value; // Display the default slider value
    inputHeight.oninput = function() {
        outputH.innerHTML = this.value;
        if (inputAutoSize.checked){
          console.log(600/Math.pow(outputW.innerHTML*outputH.innerHTML,0.5));
          inputUnit.value = 600/Math.pow(outputW.innerHTML*outputH.innerHTML,0.5);
          outputU.innerHTML = inputUnit.value;
        }
    };

    this.gameStartData;
    this.gameStarted = false;
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

          if (this.gameStarted) {
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

          if (this.gameStarted) {
            setVisibility(scoreDiv, true);
          }

          ///local storage mentes

          // Load preset values for setup creen
          //console.log("localStorage.getItem('gameStartData') !== undefined",localStorage.getItem("gameStartData") !== undefined);
          if (localStorage.getItem("gameStartData") !== undefined){
          	this.gameStartData = localStorage.getItem('gameStartData');
            console.log("localStorage.getItem('gameStartData')", localStorage.getItem('gameStartData'));
      //      console.log("this.gameStartData" , this.gameStartData);
          	this.gameStartData = JSON.parse(this.gameStartData);
          	//console.log('gameStartData= : ', this.gameStartData);
        //    console.log("inputPlayersName.value before",inputPlayersName.value);
            inputPlayersName.value = this.gameStartData.name;
        //    console.log("inputPlayersName.value after",inputPlayersName.value);
            inputWidth.value = this.gameStartData.mapWidth;
            inputHeight.value = this.gameStartData.mapHeight;
          	inputUnit.value = this.gameStartData.mapUnit;
            inputDifficulty.value = this.gameStartData.difficulty;
          }

          break;
    // Retrieve the object from storage
        case "showBoard":
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


    this.stateMachine("mainMenuScreen");
    //var self = this;
    newGameBtn.addEventListener ("click", function() {
      this.stateMachine("newGameCreatinMenu");
    }.bind(this));

    continueBtn.addEventListener ("click", function() {

        console.log(typeof(this.game.isRunning));
      if (this.game.isRunning){
        this.stateMachine("showBoard");
      }
    }.bind(this));

    backBtn.addEventListener ("click", function() {
      this.stateMachine("mainMenuScreen");
    }.bind(this));

    startgameBtn.addEventListener ("click", function() {
      let inputFields = [inputWidth, inputHeight, inputUnit];

      if (this.validateInput(inputFields)) {
        console.log("true");
        this.gameStartData = {
          'name': inputPlayersName.value,
          'mapWidth': parseInt(inputWidth.value),
          'mapHeight': parseInt(inputHeight.value),
          'mapUnit': parseInt(inputUnit.value),
          'difficulty' : inputDifficulty.value
        };
         this.game = new Game(this.gameStartData, canvas, 2, [87, 65, 83, 68], this.interFace); //WASD
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
