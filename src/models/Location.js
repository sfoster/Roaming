define(['$', 'lib/util', 'lib/event'], function($, util, Evented){
  var emit = Evented.emit.bind(this), // it matter what 'this' when we emit and listenr for events. Here, 'this' is the global context
      create = util.create;
  
  function Location(options){
    if(!options) return;
    for(var i in options){
      this[i] = options[i];
    }
    console.log("create location with data: ", options);
    var coords = this.coords;
    this.x = coords[0]; 
    this.y = coords[1];
    if(!this.id){
      this.id = coords.join(',');
    }
  }
  Location.prototype.get = function(name){
    return this[name];
  };
  Location.prototype.enter = function(player, game){
    var proceed = true;
    emit("onbeforelocationenter", {
      target: this,
      player: player,
      cancel: function(){ proceed = false; }
    });
    if(proceed){
      console.log("location enter: ", this, player, game, player.history);
      // what is in this tile? 
      // does anything happen as I enter?
      //  run any encounters
      
      // update the player's history with details of this visit
      // have I been here before?
      //  check player.history for this location id
      var locationHistory = player.history[this.id] || (player.history[this.id] = {}), 
          visits = locationHistory.visits || (locationHistory.visits = []);

      visits.push(+new Date);

      emit("onafterlocationenter", {
        target: this,
        player: player,
        cancel: function(){ proceed = false; }
      });
    }
    
  };
  Location.prototype.exit = function(player, game){
    console.log("Location exit stub");
  };

  return Location;
});
