// koHelpers.js
define(['knockout', 'lib/util'], function(ko, util){
  function makeObservable(obj, depth) {
    if(ko.isObservable( obj )){
      return obj;
    }
    var value = obj;
    var type = util.getType(value);

    var observable = {};
    depth = depth || 0;
    if('array' == type) {
      if(depth) {
        value = value.map(function(item, i){
          return makeObservable(item, depth-1);
        });
      }
      return ko.observableArray(value);
    } else if(/^object/.test(type)) {
      // ko provides no equivalent to observableArray for objects - to watch property changes
      // so, optinally walk the tree but return the object itself as-is
      if(depth) {
        Object.keys(value).forEach(function(key){
          value[key] = makeObservable(value[key], depth-1);
        })
      }
      return value;
    } else {
      return ko.observable(value);
    }
  }

  function resolveObservable(obj) {
    var value = ko.isObservable( obj ) ? obj() : obj;
    var type = util.getType(value);
    console.log("resolveObservable: ", type, obj);
    switch(type) {
      case 'object': 
        var cleanObj = {};
        for(var key in value) {
          if('_' !== key.charAt(0)) {
            cleanObj[key] = resolveObservable(value[key]);
          }
        }
        return cleanObj;
      case 'array': 
        return util.map(value, function(val, key, obj){
          return resolveObservable(val);
        });
      default: 
        return value;
    }
  }

  return {
  	makeObservable: makeObservable, 
  	resolveObservable: resolveObservable
  };
})

