define(['$', 'json!/location/world.json'], function($, worldData){

  function enter(player, game){
    $('#main').html("You enter the world");
  }
  function exit(player, game){
    $('#main').html("you leave the world");
  }
  
  return {
    enter: enter, 
    exit: exit,
    getEdges: function(x,y){
      var nearby = worldData.filter(function(tile){
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