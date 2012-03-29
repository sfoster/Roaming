define(['lib/util', 'lib/event'], function(util, Evented){
  var emit = Evented.emit.bind(this), // it matter what 'this' when we emit and listenr for events. Here, 'this' is the global context
      create = util.create;
      
  var proto = {
    seen: false
  };
  
  var exports = {
    create: function(data){
      if("string" == typeof data){
        data = JSON.parse(data);
      }
      var item = create(proto, data);
      return item;
    },
    describe: function(item, context){
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
    examine: function(item, context){
      return item.detailedDescription || item.description;
    },
    take: function(item, context){
      if(item.fixed){
        // no go, raise an event to trigger maybe a sound, or a message
      } else {
        var proceed = true; 
        // maybe fire a onbeforetake event, which can block the action if evt.cancel() is called
        emit("onbeforetake", {
          target: item,
          cancel: function(){
            proceed = false;
          }
        });
        // fire a onaftertake event, which maybe adds the thing to your inventory, increments weight, confirms the action
        emit("onbeforetake", {
          target: item,
          cancel: function(){
            proceed = false;
          }
        });
      }
      return !item.fixed;
    }
  };
  return exports;
});