
function getRandomInt (max)  {
  return Math.floor (Math.random() * Math.floor (max));
}

function setVisibility(div, show) {
  if (show) {
    div.classList.remove ('hidden');
    div.classList.add ('visible');
    div.visible = true;
  } else {
    div.classList.remove ('visible');
    div.classList.add ('hidden');
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
