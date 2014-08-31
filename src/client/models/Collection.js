define([
    'compose', 'lib/switchboard', 'lib/util'
], function(Compose, switchboard, util){

  var DEBUG = false;
  var debug = {
    log: DEBUG ? console.log.bind(console, 'Collection') : function() {}
  };

  var typeCounts = {};
  var Collection = Compose(function(entries, options){
    this._array = entries ? Array.slice(entries, 0) : [];
    if (options) {
      util.mixin(options);
    }
  },
  switchboard.Evented, // Models implement Evented
  {
    declaredClass: 'Collection',
    type: 'collection',
    toJS: function() {
      return this._array;
    },
    size: function() {
      return this._array.length;
    },
    get: function(index) {
      return this._array[index];
    },
    indexOf: function(entry) {
      return this._array.indexOf(entry);
    },
    add: function(entry) {
      var ret = this._array.push(entry);
      var lastIndex = this._array.length - 1;
      this.emit('change', {
        value: entry,
        index: lastIndex,
        action: 'add'
      });
      return ret;
    },
    update: function(index, entry) {
      var oldValue = this._array[index];
      this._array.splice(index, 1, entry);
      this.emit('change', {
        value: entry,
        oldValue: oldValue,
        index: index,
        action: 'update'
      });
    },
    remove: function(index) {
      var ret = this._array.splice(index, 1)[0];
      this.emit('change', {
        action: 'remove',
        value: ret,
        index: index
      });
      return ret;
    },
    removeAll: function() {
      this._array.length = 0;
      this.emit('change', {
        action: 'removeall',
        value: null
      });
    },
    forEach: function(fn, thisObj) {
      return this._array.forEach(fn, thisObj || this);
    },
    map: function(fn, thisObj) {
      return this._array.map(fn, thisObj || this);
    },
    filter: function(fn, thisObj) {
      return this._array.filter(fn, thisObj || this);
    }
  });

  return Collection;
});
