define([
  'compose',
  'lib/util',
  'lib/switchboard'
], function(Compose, util, switchboard){

  var DEBUG = false;
  var debug = {
    log: function () {
      if (!DEBUG) return;
      var args = ['Actor'].concat(Array.slice(arguments));
      console.log.apply(console, args);
    }
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
  var Evented = {
    emit: function(topic, payload) {
      switchboard.emit(this._id + '.' + topic, payload);
    },
    on: function(topic, callback) {
      var topicFlags = this._topicFlags || (this._topicFlags = {});
      if ("*" === topic) {
        console.warn('catch-all listeners not implemented');
      }
      if (topic in topicFlags) {
        topicFlags[topic] += 1;
      } else {
        topicFlags[topic] = 1;
      }
      debug.log('on: add callback for topic ' + this._id + '.' + topic);
      return switchboard.on(this._id + '.' + topic, callback);
    },
    removeAllListeners: function(topic) {
      if((topic in this._topicFlags) && this._topicFlags[topic]) {
        this._topicFlags[topic]--;
      }
      return switchboard.removeAllListeners(this._id + '.' + topic);
    }
  };

  var EventedModel = Compose(function(){
    this._keyAliases = {};
    this._keys = {};
  },
  Evented, // Models implement Evented
  {
    declaredClass: "EventedModel",
    type: 'default',
    toJS: function() {
      var cleanThis = {};
      for(var p in this) {
        if(
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
    update: function(key, value, options){
      this.emit(key+':willchange', {
        value: this[key],
        name: key,
        type: 'update',
        newValue: value
      });
      var oldValue = this[key];
      var isModelChange = EventedModel.isInstanceOf(oldValue);
      // overwrite the alias we created for the old value.
      if (isModelChange) {
        debug.log('update: update '+ key + ' alias from: ', this._id + '.' + oldValue._id,
          'to: ', this._id + '.' + value._id);
        this.registerProperty(key, value);
      }
      this[key] = value;
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
            this.emit(topic, { value: value[subkey], name: subkey, oldValue: oldValue[subkey] });
          }
        }, this);
      }

      return this;
    },
    get: function(key, options){
      if (typeof this[key] == "function") {
        debug.log("EventedModel get:"+key +": type is " +typeof this[key]);
        return this[key]();
      } else {
        return this[key];
      }
    },
    remove: function(name, options){
      this.emit(name+':willchange', {
        value: this[name],
        newValue: undefined,
        name: name,
        type: 'remove'
      });
      var returnValue = this[name].peek();
      delete this._keys[name];
      // TODO: update and notify of keys and values array properties
      //this.keys.valueWillMutate();
      //this.values.valueWillMutate();
      this[name] = null;
      delete this[name];
      var alias = this._keyAliases[name];
      if (alias && typeof alias.remover == 'function') {
        alias.remover();
        delete this._keyAliases[name];
      }

      // could do some teardown on orphaned child models
      this.emit(name+':change', { name: name, type: 'remove' });
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
      debug.log('EventedModel _prepareCtorArgs');
      args = Object.create(args);
      var id = args.id || args._id;
      var modelType = args.type || this.type;

      if(!(('name' in args) && args.name)) {
        args.name = args.id || modelType;
      }
      if (!id) {
        if(!(modelType in typeCounts)) {
          typeCounts[modelType] = -1;
        }
        id = modelType + '_'  + (++typeCounts[modelType]);
      }
      args._id = id;
      return args;
    }
  }, Compose, function(args){
    if(!args) return this;
    args = util.flatten(this._prepareCtorArgs(args));
    debug.log('EventedModel ctor, got args: ', args);
    this._id = args._id;
    delete args._id;

    // set up .keys, .values
    this._isDirty = this.registerProperty('_isDirty', false, 'boolean');
    this.keys = this.registerProperty('keys', [], 'array');
    this.values = this.registerProperty('values', [], 'array');

    // init each property from the args object
    var key, type, value;
    function nextKey(obj) {
      for(var key in obj) {
        if(!key || '_' == key.charAt(0)) continue;
        return key;
      }
    }

    while((key = nextKey(args))) {
      value = args[key];
      args[key] = null; // some args might have prototypes
      delete args[key];
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
