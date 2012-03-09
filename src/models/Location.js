define(['$'], function(){
  // A basic tile in our map
  
  function Location(options){
    for(var i in options){
      this[i] = options[i];
    }
    console.log("create location with data: ", options);
    if(!this.id && this.data){
      this.id = this.data.coords.join(',');
    }
  }
  Location.prototype.get = function(name){
    return this[name];
  };
  Location.prototype.enter = function(player, game){
    console.log("location enter: ", this, player, game);
    $("#main").append("<p>"+ this.description +" at: " + this.coords + "</p>");
    if(player && player.history){
      var hist = player.history[this.id] || { visits: 0 }; 
      if(hist && hist.visits){
        console.log("history for location: ", hist);
        $("#main").append("<p>It looks familiar, you think you've been here before.</p>");
      }
      hist.visits++;
      player.history[this.id] = hist;
    }
    // what is in this tile? 
    // does anything happen as I enter?
    //  run any encounters
    // have I been here before?
    //  check player.history for this location id
  };
  Location.prototype.exit = function(player, game){
    console.log("Location exit stub");
  };
  return Location;
});