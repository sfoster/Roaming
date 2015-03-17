define(function(){

  var hasOwn = Object.prototype.hasOwnProperty;

  function getObject(key, obj) {
    obj = obj || window;
    if(key.indexOf('.') > -1) {
      var firstPart = key.substring(0, key.indexOf('.'));
      key = key.substring(1+key.indexOf('.'));
      return firstPart in obj ? getObject(key, obj[firstPart]) : undefined;
    } else {
      return obj[key];
    }
  }
  function setValue(key, value, obj) {
    // set a value where the key might be a dot-path
    // e.g. setValue('foo.bar', "Bar", obj) === obj.foo.bar = "Bar";
    if(key.indexOf('.') > -1) {
      var firstPart = key.substring(0, key.indexOf('.'));
      key = key.substring(1+key.indexOf('.'));
      if(!(firstPart in obj)) {
        throw new Error("setValue: couldn't resolve: "+key+" to a defined value");
      }
      return getObject(key, obj[firstPart]);
    } else {
      return obj[key] = value;
    }
  }

  function isPlainObject(obj){
    if ( !obj || typeof obj !== "object" || obj.nodeType || isWindow( obj ) ) {
      return false;
    }
    try {
      // Not own constructor property must be Object
      if ( obj.constructor &&
        !hasOwn.call(obj, "constructor") &&
        !hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
        return false;
      }
    } catch ( e ) {
      // IE8,9 Will throw exceptions on certain host objects #9897
      return false;
    }

    // Own properties are enumerated firstly, so to speed up,
    // if last one is own, then all properties are own.
    var key;
    for ( key in obj ) {}

    return key === undefined || hasOwn.call( obj, key );
  }
  function isWindow(obj){
    return obj &&
      (typeof obj === "object") &&
      ("setInterval" in obj) &&
      ("navigator" in obj);
  }

  function getType(thing) {
    var t = typeof thing;
    if('undefined' == t) return 'undefined';
    if(null === thing) return 'null';
    if('object' === t) {
      if(typeof thing.then == 'function') return 'thenable';
      if(thing instanceof Array) return 'array';
      if( isWindow(thing) ) return 'window';
      if(thing instanceof Date) return 'date';
      if(thing instanceof RegExp) return 'regexp';
      if(thing.nodeType) return 'domnode';
      if(thing instanceof Error || (('message' in thing) && (('lineno' in thing) || ('lineNumber' in thing)))){
        return 'error';
      }
      return isPlainObject(thing) ? 'object' : 'objectish';
    } else {
      return t;
    }
  }

  function pluck(ar, pname) {
    return ar.map(function(item){
      return item[pname];
    });
  }
  function values(obj){
    return Object.keys(obj).map(function(name){
      return obj[name];
    });
  }
  function keys(obj){
    return Object.keys(obj);
  }

  function mixin(obj){
    var args = Array.prototype.slice.call(arguments, 1),
        empty = {};
    args.forEach(function(source){
      for(var p in source) {
        if(p in empty) continue;
        obj[p] = source[p];
      }
    });
    return obj;
  }

  function flatten(source) {
    var target = {};
    for(var i in source) {
      target[i] = getType(source[i]).indexOf('object') === 0 ?
        flatten(source[i]) : source[i];
    }
    return target;
  }

  function create(obj){
    var clone, empty = {};
    if(obj instanceof Array){
      clone = obj.map(function(m){
        return typeof m =="object" ? create(m) : m;
      });
    } else if(typeof obj == "object"){
      clone = Object.create(obj);
      for(var p in obj) {
        if(p in empty || undefined === p) continue;
        if('object' == typeof obj[p]) {
          // recursive treatment of objects
          clone[p] = create(obj[p]);
        }
      }
    } else {
      clone = obj;
    }
    Array.prototype.slice.call(arguments, 1).forEach(function(arg){
      mixin(clone, arg);
    });
    return clone;
  }

  function map(obj, fn){
    var result = {};
    if(obj instanceof Array){
      result = obj.map(fn);
    } else {
      Object.keys(obj).forEach(function(key){
        result[key] = fn(obj[key], key, obj);
      });
    }
    return result;
  }

  // Shared empty constructor function to aid in prototype-chain creation.
  var ctor = function(){};

  // OO helpers borrowed from Backbone
  var inherits = function(parent, protoProps, staticProps) {
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call `super()`.
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Inherit class (static) properties from parent.
    mixin(child, parent);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) mixin(child.prototype, protoProps);

    // Add static properties to the constructor function, if supplied.
    if (staticProps) mixin(child, staticProps);

    // Correctly set child's `prototype.constructor`.
    child.prototype.constructor = child;

    // Set a convenience property in case the parent's prototype is needed later.
    child.__super__ = parent.prototype;

    return child;
  };

  var extend = function (protoProps, classProps) {
    var child = inherits(this, protoProps, classProps);
    child.extend = this.extend;
    return child;
  };

  var clamp = function(lbound, ubound, value){
    return value < lbound ? lbound : (value > ubound ? ubound : value);
  };

  var typeCounts = {};

  return {
    hasProperty: function(obj, key) {
      return !(undefined === getObject(key, obj));
    },
    // prolly belongs in some object/model helper lib or superclass
    prepareModel: function(model, args) {
      mixin(model, args || {});
      // give everything a name
      if(!model.name) {
        model.name = model.id || model.type;
      }
      // give everything a unique identifier
      if(!model._id) {
        if(!(model.type in typeCounts)) {
          typeCounts[model.type] = -1;
        }
        typeCounts[model.type]++;
        model._id = (model.id || model.type)+'_'+typeCounts[model.type];
      }
      return model;
    },
    getObject: getObject,
    setValue: setValue,
    getType: getType,
    create: create,
    map: map,
    mixin: mixin,
    pluck: pluck,
    values: values,
    keys: keys,
    flatten: flatten,
    extend: extend,
    inherits: inherits,
    clamp: clamp
  };
});