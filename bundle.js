/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const GameView = __webpack_require__(1);
	window.addEventListener("DOMContentLoaded", function(){
	  let canvasEl = document.getElementById("canvasEl");
	  canvasEl.style.border = "thick solid blue"
	  gameView = new GameView(canvasEl.width, canvasEl.height);
	  canvasEl = canvasEl.getContext("2d");
	  gameView.start(canvasEl);
	})


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(2);

	function GameView (width, height){
	  this.game = new Game(width, height);
	}

	GameView.prototype.start = function (canvasEl) {


	  const animateCallback = () => {
	    this.game.step();
	    this.game.draw(canvasEl);
	    requestAnimationFrame(animateCallback);
	  };

	  animateCallback();
	}

	module.exports = GameView;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Asteroid = __webpack_require__ (3);

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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(4);
	const MovingObject = __webpack_require__(5);

	function Asteroid(pos, game){
	  MovingObject.call(this,
	    {color: "orange",
	    radius: 30,
	    pos: pos,
	    game: game,
	    vel: Util.randomVec()
	  });
	}

	Util.inherits(Asteroid, MovingObject);

	module.exports = Asteroid;


/***/ },
/* 4 */
/***/ function(module, exports) {

	const Util = {
	  inherits (childClass, parentClass){
	    function Surrogate(){};
	    Surrogate.prototype = parentClass.prototype;
	    childClass.prototype = new Surrogate;
	    childClass.prototype.constructor = childClass;
	  },

	  randomVec(){
	    let randNums = [-2.5, -2, -1, -0.5, 0.7, 1, 2, 3]

	    return [randNums[Math.floor(Math.random()*randNums.length)],
	    randNums[Math.floor(Math.random()*randNums.length)]];
	  }
	}

	module.exports = Util;


/***/ },
/* 5 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);