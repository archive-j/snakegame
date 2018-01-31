
Array.prototype.removeElement = function(element) {
  var index = this.indexOf(element);
  if (index > -1){
    this.splice(index,1);
  }
};

function getRandomInt (max)  {
  return Math.floor (Math.random() * Math.floor (max));
}
//
// function setVisibility(element, show) {
//   if (show) {
//     element.style.display = "block"; //visible
//     element.visible = true;
//   } else {
//
//   element.style.display = "none"; //hidden
//     element.visible = false;
//   }
// }

function setVisibility(...args) {
  var show = args[args.length-1];
  //Get elements and drop show value
  var elements = args;
  elements.pop();
  //set visbility for elements
  for (var i = 0; i < elements.length; i++) {
    console.log("hago", elements[i]);
    if (show) {
      elements[i].style.display = "block"; //visible
      elements[i].visible = true;
    } else {
    elements[i].style.display = "none"; //hidden
      elements[i].visible = false;
    }
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
