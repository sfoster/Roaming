define([
  'compose',
  'knockout',
  'lib/util',
  'lib/event'
], function(Compose, ko, util, Evented){

/*
  the Model subscribe feature, should let me do:
  * instance.subscribe(fn); // notify of all changes
  * instance.subscribe(fn, null, 'foo'); // be notified of any changes to current or future 'foo' properties
  * instance.subscribe(fn, null, 'foo.bar'); // be notified of any changes to current or future 'bar' properties
                                   // on current or future 'foo' properties

  when bar is changed, foo gets 'bar' event
  instance watches all foo's events and republishes them to its own subscribers to foo.bar

  right now we have this wrapped subscribe which is trying to return a subscription to the sub-property down the chain indicated by the path
  but, we don't want direct subscription. We want to use the topicKeys and a single subscriber on the model (set up by initProperty already)
  which fires on any change and looks up any topic subscribers in its _topicListeners.
  So, instance.subscribe('foo.bar'), adds topicKey for foo.bar (?)
  When the foo child publishes an event that its bar property was modified, foo.bar subscribers on instance should be notified.
  This is NOT what I've implemented so far :)

*/




  ko.extenders.propertyName = function(target, name) {
      target.propertyName = name;
      return target;
  };

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
            return fToBind.apply(this instanceof fNOP && oThis
                                   ? this
                                   : oThis,
                                 aArgs.concat(Array.prototype.slice.call(arguments)));
          };

      fNOP.prototype = this.prototype;
      fBound.prototype = new fNOP();

      return fBound;
    };
  }

  var Subscribable = ko.subscribable;
  var typeCounts = {};

  function wrappedSubscribe(callback, target, topic) {
    // subscribe to model topics
    // i.e. at the model, get notifications of changes to subproperties
    // e.g.
    // model.subscribe(fn, null, 'foo.bar')
    // when bar on foo changes, notify subscribers of foo.bar
    // if foo changes notify deletion of bar?
    // if foo is updated or recreated, topic subscribers are intact

    // foo.bar.boom
    //  boom changes on bar.
    // bar publishes _barid:boom via global bus
    // foo is watching _barid's events

    console.log("#"+this._id+" WrappedSubscribable.prototype.subscribe ", topic);
    if(topic) {
      this._topicKeys[topic]
      Evented.on(this._id+":"+topic+"propertychange", callback);
    } else {
      console.log("ObservableModel#"+this._id + " subscribe to what??");
    }
  };

  var Model = Compose(function(){
    // first constructor/initializer
    this._subscriptions = {};
  },
  Evented, // Models implement Evented
  ko.subscribable['fn'], // mixin the subscribable prototype methods
  {
    declaredClass: "ObservableModel",
    type: 'default',
    toJS: function() {
      var cleanThis = {};
      for(var p in this) {
        if(
          "declaredClass" == p ||
          (p in ObservableModel.prototype) ||
          "_" == p[0]
        ) {
          continue;
        }
        cleanThis[p] = ('toJS' in this[p]) ? this[p].toJS() : this[p];
      }
      return ko.toJS(cleanThis);
    },
    _notifyTopicSubscribers: function(topic, valueToNotify) {
      var subscribers = this._topicListeners[topic];
      if (subscribers) {
        subscribers.forEach(function(subscription) {
          if (subscription && (subscription.isDisposed !== true)) {
            subscription.callback(valueToNotify); // also send event/topic?
          }
        });
      }
    },
    _watchProperty: function(key, initialValue, type) {
      this._keys[key] = type;
      var prop = this[key];
      // subscribe to changes to the property to broadcast to any observers at the model level
      // console.log('ObservableModel#'+this._id+ ' _watchProperty ', key);
      if('function' !== typeof prop.subscribe) {
        return;
      }
      prop.subscribe(function(newValue){
        this._isDirty();
        // some property has changed.
        // publish as event on the model
        console.log("ObservableModel#"+this._id+" _watchProperty subscribe callback, got new value: %s, key: %s", newValue, key);
        Evented.emit(this._id+':propertychange', { value: newValue, name: key });
      }, this);

      if(prop._id && prop.emit) {
        Evented.on(prop._id+':propertychange', function(event) {
          this.emit(this._id+'propertychange', { value: newValue, source: key+"."+event.source});
        }.bind(this));
      }
      // subscribe to our own property changes
      this.on(function(newValue, topic){
        console.log("ObservableModel#"+this._id+" got notification on topic: %s, value: %s", key, newValue, topic);

      }, this, key);

      /*
      foo: {
        stats: {
          age: 1
        }
      }
      global topic bus
      consumer subscribes to foo.stats.age
      age changes, stats subscribed to 'age' topic to reposts event as 'stats.age'
      foo subscribed to stats.age, invokes subscriber
      */
    },
    // when a property is created, hook a subscriber to it to notify topic subscribers
    initProperty: function(key, value, type) {
      var propertyCreated;
      // try initializer specific to this key
      var fnName = "init"+key.charAt(0).toUpperCase()+key.substring(1)+"Property";
      if(fnName in this) {
        propertyCreated = this[fnName](key, value, type);
      }
      if(!propertyCreated) {
        // try initializer specific to this type
        fnName = "init"+type.charAt(0).toUpperCase()+type.substring(1)+"Property";
        if(fnName in this) {
          propertyCreated = this[fnName](key, value, type);
        }
      }
      if(!propertyCreated) {
        // fallback to plain old observable
        this[key] = ko.observable(value).extend({propertyName: key})
        propertyCreated = key;
      }
      return propertyCreated;
    },
    update: function(name, value, options){
      this[name](value);
      return this;
    },
    get: function(name, options){
      if (typeof this[name] == "function") {
        return this[name]();
      } else {
        throw  new Error("ObservableModel get:"+name +": type is " +typeof this[name]);
      }
    },
    remove: function(name, options){
      var returnValue = this[name].peek();
      delete this._keys[name];
      this.keys.valueWillMutate();
      this.values.valueWillMutate();
      this[name] = null;
      delete this[name];
      // could do some teardown on orphaned child models
      this.keys.valueHasMutated();
      this.values.valueHasMutated();
      return returnValue;
    },
    subscribe: wrappedSubscribe,

    initArrayProperty: function(key, value, type) {
      this[key] = ko.observableArray(value);
      return key;
    },
    initObjectProperty: function(key, value, type) {
      value._id = this._id +':' + key;
      this[key] = ko.observable( new Model(value) );
      return key;
    },
    _setupPublisherSubscription: function() {
      this._topicListeners[key] = ko.subscribable['fn'].subscribe.apply(this, [

      ]);
    },
    // _removePublisherSubscription: function() {

    // }
  }, function(args){
    if(!args) return this;
    args = Object.create(args);
    if(!('name' in args) && args.name) {
      args.name = args.id || args.type;
    }
    var id = args.id || args._id;
    var modelType = args.type || this.type;
    if (!id) {
      if(!(modelType in typeCounts)) {
        typeCounts[modelType] = -1;
      }
      id = modelType + '_'  + (++typeCounts[modelType]);
    }
    this._id = id;

    // keep track of keys that form root of topics we want to notify on
    this._topicListeners = {};

    // set up keys(), values()
    this._keys = {};
    this._isDirty = ko.observable(false);
    this.keys = ko.computed(function(){
      this._isDirty();
      return Object.keys(this._keys);
    }, this);
    this.values = ko.computed(function(){
      this._isDirty();
      return this.keys().map(function(key){
        return this[key];
      }, this);
    }, this);

    // init each property from the args object
    var key, type, value;
    for(key in args) {
      if(!key || '_' == key.charAt(0)) continue;
      value = args[key];
      type = util.getType(value);
      switch(type) {
        case "function":
          console.info("Assigning function property: ", key, value);
          this[key] = value;
          break;
        default:
          this.initProperty(key, value, type);
      }
      this._watchProperty(key, value, type);
    }
  });

  // console.log("After Compose, Model.prototype.subscribe: ", Model.prototype.subscribe.toString());
  return Model;
});
