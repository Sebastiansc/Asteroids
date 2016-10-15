const GameView = require('./lib/game_view.js');
window.addEventListener("DOMContentLoaded", function(){
  let canvasEl = document.getElementById("canvasEl");
  canvasEl.style.border = "thick solid blue"
  gameView = new GameView(canvasEl.width, canvasEl.height);
  canvasEl = canvasEl.getContext("2d");
  gameView.start(canvasEl);
})
