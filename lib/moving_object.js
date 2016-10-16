function MovingObject (options) {
  this.pos = options.pos;
  this.vel = options.vel;
  this.radius = options.radius;
  this.color = options.color;
  this.game = options.game;
}

MovingObject.prototype.draw = function (canvasEl) {
  canvasEl.fillStyle = this.color;
  canvasEl.beginPath();

  canvasEl.arc(
    this.pos[0],
    this.pos[1],
    this.radius,
    0,
    2 * Math.PI,
    false
  );

  canvasEl.fill();
};

MovingObject.prototype.isWrappable = function () {
  return true;
};


MovingObject.prototype.move = function (delta) {
  this.pos[0] += this.vel[0] * delta / 20;
  this.pos[1] += this.vel[1] * delta / 20;
  if(this.game.outOfBounds(this.pos)){
    if(this.isWrappable()){
      let wrappedPos = this.game.wrap(this.pos);
      this.pos[0] = wrappedPos[0];
      this.pos[1] = wrappedPos[1];
    } else {
      this.game.remove(this);
    }
  }
};

MovingObject.prototype.isCollidedWith = function(otherObject) {
  function distance(pos1, pos2){
    let x1 = pos1[0];
    let y1 = pos1[1];
    let x2 = pos2[0];
    let y2 = pos2[1];
    return Math.sqrt(Math.pow((x1 - x2),2) + Math.pow((y1 - y2), 2) );
  }

  let radiusSum = (this.radius + otherObject.radius);
  return distance(this.pos, otherObject.pos) < radiusSum;
};

MovingObject.prototype.collideWith = function (otherObject) {
  let otherObjectClass = otherObject.constructor.name;
  if ( otherObjectClass === "Ship" && this.constructor.name !== "Ship"){
    otherObject.relocate();
  }
};


module.exports = MovingObject;
