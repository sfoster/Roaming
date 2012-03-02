define(['$'], function(){
  // TODO: lots
  
  function Location(data){
    for(var i in data){
      this[i] = data[i];
    }
  };
  Location.prototype.get = function(name){
    return this[name];
  }
  Location.prototype.enter = function(player, game){
    console.log("location enter: ", this);
    $("#main").append("<p>"+ this.description +" at: " + this.coords + "</p>");
  }
  Location.prototype.exit = function(player, game){
    console.log("Location exit stub");
  }
  return Location;
});