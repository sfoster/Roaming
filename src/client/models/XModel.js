define([
  'compose',
  'knockout',
  'lib/util',
  'lib/event'
], function(Compose, ko, util, Evented){

  ko.extenders.propertyName = function(target, name) {
      target.propertyName = name;
      return target;
  };

  var count = 0;
  var Model = Compose(function(args){
    if(!args) return this;
    args = Object.create(args);
    if(!('name' in args) && args.name) {
      args.name = args.id || args.type;
    }
    // give everything a unique identifier
    if(!('_id' in args) && args._id) {
      args._id = (args.id || args.type)+'_'+(count++);
    }
    // set up keys(), values()
    this._keys = {};
    this._isDirty = ko.observable(false);
    this.keys = ko.computed(function(){
      this._isDirty();
      return Object.keys(this._keys);
    }, this);
    this.values = ko.computed(function(){
      var self = this;
      this._isDirty();
      return this.keys().map(function(key){
        return self[key];
      });;
    }, this);
    console.log("Computed values: ", this.values, this.values().valueHasMutated);
    var key, type, value;
    for(key in args) {
      if('_' == key.charAt(0)) continue;
      value = args[key];
      type = util.getType(value);
      switch(type) {
        case "function":
          this[key] = value;
          break;
        default:
          this.initProperty(key, value, type);
      }
    }
  }, Evented, {
    declaredClass: "XModel",
    initProperty: function(key, value, type) {
      this._keys[key] = type;
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
      var self = this;
      this[key].subscribe && this[key].subscribe(function(newValue){
        // var idx = this._keys.indexOf(key);
        self._isDirty();
      });
      // self.values()[idx] = self[key];
      return propertyCreated;
    },
    update: function(name, value, options){
      this[name](value);
      return this;
    },
    remove: function(name, options){
      var returnValue = this[name].peek();
      delete this._keys[name];
      this[name] = null;
      delete this[name];
      // could do some teardown on orphaned child models
      this.keys.valueHasMutated();
      this.values.valueHasMutated();
      return returnValue;
    },
    initArrayProperty: function(key, value, type) {
      this[key] = ko.observableArray(value);
      return key;
    },
    initObjectProperty: function(key, value, type) {
      this[key] = ko.observable( new Model(value) );
      return key;
    }
  });

  return Model;
});
