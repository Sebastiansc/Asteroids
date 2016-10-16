const Game = require('./game.js');
const key = require('../node_modules/keymaster/keymaster.js');

function GameView (width, height, context){
  this.game = new Game(width, height);
  this.lastTime = 0;
}

GameView.prototype.start = function (context) {
  this.bindKeyHandlers();
  const img = new Image();
  img.onload = () => {
    context.drawImage(img, 0, 0);
  };
  img.src = 'images/BackgroundForAsteroids.png';
  const animateCallback = () => {
    let delta = new Date().getTime() - this.lastTime;
    this.game.step(delta);
    img.onload();
    this.game.draw(context);
    context.clearRect(0,0,this.width, this.height);
    this.lastTime = new Date().getTime();
    requestAnimationFrame(animateCallback);
  };
  //
  animateCallback();
  // let currentTime = new Date().getTime();
  // requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.animate = function() {
  let delta = new Date().getTime() - this.lastTime;
  this.game.step(delta);
  this.game.draw(this.context);
  this.context.clearRect(0,0,this.width, this.height);
  this.lastTime = new Date().getTime();
  requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.bindKeyHandlers = function () {
  key("w", () => {
    this.game.ship.power([0, -4]);
  });
  key("a", () => {
    this.game.ship.power([-4,0]);
  });
  key("s", () => {
    this.game.ship.power([0,4]);
  });
  key("d", () => {
    this.game.ship.power([4,0]);
  });
  key("space", () => {
    this.game.ship.fireBullet();
  });

};

module.exports = GameView;
