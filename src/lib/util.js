define(function(){

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

  function create(obj){
    var clone;
    if(obj instanceof Array){
      clone = obj.map(function(m){
        return typeof m =="object" ? create(m) : m;
      });
    } else if(typeof obj == "object"){
      clone = Object.create(obj);
      for(var p in obj) {
        if('object' == typeof obj[p]) {
          // recursive treatment of objects
          clone[p] = create(obj[p]);
        }
      }
    } else {
      clone = obj;
    }
    Array.prototype.slice.apply(arguments, 1).forEach(function(arg){
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
  
  return {
    create: create,
    map: map,
    mixin: mixin,
    pluck: pluck,
    values: values, 
    keys: keys
  };
});