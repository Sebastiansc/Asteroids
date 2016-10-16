const GameView = require('./lib/game_view.js');
window.addEventListener("DOMContentLoaded", function(){
  let canvasEl = document.getElementById("canvasEl");
  let context = canvasEl.getContext("2d");
  let gameView = new GameView(canvasEl.width, canvasEl.height);
  gameView.start(context);
});
