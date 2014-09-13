define([
  'compose',
  'lib/util',
  'lib/switchboard'
], function(Compose, util, switchboard){

  var DEBUG = false;
  var debug = {
    log: DEBUG ? console.log.bind(console, 'EventedModel') : function() {}
  };
/*
  the Model on feature, should let me do:
  * instance.on(fn); // notify of all changes
  * instance.on('foo', fn); // be notified of any changes to current or future 'foo' properties
  * instance.on('foo.bar', fn); // be notified of any changes to current or future 'bar' properties
                                   // on current or future 'foo' properties

  foo is a further EventedModel instance, and announces changes to its bar property to listeners

*/


  if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
      if (typeof this !== "function") {
        // closest thing possible to the ECMAScript 5 internal IsCallable function
        throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
      }

      var aArgs = Array.prototype.slice.call(arguments, 1),
          fToBind = this,
          fNOP = function () {},
          fBound = function () {
            return fToBind.apply(this instanceof fNOP && oThis ? this: oThis,
                                 aArgs.concat(Array.prototype.slice.call(arguments)));
          };

      fNOP.prototype = this.prototype;
      fBound.prototype = new fNOP();

      return fBound;
    };
  }

  var typeCounts = {};
  var EventedModel = Compose(function(){
    this._keyAliases = {};
    this._keys = {};
    this._topicFlags = {};
  },
  switchboard.Evented, // Models implement Evented
  {
    declaredClass: "EventedModel",
    type: 'default',
    toJS: function() {
      var cleanThis = {};
      for(var p in this) {
        if (
          "declaredClass" == p ||
          (p in EventedModel.prototype) ||
          "_" == p[0]
        ) {
          continue;
        }
        if (typeof this[p] == 'object' && ('toJS' in this[p])) {
          cleanThis[p] = this[p].toJS();
        } else {
          cleanThis[p] = this[p];
        }
      }
      return cleanThis;
    },
    registerProperty: function(key, initialValue, type) {
      key = ''+key;
      this._keys[key] = type;

      // if the property is a sub-model
      // subscribers to modelId.foo should get notified by submodelId changes
      if(initialValue._id && initialValue.emit) {
        this._keyAliases[key] = switchboard.alias(this._id + '.' + key, initialValue._id);
        // FIXME: watch for remove events to update the switchboard?
      }
      return initialValue;
    },
    // when a property is created, hook a subscriber to it to notify topic subscribers
    initProperty: function(key, value, type) {
      var propertyCreated, fnName
      // console.log('initProperty ' + key + ' of type: ' + type);
      // try initializer specific to this key
      key = ''+key;
      fnName = "init"+key.charAt(0).toUpperCase()+key.substring(1)+"Property";
      if(fnName in this) {
        propertyCreated = this[fnName](key, value, type);
      }
      if(!propertyCreated) {
        // TODO: try initializer specific to this type
        fnName = "init"+type.charAt(0).toUpperCase()+type.substring(1)+"Property";
        if(fnName in this) {
          propertyCreated = this[fnName](key, value, type);
        }
      }
      if(!propertyCreated) {
        // fallback to plain old watched property
        this[key] = value;
        propertyCreated = key;
      }
      this.registerProperty(key, this[key], type);
      return propertyCreated;
    },
    add: function() {
      return this.update.apply(this, arguments);
    },
    update: function(key, value, quietly){
      key = ''+key;
      var isModelChange, oldValue;
      var shouldEmit = !(this._inBatchUpdate || quietly);
      if (!this.hasOwnProperty(key)) {
        this.initProperty(key, value, util.getType(value));
      } else {
        oldValue = this[key];
        isModelChange = EventedModel.isInstanceOf(oldValue);

        // overwrite the alias we created for the old value.
        if (isModelChange) {
          debug.log('update: update '+ key + ' alias from: ', this._id + '.' + oldValue._id,
            'to: ', this._id + '.' + value._id);
          this.registerProperty(key, value);
        }
        this[key] = value;
      }

      if (!this._inBatchUpdate) {
        this._updateObservedProperties();
      }
      debug.log('publishing event: ', this._id+'.'+key+':change');
      this.emit(key+':change', { value: this[key], name: key });
      if (isModelChange) {
        // notify of changes to child properties
        // optimized by only firing for events listeners have registered for
        debug.log('walking old model: ', oldValue);
        var subkeys = Object.keys(oldValue._keys);
        subkeys.length && subkeys.forEach(function(subkey) {
          var topic = key + '.' + subkey  + ':change';
          if (topic in this._topicFlags) {
            shouldEmit && this.emit(topic, { value: value[subkey], name: subkey, oldValue: oldValue[subkey] });
          }
        }, this);
      }
      return this;
    },
    get: function(key){
      key = ''+key;
      if (typeof this[key] == "function") {
        debug.log("EventedModel get:"+key +": type is " +typeof this[key]);
        return this[key]();
      } else {
        return this[key];
      }
    },
    remove: function(key, quietly){
      var shouldEmit = !(this._inBatchUpdate || quietly);
      var returnValue = this[key];
      delete this._keys[key];
      // TODO: update and notify of keys and values array properties
      //this.keys.valueWillMutate();
      //this.values.valueWillMutate();
      this[key] = null;
      delete this[key];
      var alias = this._keyAliases[key];
      if (alias && typeof alias.remover == 'function') {
        alias.remover();
        delete this._keyAliases[key];
      }

      if (!this._inBatchUpdate) {
        this._updateObservedProperties();
      }
      // could do some teardown on orphaned child models
      shouldEmit && this.emit(key+':change', { name: key, type: 'remove' });
      return returnValue;
    },
    // subscribe: wrappedSubscribe,

    initArrayProperty: function(key, value, type) {
      this[key] = this.registerProperty(key, value, type || 'array');
      return this[key];
    },
    initObjectProperty: function(key, value, type) {
      this[key] = this.registerProperty(key,
                  new EventedModel(value), type || 'object');
      return this[key];
    },
    _prepareCtorArgs: function(args) {
      var config = args.length ? Object.create(args.shift()) : {};
      var id = config.id || config._id;
      var modelType = config.type || this.type;

      if(!(('name' in config) && config.name)) {
        config.name = config.id || modelType;
      }
      if (!id) {
        if(!(modelType in typeCounts)) {
          typeCounts[modelType] = -1;
        }
        id = modelType + '_'  + (++typeCounts[modelType]);
      }
      config._id = id;
      return config;
    },
    _init: function(props) {
      // set up .keys, .values
      this._inBatchUpdate = true;
      this._isDirty = false;
      if (!('keys' in this._keys)) {
        this.keys = this.registerProperty('keys', this.keys || [], 'array');
      }
      if (!('values' in this._keys)) {
        this.values = this.registerProperty('values', this.values || [], 'array');
      }

      // init each property from the props object
      var key, type, value;
      function nextKey(obj) {
        for(var key in obj) {
          key = ''+key;
          if(!key || '_' == key.charAt(0)) continue;
          return key;
        }
      }

      while((key = nextKey(props))) {
        value = props[key];
        props[key] = null; // some props might have prototypes
        delete props[key];
        type = util.getType(value);
        switch(type) {
          case "function":
            debug.log("Assigning function property: ", key, value);
            this[key] = value;
            break;
          default:
            this.initProperty(key, value, type);
        }
      }
      this._inBatchUpdate = false;
      this._updateObservedProperties();
    },
    _updateObservedProperties: function() {
      this.keys = Object.keys(this._keys); // use getter?
      this.keys.sort();
      this.values = this.keys.map(function(key) {
        return this[key];
      }, this)
    },
  }, function(){
    var props = arguments.length ?
                util.flatten(this._prepareCtorArgs(Array.slice(arguments, 0))) :
                this._prepareCtorArgs([]);
    this._id = props._id;
    delete props._id;

    this._init(props);
  });
  EventedModel.isInstanceOf = function(thing) {
    if(thing && typeof thing == 'object' && thing instanceof EventedModel) {
      return true;
    } else {
      return false;
    }
  }

  // debug.log("After Compose, EventedModel.prototype.subscribe: ", EventedModel.prototype.subscribe.toString());
  return EventedModel;
});
