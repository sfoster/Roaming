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
    console.log("Location enter stub");
  }
  Location.prototype.exit = function(player, game){
    console.log("Location exit stub");
  }
  return Location;
});