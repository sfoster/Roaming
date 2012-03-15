define(['$', 'resources/Promise', 'resources/world', 'models/player', 'resources/map'], function($, Promise, world, player, map){
  $('#main').html("It works (so far)");
  
  var when = Promise.when;
  
  console.log("Player: ", player);
  console.log("map: ", map);
  
  // display the player's inventory
  var inventoryNode = $("<ul></ul>");
  for(var i=0; i<player.inventory.length; i++){
    inventoryNode.append("<li>"+ player.inventory[i] +"</li>");
  }
  $('.inventory')
    .html("<p>Maybe an Inventory list here?</p>")
    .append(inventoryNode);
    
  // display the player's current weapon
  $('.weapon').html( "<p>" + player.currentWeapon.name + "</p>");
  
  // display the 10,000ft view map
  $('.world-map').html("<p></p>");
  
  
  console.log("init map");
  // var promise = ;
  map.init().then(function(val){
    console.log("map.init callback: ", val);
    require(['json!data/location/world.json'], function(mapData){
      console.log("require world data callback");
      var canvasNode = map.renderMap( mapData, { tileSize: 6 });
      $(canvasNode).css({
        margin: '0 auto',
        display: 'block'
      });
      // console.log("map rows: ", mapRows);
      $('.world-map').append( canvasNode );
      console.log("canvas node: ", canvasNode);
    });
  });
  console.log("/init map");
  
  // login or init player
  // set up main game stack
  // get world data for the starting position
  // enter the region and tile
  
  var game ={};
  var stack = (function(){
    var _stack = [];
    return {
      push: function(state){
        _stack.push(state);
        state.enter(game.player, game);
      }, 
      pop: function(){
        var state = _stack.pop();
        state.exit(game.player, game);
      }, 
      replace: function(state) {
        this.pop(); 
        this.push(state);
      }
    };
  })();
  
  var coords = location.hash || '0,0', 
      xy = coords.split(/,\s*/), 
      adjacentTiles = world.getEdges(xy[0], xy[1]);
  
  require(['plugins/location!'+coords], function(location){
    console.log("enter the world");
    stack.push(world);
    console.log("got back location: ", location);
    stack.push(location);
    stack.push({
      enter: function(){
        var directions = adjacentTiles.map(function(tile){
          return tile.x + "," + tile.y;
        });
        $("#main").append("<p>You can go:" + directions.join(', ') + "</p>");
        stack.pop();
      }
    });
  });
});