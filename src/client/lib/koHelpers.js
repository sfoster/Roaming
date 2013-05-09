// koHelpers.js
define(['knockout', 'vendor/knockout/knockout.postbox', 'lib/util'], function(ko, _postbox, util){
  window.postbox = _postbox;
  window.ko = ko;
  function updateArray(arr, newItems) {
    if(newItems) {
      arr.splice.apply(arr, [0, arr.length].concat(newItems));
    } else {
      arr.splice(0, arr.length);
    }
  }

  ko.observable.fn.propertyChange = function(key, newValue) {

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

  // maybe create a ViewModel class, where we clone the source object
  // and subscribe all the observables to publish changes using the object-path as topic

  function makeObservable(obj, depth) {
    // TODO: ensure objects are cloned and assigned to the parent clone,
    // not the original object
    if(ko.isObservable( obj )){
      return obj;
    }
    var sourceValue = obj;
    var observableValue;
    var type = util.getType(sourceValue);

    depth = depth || 0;
    if('array' == type) {
      observableValue = ko.observableArray(sourceValue.map(function(item, i){
        return makeObservable(item, depth-1);
      }));
      // array() -> array of observable items
      // array()[0]() -> the original item. Bleagh
      return observableValue;
    } else if(/^object/.test(type)) {
      // ko provides no equivalent to observableArray for objects - to watch property changes
      // so walk the tree
      observableValue = ko.observable({});
      Object.keys(sourceValue).forEach(function(key){
        if(/^_|observable/.test(key)) return;
        observableValue[key] = makeObservable(sourceValue[key], depth+1);
        observableValue[key].publishOn(key);
      });
      return observableValue;
    } else {
      return ko.observable(sourceValue);
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

