define(['lib/event'], function(Evented){
  var exports = {};
  
  exports.take = function(thing, player){
    if(!thing.fixed) {
      var proceed = true;
      emit("beforetake", {
        target: thing,
        player: player,
        cancel: function(){ proceed = false; }
      });
      if(proceed){
        player.inventory.add(thing);
      }
      emit("aftertake", {
        target: thing,
        player: player
      });
      
    }
  }
});