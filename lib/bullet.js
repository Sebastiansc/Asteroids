const MovingObject = require('./moving_object.js');
const Utility = require('./utility.js');

function Bullet(pos, vel, game){
  MovingObject.call(this,{
    pos: pos,
    vel: vel,
    color: "red",
    radius: 2,
    game: game
  });
}

Utility.inherits(Bullet, MovingObject);

Bullet.prototype.collideWith = function (object) {
  if (object.constructor.name === "Asteroid"){
    object.game.remove(object, this);
  }
};

Bullet.prototype.isWrappable = function () {
  return false;
};
module.exports = Bullet;
