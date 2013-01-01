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
      if(depth >= 0) {
        value = value.map(function(item, i){
          return makeObservable(item, depth-1);
        });
      }
      return ko.observableArray(value);
    } else if(/^object/.test(type)) {
      // ko provides no equivalent to observableArray for objects - to watch property changes
      // so, optinally walk the tree but return the object itself as-is
      if(depth >= 0) {
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
    return ko.toJS(obj);
  }

  return {
  	makeObservable: makeObservable, 
  	resolveObservable: resolveObservable
  };
})

