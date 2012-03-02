define(['$', 'resources/world', 'models/player', 'resources/map'], function($, world, player, map){
  $('#main').html("It works (so far)");
  
  
  console.log("Player: ", player);
  
  var inventoryNode = $("<ul></ul>");
  for(var i=0; i<player.inventory.length; i++){
    inventoryNode.append("<li>"+ player.inventory[i] +"</li>");
  }
  $('.inventory')
    .html("<p>Maybe an Inventory list here?</p>")
    .append(inventoryNode);
    
  $('.weapon').html( "<p>" + player.currentWeapon.name + "</p>");
  
  $('.world-map').html("<p></p>");

  map.init();
  var mapData = {
    src: '../resources/maps/map.png',
    height: 100, width: 100
  };
  
  map.loadMap( mapData, function(mapRows){ 
    console.log("map rows: ", mapRows);
    $('.world-map').append( map.canvasNode );
    console.log("canvas node: ", map.canvasNode);
  });
  
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
    }
  })();
  var route = location.hash || '0,0';
  
  require(['resources/location!0,0'], function(location){
    console.log("enter the world");
    stack.push(world);
    console.log("got back location: ", location);
    require([location.moduleid], function(region){
      stack.push(region);
      stack.push(location);
    });
    // stack.push(region);
    // stack.push(tile);
  })
});