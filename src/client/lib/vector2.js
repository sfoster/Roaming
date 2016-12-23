// vector2.js
//   https://github.com/sebleedelisle/JavaScript-PixelPounding-demos/blob/master/libs/Vector2.js

define([], function(){
  var exports;
  var pool = [];
  var _primingPool = true;

  var Vector2 = function (x,y) {
    this.x= x || 0;
    this.y = y || 0;
  };
  Vector2.create = function(x=0, y=0) {
    var v = pool.pop();
    if (v) {
      v.x = x;
      v.y = y;
    } else {
      if (!_primingPool) {
        console.log('pool empty, creating new Vector2');
      }
      v = new Vector2(x, y);
    }
    return v;
  }

  var proto = Vector2.prototype = {
    reset: function ( x, y ) {
      this.x = x;
      this.y = y;
      return this;
    },
    release: function() {
      this.reset(0,0);
      pool.push(this);
  	},

    toString : function (decPlaces) {
      decPlaces = decPlaces || 3;
      var scalar = Math.pow(10,decPlaces);
      return "[" + Math.round (this.x * scalar) / scalar + ", " + Math.round (this.y * scalar) / scalar + "]";
  	},

    clone : function () {
      return Vector2.create(this.x, this.y);
  	},

    copyTo : function (v) {
      v.x = this.x;
      v.y = this.y;
  	},

    copyFrom : function (v) {
      this.x = v.x;
      this.y = v.y;
  	},

    magnitude : function () {
      return Math.sqrt((this.x*this.x)+(this.y*this.y));
  	},

    magnitudeSquared : function () {
      return (this.x*this.x)+(this.y*this.y);
  	},

    normalise : function () {
  		var m = this.magnitude();

      this.x = this.x/m;
  		this.y = this.y/m;

      return this;
  	},

    reverse : function () {
      this.x = -this.x;
  		this.y = -this.y;

      return this;
  	},

    plusEq : function (v) {
      this.x+=v.x;
  		this.y+=v.y;

      return this;
  	},

    plusNew : function (v) {
       return Vector2.create(this.x+v.x, this.y+v.y);
  	},

    minusEq : function (v) {
      this.x-=v.x;
  		this.y-=v.y;

      return this;
  	},

    minusNew : function (v) {
       return Vector2.create(this.x-v.x, this.y-v.y);
  	},

    multiplyEq : function (scalar) {
      this.x*=scalar;
  		this.y*=scalar;

      return this;
  	},

    multiplyNew : function (scalar) {
      var returnvec = this.clone();
      return returnvec.multiplyEq(scalar);
  	},

    divideEq : function (scalar) {
      this.x/=scalar;
      this.y/=scalar;
      return this;
  	},

    divideNew : function (scalar) {
      var returnvec = this.clone();
      return returnvec.divideEq(scalar);
  	},

    dot : function (v) {
      return (this.x * v.x) + (this.y * v.y) ;
  	},

  	angle : function (useRadians) {

  		return Math.atan2(this.y,this.x) * (useRadians ? 1 : module.TO_DEGREES);

  	},

  	rotate : function (angle, useRadians) {

      var cosRY = Math.cos(angle * (useRadians ? 1 : module.TO_RADIANS));
  		var sinRY = Math.sin(angle * (useRadians ? 1 : module.TO_RADIANS));

  		module.temp.copyFrom(this);

      this.x= (module.temp.x*cosRY)-(module.temp.y*sinRY);
  		this.y= (module.temp.x*sinRY)+(module.temp.y*cosRY);

      return this;
  	},

    equals : function (v) {
      return((this.x==v.x)&&(this.y==v.x));
  	},

    isCloseTo : function (v, tolerance) {
  		if(this.equals(v)) return true;

      module.temp.copyFrom(this);
  		module.temp.minusEq(v);

      return(module.temp.magnitudeSquared() < tolerance*tolerance);
  	},

    rotateAroundPoint : function (point, angle, useRadians) {
      module.temp.copyFrom(this);
      //trace("rotate around point "+t+" "+point+" " +angle);
      module.temp.minusEq(point);
      //trace("after subtract "+t);
      module.temp.rotate(angle, useRadians);
      //trace("after rotate "+t);
      module.temp.plusEq(point);
      //trace("after add "+t);
  		this.copyFrom(module.temp);

  	},

    isMagLessThan : function (distance) {
      return(this.magnitudeSquared()<distance*distance);
  	},

    isMagGreaterThan : function (distance) {
      return(this.magnitudeSquared()>distance*distance);
  	}

  };

  // populate the pool with vectors
  for(var i=0; i<100; i++) {
    pool.push(new Vector2(0,0));
  }
  _primingPool = false;

  var module = {
    TO_DEGREES : 180 / Math.PI,
    TO_RADIANS : Math.PI / 180,
    temp : new Vector2(),
    Vector2: Vector2,
    Vector: Vector2, // alias as we've no 3d plans
  };

  // Install statics for each of the vector methods, to be called like:
  //  vector.plusEq({ x: 0, y: 0 }, 5, 12)
  Object.keys(proto).forEach(function(p){
    if(proto.hasOwnProperty(p) && 'function' == typeof proto[p]) {
      module[p] = function(pt){
        var args = Array.prototype.slice.call(arguments, 1);
        module.temp.x = pt.x;
        module.temp.y = pt.y;
        var ret = proto[p].apply(module.temp, args);
        if(ret && ret instanceof Vector2) {
          pt.x = ret.x;
          pt.y = ret.y;
          return pt;
        } else {
          return ret;
        }
      };
    }
  });

  return module;
});
