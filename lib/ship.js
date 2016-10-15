const MovingObject = require('./moving_object.js');

function Ship () {
  MovingObject.call(this)
}

Ship.RADIUS= 20;
Ship.COLOR = "black";
