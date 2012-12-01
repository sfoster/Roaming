// koHelpers.js
define(['knockout', 'lib/util'], function(ko, util){
  function makeObservable(obj) {
    var vm = {};
    for(var name in obj) {
      vm[name] = (obj[name] instanceof Array) ? ko.observableArray(obj[name]) : ko.observable(obj[name]);
    }
    return vm;
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

