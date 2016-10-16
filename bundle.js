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
	  let gameView = new GameView(canvasEl.width, canvasEl.height);
	  canvasEl = canvasEl.getContext("2d");
	  gameView.start(canvasEl);
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(2);
	const key = __webpack_require__(7);

	function GameView (width, height){
	  this.game = new Game(width, height);
	  this.lastTime = 0;
	}

	GameView.prototype.start = function (context) {
	  this.bindKeyHandlers();
	  const img = new Image();
	  img.onload = function() {
	    context.drawImage(img, 0, 0);
	  };
	  img.src = 'images/BackgroundForAsteroids.png';
	  const animateCallback = () => {
	    this.game.step();
	    img.onload();
	    this.game.draw(context);
	    context.clearRect(0,0,this.width, this.height);
	    requestAnimationFrame(animateCallback);
	  };

	  animateCallback();
	  // requestAnimationFrame(this.animate(new Date().getTime(), context));
	};

	GameView.prototype.animate = function(currentTime, context) {
	  let delta = currentTime - this.lastTime;
	  this.game.step(delta);
	  this.game.draw(context);
	  this.lastTime = new Date().getTime();
	  requestAnimationFrame(this.animate(new Date().getTime(), context));
	};

	GameView.prototype.bindKeyHandlers = function () {
	  key("w", () => {
	    this.game.ship.power([0.5, -4]);
	  });
	  key("a", () => {
	    this.game.ship.power([-4,0.5]);
	  });
	  key("s", () => {
	    this.game.ship.power([0.5,4]);
	  });
	  key("d", () => {
	    this.game.ship.power([4,0.5]);
	  });
	  key("space", () => {
	    this.game.ship.fireBullet();
	  });

	};

	module.exports = GameView;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Asteroid = __webpack_require__ (3);
	const Ship = __webpack_require__(6);

	function Game(width, height){
	  this.width = width;
	  this.height = height;
	  this.asteroids = [];
	  this.addAsteroids();
	  this.ship = new Ship(this.randomPosition(), this);
	  this.bullets = [];
	}

	Game.NUM_ASTEROIDS = 2;

	Game.prototype.step = function () {
	  this.moveObjects();
	  this.checkCollisions();
	};

	Game.prototype.moveObjects = function () {
	  this.allObjects().forEach( object => object.move());
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
	    function Surrogate(){}
	    Surrogate.prototype = parentClass.prototype;
	    childClass.prototype = new Surrogate;
	    childClass.prototype.constructor = childClass;
	  },

	  randomVec(){
	    let randNums = [-2.5, -2, -1, -0.5, 0.7, 1, 2, 3];

	    return [randNums[Math.floor(Math.random()*randNums.length)],
	    randNums[Math.floor(Math.random()*randNums.length)]];
	  }
	};

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

	MovingObject.prototype.isWrappable = function () {
	  return true;
	};


	MovingObject.prototype.move = function () {
	  this.centerX += this.vel[0];
	  this.centerY += this.vel[1];
	  if(this.game.outOfBounds([this.centerX, this.centerY])){
	    if(this.isWrappable()){
	      let wrappedPos = this.game.wrap([this.centerX, this.centerY]);
	      this.centerX = wrappedPos[0];
	      this.centerY = wrappedPos[1];
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
	  return distance([this.centerX, this.centerY],
	    [otherObject.centerX, otherObject.centerY]) < radiusSum;
	};

	MovingObject.prototype.collideWith = function (otherObject) {
	  let otherObjectClass = otherObject.constructor.name;
	  if ( otherObjectClass === "Ship" && this.constructor.name !== "Ship"){
	    otherObject.relocate();
	  }
	};


	module.exports = MovingObject;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(5);
	const Utility = __webpack_require__(4);
	const Bullet = __webpack_require__(8);

	function Ship (pos, game) {
	  MovingObject.call(this,
	                    {pos: pos,
	                     vel: [0.5,0.5],
	                     color: "red",
	                     radius: 20,
	                     game: game
	                    });
	}

	Utility.inherits(Ship, MovingObject);
	Ship.MAX_SPEED = 4;

	Ship.prototype.relocate = function () {
	  let newPos = this.game.randomPosition();
	  this.centerX = newPos[0];
	  this.centerY = newPos[1];
	  this.vel = [0.5,0.5];
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
	    [this.centerX, this.centerY],
	    [this.vel[0] * 2, this.vel[1] * 2],
	    this.game);

	  this.game.bullets.push(bullet);
	};

	// Ship.RADIUS= 20;
	// Ship.COLOR = "black";

	module.exports = Ship;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	//     keymaster.js
	//     (c) 2011-2013 Thomas Fuchs
	//     keymaster.js may be freely distributed under the MIT license.

	;(function(global){
	  var k,
	    _handlers = {},
	    _mods = { 16: false, 18: false, 17: false, 91: false },
	    _scope = 'all',
	    // modifier keys
	    _MODIFIERS = {
	      '⇧': 16, shift: 16,
	      '⌥': 18, alt: 18, option: 18,
	      '⌃': 17, ctrl: 17, control: 17,
	      '⌘': 91, command: 91
	    },
	    // special keys
	    _MAP = {
	      backspace: 8, tab: 9, clear: 12,
	      enter: 13, 'return': 13,
	      esc: 27, escape: 27, space: 32,
	      left: 37, up: 38,
	      right: 39, down: 40,
	      del: 46, 'delete': 46,
	      home: 36, end: 35,
	      pageup: 33, pagedown: 34,
	      ',': 188, '.': 190, '/': 191,
	      '`': 192, '-': 189, '=': 187,
	      ';': 186, '\'': 222,
	      '[': 219, ']': 221, '\\': 220
	    },
	    code = function(x){
	      return _MAP[x] || x.toUpperCase().charCodeAt(0);
	    },
	    _downKeys = [];

	  for(k=1;k<20;k++) _MAP['f'+k] = 111+k;

	  // IE doesn't support Array#indexOf, so have a simple replacement
	  function index(array, item){
	    var i = array.length;
	    while(i--) if(array[i]===item) return i;
	    return -1;
	  }

	  // for comparing mods before unassignment
	  function compareArray(a1, a2) {
	    if (a1.length != a2.length) return false;
	    for (var i = 0; i < a1.length; i++) {
	        if (a1[i] !== a2[i]) return false;
	    }
	    return true;
	  }

	  var modifierMap = {
	      16:'shiftKey',
	      18:'altKey',
	      17:'ctrlKey',
	      91:'metaKey'
	  };
	  function updateModifierKey(event) {
	      for(k in _mods) _mods[k] = event[modifierMap[k]];
	  };

	  // handle keydown event
	  function dispatch(event) {
	    var key, handler, k, i, modifiersMatch, scope;
	    key = event.keyCode;

	    if (index(_downKeys, key) == -1) {
	        _downKeys.push(key);
	    }

	    // if a modifier key, set the key.<modifierkeyname> property to true and return
	    if(key == 93 || key == 224) key = 91; // right command on webkit, command on Gecko
	    if(key in _mods) {
	      _mods[key] = true;
	      // 'assignKey' from inside this closure is exported to window.key
	      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = true;
	      return;
	    }
	    updateModifierKey(event);

	    // see if we need to ignore the keypress (filter() can can be overridden)
	    // by default ignore key presses if a select, textarea, or input is focused
	    if(!assignKey.filter.call(this, event)) return;

	    // abort if no potentially matching shortcuts found
	    if (!(key in _handlers)) return;

	    scope = getScope();

	    // for each potential shortcut
	    for (i = 0; i < _handlers[key].length; i++) {
	      handler = _handlers[key][i];

	      // see if it's in the current scope
	      if(handler.scope == scope || handler.scope == 'all'){
	        // check if modifiers match if any
	        modifiersMatch = handler.mods.length > 0;
	        for(k in _mods)
	          if((!_mods[k] && index(handler.mods, +k) > -1) ||
	            (_mods[k] && index(handler.mods, +k) == -1)) modifiersMatch = false;
	        // call the handler and stop the event if neccessary
	        if((handler.mods.length == 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91]) || modifiersMatch){
	          if(handler.method(event, handler)===false){
	            if(event.preventDefault) event.preventDefault();
	              else event.returnValue = false;
	            if(event.stopPropagation) event.stopPropagation();
	            if(event.cancelBubble) event.cancelBubble = true;
	          }
	        }
	      }
	    }
	  };

	  // unset modifier keys on keyup
	  function clearModifier(event){
	    var key = event.keyCode, k,
	        i = index(_downKeys, key);

	    // remove key from _downKeys
	    if (i >= 0) {
	        _downKeys.splice(i, 1);
	    }

	    if(key == 93 || key == 224) key = 91;
	    if(key in _mods) {
	      _mods[key] = false;
	      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = false;
	    }
	  };

	  function resetModifiers() {
	    for(k in _mods) _mods[k] = false;
	    for(k in _MODIFIERS) assignKey[k] = false;
	  };

	  // parse and assign shortcut
	  function assignKey(key, scope, method){
	    var keys, mods;
	    keys = getKeys(key);
	    if (method === undefined) {
	      method = scope;
	      scope = 'all';
	    }

	    // for each shortcut
	    for (var i = 0; i < keys.length; i++) {
	      // set modifier keys if any
	      mods = [];
	      key = keys[i].split('+');
	      if (key.length > 1){
	        mods = getMods(key);
	        key = [key[key.length-1]];
	      }
	      // convert to keycode and...
	      key = key[0]
	      key = code(key);
	      // ...store handler
	      if (!(key in _handlers)) _handlers[key] = [];
	      _handlers[key].push({ shortcut: keys[i], scope: scope, method: method, key: keys[i], mods: mods });
	    }
	  };

	  // unbind all handlers for given key in current scope
	  function unbindKey(key, scope) {
	    var multipleKeys, keys,
	      mods = [],
	      i, j, obj;

	    multipleKeys = getKeys(key);

	    for (j = 0; j < multipleKeys.length; j++) {
	      keys = multipleKeys[j].split('+');

	      if (keys.length > 1) {
	        mods = getMods(keys);
	        key = keys[keys.length - 1];
	      }

	      key = code(key);

	      if (scope === undefined) {
	        scope = getScope();
	      }
	      if (!_handlers[key]) {
	        return;
	      }
	      for (i = 0; i < _handlers[key].length; i++) {
	        obj = _handlers[key][i];
	        // only clear handlers if correct scope and mods match
	        if (obj.scope === scope && compareArray(obj.mods, mods)) {
	          _handlers[key][i] = {};
	        }
	      }
	    }
	  };

	  // Returns true if the key with code 'keyCode' is currently down
	  // Converts strings into key codes.
	  function isPressed(keyCode) {
	      if (typeof(keyCode)=='string') {
	        keyCode = code(keyCode);
	      }
	      return index(_downKeys, keyCode) != -1;
	  }

	  function getPressedKeyCodes() {
	      return _downKeys.slice(0);
	  }

	  function filter(event){
	    var tagName = (event.target || event.srcElement).tagName;
	    // ignore keypressed in any elements that support keyboard data input
	    return !(tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA');
	  }

	  // initialize key.<modifier> to false
	  for(k in _MODIFIERS) assignKey[k] = false;

	  // set current scope (default 'all')
	  function setScope(scope){ _scope = scope || 'all' };
	  function getScope(){ return _scope || 'all' };

	  // delete all handlers for a given scope
	  function deleteScope(scope){
	    var key, handlers, i;

	    for (key in _handlers) {
	      handlers = _handlers[key];
	      for (i = 0; i < handlers.length; ) {
	        if (handlers[i].scope === scope) handlers.splice(i, 1);
	        else i++;
	      }
	    }
	  };

	  // abstract key logic for assign and unassign
	  function getKeys(key) {
	    var keys;
	    key = key.replace(/\s/g, '');
	    keys = key.split(',');
	    if ((keys[keys.length - 1]) == '') {
	      keys[keys.length - 2] += ',';
	    }
	    return keys;
	  }

	  // abstract mods logic for assign and unassign
	  function getMods(key) {
	    var mods = key.slice(0, key.length - 1);
	    for (var mi = 0; mi < mods.length; mi++)
	    mods[mi] = _MODIFIERS[mods[mi]];
	    return mods;
	  }

	  // cross-browser events
	  function addEvent(object, event, method) {
	    if (object.addEventListener)
	      object.addEventListener(event, method, false);
	    else if(object.attachEvent)
	      object.attachEvent('on'+event, function(){ method(window.event) });
	  };

	  // set the handlers globally on document
	  addEvent(document, 'keydown', function(event) { dispatch(event) }); // Passing _scope to a callback to ensure it remains the same by execution. Fixes #48
	  addEvent(document, 'keyup', clearModifier);

	  // reset modifiers to false whenever the window is (re)focused.
	  addEvent(window, 'focus', resetModifiers);

	  // store previously defined key
	  var previousKey = global.key;

	  // restore previously defined key and return reference to our key object
	  function noConflict() {
	    var k = global.key;
	    global.key = previousKey;
	    return k;
	  }

	  // set window.key and window.key.set/get/deleteScope, and the default filter
	  global.key = assignKey;
	  global.key.setScope = setScope;
	  global.key.getScope = getScope;
	  global.key.deleteScope = deleteScope;
	  global.key.filter = filter;
	  global.key.isPressed = isPressed;
	  global.key.getPressedKeyCodes = getPressedKeyCodes;
	  global.key.noConflict = noConflict;
	  global.key.unbind = unbindKey;

	  if(true) module.exports = assignKey;

	})(this);


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(5);
	const Utility = __webpack_require__(4);

	function Bullet(pos, vel, game){
	  MovingObject.call(this,{
	    pos: pos,
	    vel: vel,
	    color: "red",
	    radius: 5,
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


/***/ }
/******/ ]);