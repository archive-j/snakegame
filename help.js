
function getRandomInt (max)  {
  return Math.floor (Math.random() * Math.floor (max));
}

function setVisibility(div, show) {
  if (show) {

    div.style.display = "block"; //hidden 
    div.visible = true;
  } else {

  div.style.display = "none"; //hidden
    div.visible = false;
  }
}

function toggleVisiblity(div) {
  if (div.visible == true) {
    setVisibility(div, false);
    div.visible = false;
  } else {
    setVisibility(div, true);
    div.visible = true;
  }
}

function debugValue(debugValue){
  return '<div class="debugvalue">' + debugValue + "</div>";
}

Array.prototype.removeElement = function(element) {
  var index = this.indexOf(element);
  if (index > -1){
    this.splice(index,1);
  }
};
