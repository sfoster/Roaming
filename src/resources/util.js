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

  return {
    mixin: mixin,
    pluck: pluck,
    values: values, 
    keys: keys
  };
});