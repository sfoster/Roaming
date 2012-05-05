define(['$', 'json!/location/world.json'], function($, worldData){

  var tilesByCoords = {};
  
  function indexMap(){
    worldData.tiles.forEach(function(tile){
      var id = tile.x+','+tile.y;
      tilesByCoords[id] = tile;
    });
  }
  
  console.log("worldData", worldData);
  
  function enter(player, game){
    $('#main').html("You enter the world");
  }
  function exit(player, game){
    $('#main').html("you leave the world");
  }
  
  // build the by-coordinate lookup
  indexMap();
  
  return {
    enter: enter, 
    exit: exit,
    tileAt: function(x,y){
      return tilesByCoords[x+','+y];
    },
    getEdges: function(x,y){
      var nearby = worldData.tiles.filter(function(tile){
        if(tile.x==x && tile.y==y) return false;
        if(
          Math.abs(tile.x - x) <= 1
        ){
          if(Math.abs(tile.y - y) <= 1){
            return true;
          }
        }
        return false;
      });
      return nearby;
    }
  };
});