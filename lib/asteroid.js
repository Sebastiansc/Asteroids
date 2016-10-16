const Util = require('./utility.js');
const MovingObject = require('./moving_object.js');

function Asteroid(pos, game){
  MovingObject.call(this,
    {color: "orange",
    radius: 20,
    pos: pos,
    game: game,
    vel: Util.randomVec()
  });
}

Util.inherits(Asteroid, MovingObject);

module.exports = Asteroid;
