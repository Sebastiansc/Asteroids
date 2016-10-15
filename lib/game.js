const Asteroid = require ('./asteroid.js');

function Game(width, height){
  this.width = width;
  this.height = height;
  this.asteroids = [];
  this.addAsteroids();
}

Game.NUM_ASTEROIDS = 10;

Game.prototype.addAsteroids = function () {
  for (let i=0; i<Game.NUM_ASTEROIDS; i++){
    this.asteroids.push(new Asteroid(this.randomPosition(), this) )
  }
};

Game.prototype.randomPosition = function () {
  let x = Math.random() * this.width;
  let y = Math.random() * this.height;
  return [x,y];
};

Game.prototype.draw = function (ctx) {
  ctx.clearRect(0,0,this.width, this.height);
  this.asteroids.forEach( asteroid => asteroid.draw(ctx));
}

Game.prototype.moveObjects = function () {
  this.asteroids.forEach( asteroid => asteroid.move());
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

Game.prototype.checkCollisions = function () {
  this.asteroids.forEach(asteroid => {
    this.asteroids.forEach(otherAsteroid => {
      console.log(otherAsteroid);
      if (otherAsteroid === asteroid) return;
      if (asteroid.isCollidedWith(otherAsteroid)){
        asteroid.collideWith(otherAsteroid);
      }
    });
  });
};

Game.prototype.step = function () {
  this.moveObjects();
  this.checkCollisions();
};

Game.prototype.remove = function (asteroid) {
  this.asteroids.splice(this.asteroids.indexOf(asteroid), 1)
};

module.exports = Game;
