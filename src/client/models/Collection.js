define([
    'compose', 'models/EventedModel', 'lib/switchboard', 'lib/util'
], function(Compose, EventedModel, switchboard, util){

  var DEBUG = false;
  var debug = {
    log: DEBUG ? console.log.bind(console, 'Collection') : function() {}
  };

  var typeCounts = {};
  var Collection = Compose(EventedModel, {
    declaredClass: 'Collection',
    type: 'collection',
    toJS: function() {
      return this.values;
    },
    size: function() {
      return this.values.length;
    },
    //
    // inherits get, index is used as property name
    //
    indexOf: function(entry) {
      return this.values.indexOf(entry);
    },
    add: function(entry, quietly) {
      var nextIndex = this.values.length;
      return this.update(nextIndex, entry, quietly);
    },
    update: function(index, entry, quietly) {
      this.values.splice(index, 1, entry);
      return EventedModel.prototype.update.call(this, index, entry, quietly);
    },
    //
    // inherits update, index is used as property name
    //
    remove: function(index, quietly) {
      this.values.splice(index, 1);
      var ret = EventedModel.prototype.remove.call(this, index, quietly);
      var len = this.size();
      // re-map entries after this one
      for (var key = index+1; key < len; key++) {
        this._keys[key -1] = this._keys[key];
        delete this._keys[key];
      }
      return ret;
    },
    removeAll: function(quietly) {
      var shouldEmit = !(this._inBatchUpdate || quietly);
      var shouldUpdateObserveds = !this._inBatchUpdate;

      var len = this.size();
      this.values.length = 0;
      for(var key = 0; key < len; key++) {
        delete this._keys[key];
      }
      shouldUpdateObserveds && this._updateObservedProperties();
      shouldEmit && this.emit('change', {
        action: 'removeall',
        value: null
      });
    },
    forEach: function(fn, thisObj) {
      return this.values.forEach(fn, thisObj || this);
    },
    map: function(fn, thisObj) {
      return this.values.map(fn, thisObj || this);
    },
    filter: function(fn, thisObj) {
      return this.values.filter(fn, thisObj || this);
    },
    _prepareCtorArgs: function(args) {
      args = args || [];
      // pull out the array entries and pass along a property bag
      // to our parent class' _prepareCtorArgs method
      var entries = (args.length && args[0]) ? args.shift() : [];
      this.values = entries;
      var properties = args[0] || (args[0] = {});
      // copy over array entries as named properties
      for(var key = 0; key < entries.length; key++) {
        properties[key] = entries[key];
      }
      return EventedModel.prototype._prepareCtorArgs.call(this, args);
    },
    _updateObservedProperties: function() {
      var keys = this.keys = [];
      for(var i=0; i<this.values.length; i++) {
        keys.push(i);
      }
    }
  });

  Collection.isInstanceOf = function(thing) {
    if(thing && typeof thing == 'object' && thing instanceof Collection) {
      return true;
    } else {
      return false;
    }
  }

  return Collection;
});
