const Asteroid = require ('./asteroid.js');
const Ship = require('./ship.js');

function Game(width, height){
  this.width = width;
  this.height = height;
  this.asteroids = [];
  this.addAsteroids();
  this.ship = new Ship(this.randomPosition(), this);
  this.bullets = [];
}

Game.NUM_ASTEROIDS = 10;

Game.prototype.step = function (delta) {
  this.moveObjects(delta);
  this.checkCollisions();
};

Game.prototype.moveObjects = function (delta) {
  this.allObjects().forEach( object => object.move(delta));
};

Game.prototype.checkCollisions = function () {
  this.allObjects().forEach(object => {
    this.allObjects().forEach(otherObject => {
      if (object.isCollidedWith(otherObject)){
        object.collideWith(otherObject);
      }
    });
  });
};

Game.prototype.wrap = function (pos) {
  function valueChecker(num, size){
    if (num < 0) {
      return size;
    } else if (num > size) {
      return 0;
    } else {
      return num;
    }
  }

  return [
    valueChecker(pos[0], this.width),
    valueChecker(pos[1], this.height)
  ];
};

Game.prototype.draw = function (ctx) {
  // ctx.clearRect(0,0,this.width, this.height);
  this.allObjects().forEach( object => object.draw(ctx));
};

Game.prototype.allObjects = function () {
  return this.asteroids.concat(this.ship).concat(this.bullets);
};

Game.prototype.outOfBounds = function (pos) {
  return pos[0] > this.width ||
  pos[1] > this.height ||
  pos[0] < 0 || pos[1] < 0;
};

Game.prototype.addAsteroids = function () {
  for (let i=0; i<Game.NUM_ASTEROIDS; i++){
    this.asteroids.push(new Asteroid(this.randomPosition(), this) );
  }
};

Game.prototype.randomPosition = function () {
  let x = Math.random() * this.width;
  let y = Math.random() * this.height;
  return [x,y];
};

Game.prototype.remove = function () {
  let args = Array.from(arguments);
  args.forEach(object => {
  if (object.constructor.name === "Asteroid") {
    this.asteroids.splice(this.asteroids.indexOf(object), 1);
  } else {
    this.bullets.splice(this.bullets.indexOf(object), 1);
  }
  });
};


module.exports = Game;
