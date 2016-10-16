const Game = require('./game.js');
const key = require('../node_modules/keymaster/keymaster.js');

function GameView (width, height){
  this.game = new Game(width, height);
  this.lastTime = 0;
}

GameView.prototype.start = function (context) {
  this.bindKeyHandlers();
  const img = new Image();
  img.onload = function() {
    context.drawImage(img, 0, 0);
  };
  img.src = 'images/BackgroundForAsteroids.png';
  const animateCallback = () => {
    this.game.step();
    img.onload();
    this.game.draw(context);
    context.clearRect(0,0,this.width, this.height);
    requestAnimationFrame(animateCallback);
  };

  animateCallback();
  // requestAnimationFrame(this.animate(new Date().getTime(), context));
};

GameView.prototype.animate = function(currentTime, context) {
  let delta = currentTime - this.lastTime;
  this.game.step(delta);
  this.game.draw(context);
  this.lastTime = new Date().getTime();
  requestAnimationFrame(this.animate(new Date().getTime(), context));
};

GameView.prototype.bindKeyHandlers = function () {
  key("w", () => {
    this.game.ship.power([0.5, -4]);
  });
  key("a", () => {
    this.game.ship.power([-4,0.5]);
  });
  key("s", () => {
    this.game.ship.power([0.5,4]);
  });
  key("d", () => {
    this.game.ship.power([4,0.5]);
  });
  key("space", () => {
    this.game.ship.fireBullet();
  });

};

module.exports = GameView;
