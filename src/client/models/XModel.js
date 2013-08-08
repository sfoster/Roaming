define([
  'compose', 'lib/util', 'lib/event'
], function(Compose, util, Evented){

  ko.extenders.propertyName = function(target, name) {
      target.propertyName = name;
      return target;
  };

  var count = 0;
  var Model = Compose(function(args){
    if(!args.name) {
      args.name = args.id || args.type;
    }
    // give everything a unique identifier
    if(!args._id) {
      args._id = (args.id || args.type)+'_'+(count++);
    }
    // set up keys(), values()
    this._keys = [];
    this.keys = ko.observableArray(this._keys);
    this.values = ko.computed(function(){
      var self = this;
      return Object.keys(this._keys).map(function(key){
        return self[key];
      });
    }, this);

    var key, type, value;
    for(key in args) {
      if('_' == key.charAt(0)) continue;
      value = args[key];
      type = util.getType(value);
      switch(type) {
        case "function":
          break;
        default "object":
          this.initProperty(key, value, type);
      }
    }
  }, Evented, {
    declaredClass: "XModel",
    initProperty: function(key, value, type) {
      var fnName = "init"+key.charAt(0).toUpperCase()+key.substring(1)+"Property";
      this._keys[key] = type;
      if(fnName in this) {
        this[fnName].call(this, key, value, type);
      } else {
        this[key] = ko.observable(value).extend({propertyName: key})
      }
      var self = this;
      this[key].subscribe && this[key].subscribe(function(newValue){
        self.values.valueHasMutated();
      });
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
      this.keys.valueHasMutated();
      this.values.valueHasMutated();
      return returnValue;
    }
  });

  return Model;
});
