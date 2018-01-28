
function getRandomInt (max)  {
  return Math.floor (Math.random() * Math.floor (max));
}

function setVisibility(element, show) {
  if (show) {
    element.style.display = "block"; //visible
    element.visible = true;
  } else {

  element.style.display = "none"; //hidden
    element.visible = false;
  }
}

function toggleVisiblity(element) {
  if (element.visible == true) {
    setVisibility(div, false);
    element.visible = false;
  } else {
    setVisibility(div, true);
    element.visible = true;
  }
}

function createDivForDebug(debugValue){
  return '<div class="debugvalue">' + debugValue + "</div>";
}

Array.prototype.removeElement = function(element) {
  var index = this.indexOf(element);
  if (index > -1){
    this.splice(index,1);
  }
};

function setPressed(element, pressed) {
  if (pressed) {
    element.classList.add("pressed"); //pressed
    //console.log("element.classList",element.classList);
    element.pressed = true;
  } else {
    element.classList.remove("pressed"); //pressed
    element.pressed = false;
  }
}

function validateInput(inputFields) {
  //console.log("inputs",inputs);
  var valid = true;
  for (var i = 0; i < inputFields.length; i++) {
    valid &= inputFields[i].checkValidity();
  }
  return valid;
};
