// koHelpers.js
define(['knockout', 'lib/util'], function(ko, util){

  function updateArray(arr, newItems) {
    if(newItems) {
      arr.splice.apply(arr, [0, arr.length].concat(newItems));
    } else {
      arr.splice(0, arr.length);
    }
  }

  ko.observableArray.fn.transferItem = function(item, collection, toIndex) {
    var fromIdx = this.indexOf(item);
    if('string' == typeof collection) {
      collection = util.getObject(collection);
    }
    if(fromIdx < 0) {
      console.warn("koHelpers: moveItemTo: item not in this array");
      return;
    }
    this.splice(fromIdx, 1);
    toIndex = (undefined == toIndex || toIndex < 0) ? collection.length : toIndex;
    collection.splice(toIndex, 0, item);
  };

  function makeObservable(obj, options) {
    options = options || {};
    if(ko.isObservable( obj )){
      return obj;
    }
    var value = obj;
    var type = util.getType(value);

    var observable = {};
    depth = depth || 0;
    if('array' == type) {
      updateArray(value, value.map(function(item, i){
        return makeObservable(item, depth-1);
      }));
      // array() -> array of observable items
      // array()[0]() -> the original item. Bleagh
      return ko.observableArray(value);
    } else if(/^object/.test(type)) {
      // ko provides no equivalent to observableArray for objects - to watch property changes
      // so, optionally walk the tree but return the object itself as-is
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
  	resolveObservable: resolveObservable,
    updateArray: updateArray
  };
})

