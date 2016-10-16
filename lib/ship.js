const MovingObject = require('./moving_object.js');
const Utility = require('./utility.js');
const Bullet = require('./bullet.js');

function Ship (pos, game) {
  MovingObject.call(this,
                    {pos: pos,
                     vel: [0, 0],
                     color: "red",
                     radius: 20,
                     game: game
                    });
}

Utility.inherits(Ship, MovingObject);
Ship.MAX_SPEED = 4;

Ship.prototype.relocate = function () {
  let newPos = this.game.randomPosition();
  this.pos[0] = newPos[0];
  this.pos[1] = newPos[1];
  this.vel = [0,0];
};

Ship.prototype.power = function (impulse) {
  this.vel[0] += impulse[0];
  this.vel[1] += impulse[1];

  this.vel = this.vel.map(vec =>{
    if (Math.abs(vec) > Ship.MAX_SPEED ){
      if (vec < 0) return -(Ship.MAX_SPEED);
      return Ship.MAX_SPEED;
    }
    return vec;
  });
};

Ship.prototype.fireBullet = function () {
  let bullet = new Bullet(
    [this.pos[0], this.pos[1]],
    [this.vel[0] * 2, this.vel[1] * 2],
    this.game);

  this.game.bullets.push(bullet);
};

// Ship.RADIUS= 20;
// Ship.COLOR = "black";

module.exports = Ship;
