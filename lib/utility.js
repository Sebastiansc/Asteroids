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
