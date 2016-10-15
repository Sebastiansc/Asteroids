const Game = require('./game.js');

function GameView (width, height){
  this.game = new Game(width, height);
}

GameView.prototype.start = function (canvasEl) {


  const animateCallback = () => {
    this.game.step();
    this.game.draw(canvasEl);
    requestAnimationFrame(animateCallback);
  };

  animateCallback();
}

module.exports = GameView;
