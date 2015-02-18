define(['lib/switchboard'], function(switchboard){
  var exports = {};

  exports.take = function(thing, actor){
    if(!thing.fixed) {
      var proceed = true;
      switchboard.emit("actor:beforetake", {
        target: thing, // what got took?
        actor: actor, // who took it?
        cancel: function(){ proceed = false; }
      });
      if(proceed){
        actor.inventory.add(thing);
      }
      switchboard.emit("actor:aftertake", {
        actor: actor,
        target: thing
      });

    }
  }
});