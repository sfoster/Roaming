define(['compose', 'lib/util', 'lib/event'], function(Compose, util, Evented){
  var emit = Evented.emit.bind(this), // it matter what 'this' when we emit and listenr for events. Here, 'this' is the global context
      create = util.create;

  var proto = {
    seen: false
  };

  console.log("Loading models/Item");

  var mixin = util.mixin;
  var Item = Compose(function(args){
    mixin(this, args || {});
    console.log("Item constructor: ", this);
  }, Evented, {
    describe: function(context){
      context = context || {};
      var item = this;
      var player = context.player;
      // is this the first/initial sight of this item?
      // do we own this item?
      // are we up close or far away?
      // descriptions might be templated with some seen/unseen etc. logic
      // so we prepare/pass in the context
      var description = item.seen ? item.description : (item.initialDescription || item.initialDescription);
      if(player) {
        // just don't populate the context with a player object if you want to, say, batch up descriptions
        item.seen = true;
      }
      return description;
    },
    examine: function(context){
      return this.detailedDescription || this.description;
    },
    take: function(context){
      var item = this;
      if(item.fixed){
        // no go, raise an event to trigger maybe a sound, or a message
      } else {
        var proceed = true;
        // maybe fire a onbeforetake event, which can block the action if evt.cancel() is called
        emit("beforetake", {
          target: item,
          cancel: function(){
            proceed = false;
          }
        });
        if(proceed) {
        // fire a onaftertake event, which maybe adds the thing to your inventory, increments weight, confirms the action
        emit("aftertake", {
          target: item,
          cancel: function(){
            proceed = false;
          }
        });
        }
      }
      return proceed && !item.fixed;
    },
    transferTo: function(collection) {
      var current = this.inCollection;
      console.log("transferTo for item:"+this.name, current);
      if(current) {
        if(current.remove) {
          current.remove(this);
        } else {
          var idx = current.indexOf(this);
          console.log("index of item in current collection: ", idx);
          if(idx > -1) {

          }
          current.splice(current.indexOf(this), 1);
        }
      }
      if(collection.add) {
        collection.add(this);
      } else {
        collection.push(this);
      }
      this.inCollection = collection;
    }
  });

  Item.extend = util.extend;

  // statics
  util.mixin(Item, {
    create: function(data){
      if("string" == typeof data){
        data = JSON.parse(data);
      }
      var item = create(proto, data);
      return item;
    },
  });
  return Item;
});