function GameUI() {
    //MAINMENU
    this.newGameMenu = document.getElementById ('newgame-menu');
    this.menuMain = document.getElementById ('menu');
    this.highScoreBtn = document.getElementById ('highScore-btn');
    this.continueBtn = document.getElementById ('continue-btn');

    // END GAME POP UP
    this.endGameDiv = document.getElementById("endgamemenu");

    // GAME
    this.controlFeedback = document.getElementById ('control-feedback');;
    this.scoreDiv = document.getElementById ('score');
    this.debugDiv = document.getElementById("debug");
    this.canvas = document.querySelector ('canvas');
    this.cxt = this.canvas.getContext ("2d");


    //HIGHSCORE
    this.highscore = [];
    this.highscoreDiv = document.getElementById('highscore-cont');
    this.highscoreTable = document.getElementById('highscore-table');
    this.sizeListDiv = document.getElementById('size-list');
    this.sizePickerDiv = document.getElementById('size-picker');

    // Get Btns
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
      document.getElementById('endMainMenu-btn'),
      document.getElementById('highscoreback-btn'),
    ];

    this.interFace = [this.debugDiv, this.scoreDiv];

    newGameInputs = document.getElementsByTagName("input");
    for (var i = 0; i < newGameInputs.length; i++) {
     this[newGameInputs[i].id] = newGameInputs[i];
    }

  setVisibility(this.endGameDiv, this.highscoreDiv, false);
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

    this.sizePickerDiv.addEventListener ("change", function() {
      this.updateTable();
    }.bind(this));

    this.highScoreBtn.addEventListener ("click", function() {
        this.stateMachine("highScore");
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


GameUI.prototype.compare = function(a,b) {
  if (a.score > b.score)
    return -1;
  if (a.score < b.score)
    return 1;
  return 0;
};

GameUI.prototype.newGameInit = function() {
  let highscore = this.highscore;
  if (this.validateInputs(newGameInputs)) {
    this.saveGameData();
    this.gameOver = false;
    this.game = new Game({
      gameStartData: this.gameStartData,
      canvas: this.canvas,
      snakeLength: 2,
      controlKeys: [87, 65, 83, 68],
      interFace: this.interFace,
      onGameEndAction: () => {
        highscore = this.getFromLocalStorage("highscoreTable");
        console.log("beforepush", highscore);
        highscore.push(this.game.result);
        highscore.sort(this.compare);
        console.log("highscore", highscore);
        localStorage.setItem('highscoreTable', JSON.stringify(highscore));
        this.stateMachine("gameOver");
      }
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
      setVisibility(this.canvas, this.newGameMenu, this.controlFeedback, this.endGameDiv, this.debugDiv, this.highscoreDiv, false);

      if (typeof(this.game) !== "undefined" && !this.gameOver) {
        setVisibility(this.scoreDiv, this.continueBtn, true);
      } else {
        setVisibility(this.continueBtn, false);
      }
      break;
    case "newGameCreatinMenu":
      setVisibility(this.menuMain, this.canvas, this.endGameDiv, this.controlFeedback, false);
      setVisibility(this.newGameMenu, true);

      if (typeof(this.game) !== "undefined") {
        setVisibility(this.scoreDiv, true);
      }
      this.loadGameData();
      break;
    case "showBoard":
      if(typeof(this.game) !== "undefined") this.game.continueGame();
      setVisibility(this.menuMain, this.newGameMenu, this.endGameDiv, false);
      setVisibility(this.canvas,this.controlFeedback, this.debugDiv, true);
      break;
    case "gameOver":
      this.game.pauseGame();
      this.gameOver = true;
      setVisibility(this.endGameDiv, true);
      this.finalScore.innerHTML = this.game.result.name+"'s score: " + this.game.result.score;
      break;
    case "highScore":
      setVisibility(this.menuMain, this.canvas, this.endGameDiv, this.controlFeedback, this.debugDiv, false);
      setVisibility(this.highscoreDiv, true);
    //  this.highscore.push(this.game.result);
      this.highscore = this.getFromLocalStorage("highscoreTable");
      if (typeof(this.highscore) !== "undefined") {
        this.buildHighScore();
        this.updateTable();
      }
      break;
  }
  console.log(this.currentState);
};
/*
<thead>
  <tr>
    <th scope="col">#</th>
    <th scope="col">Name</th>
    <th scope="col">Score</th>
  </tr>
*/

GameUI.prototype.buildHighScore = function() {
  let highscore = this.highscore;
  //body reference
  // create elements <table> and a <tbody>
  //GET list of map size of records
  this.resultListCategories = [];

  while (this.sizePickerDiv.firstChild) {
    this.sizePickerDiv.removeChild(this.sizePickerDiv.firstChild);
  }

  for (let i = 0; i < highscore.length; i++) {
    const recordHighscore = highscore[i].mapSize;
    console.log("highscore[i].mapSize", highscore[i].mapSize);
    if (!this.resultListCategories.includes(recordHighscore)) {
      this.resultListCategories.push(recordHighscore);
      let opt = document.createElement('option');
      opt.value = recordHighscore;
      opt.innerText = recordHighscore;
      this.sizePickerDiv.appendChild(opt);
      console.log("sizePickerDiv", opt.value);
    }
  }
};

GameUI.prototype.updateTable = function() {
  let highscore = this.highscore;
  let currentMapSize = this.sizePickerDiv.value;
  let filtered = highscore.filter(result => result.mapSize === currentMapSize);
  //this.sizeListDiv.innerHTML = resultListCategories.join(' ');
  const myTable = this.highscoreTable;
  var myTableBody = myTable.tBodies[0];
  var newTableBody = document.createElement('tbody');
  var highscoreProperyNames = Object.getOwnPropertyNames(filtered[0]);
  console.log(highscoreProperyNames);
  for (var i = 0; i < filtered.length; i++) {
    var row = newTableBody.insertRow([i]);
    var myObj;
    var cell = row.insertCell(0);
    cell.innerHTML = [i+1];
    for (var j = 0; j < highscoreProperyNames.length; j++) {
      var cell = row.insertCell(j+1);
      cell.innerHTML = filtered[i][highscoreProperyNames[j]];
      }
    }
    myTable.replaceChild(newTableBody, myTableBody);
};

GameUI.prototype.getFromLocalStorage = function(item){
  var loadedData = {};
  loadedData = localStorage.getItem(item);
  loadedData = JSON.parse(loadedData);
  if (localStorage.hasOwnProperty(item)) {
    console.log("typeof(loadedData)", typeof(loadedData));
    return loadedData;
  } else{
    return [];
  }
};
// var myTable = this.highscoreTable;
// var header = myTable.createTHead();
// header.insertRow(0).appendChild(document.createElement("th"));


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
    //
    // outputH.innerHTML = inputWidth.value; // Display the default slider value
    // outputW.innerHTML = inputHeight.value; // Display the default slider value
    // outputD.innerHTML = inputDifficulty.value; // Display the default slider value
    // outputP.innerHTML = this.inputPixelSize.value; // Display the default slider value

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
