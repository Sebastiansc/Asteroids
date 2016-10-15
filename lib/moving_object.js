function MovingObject (options) {
  this.centerX = options.pos[0];
  this.centerY = options.pos[1];
  this.vel = options.vel;
  this.radius = options.radius;
  this.color = options.color;
  this.game = options.game;
}

MovingObject.prototype.draw = function (canvasEl) {
  canvasEl.fillStyle = this.color;
  canvasEl.beginPath();

  canvasEl.arc(
    this.centerX,
    this.centerY,
    this.radius,
    0,
    2 * Math.PI,
    false
  );

  canvasEl.fill();
};

MovingObject.prototype.move = function () {
  this.centerX += this.vel[0];
  this.centerY += this.vel[1];
  let wrappedPos = this.game.wrap([this.centerX, this.centerY]);
  this.centerX = wrappedPos[0];
  this.centerY = wrappedPos[1];
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
  return distance([this.centerX, this.centerY],
    [otherObject.centerX, otherObject.centerY]) < radiusSum
}

MovingObject.prototype.collideWith = function (otherObject) {
  this.game.remove(otherObject);
  this.game.remove(this);
};


module.exports = MovingObject;
