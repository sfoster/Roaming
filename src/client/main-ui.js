define([
  '$', 'lib/util', 'resources/template',
  'resources/map'
], function($, util, template, map){

  function initMap(){
    console.log("init map");
    map.init().then(function(val){

      require(['json!/location/world.json'], function(mapData){
        var canvasNode = map.renderMap( mapData.tiles, { tileSize: 6 });
        $(canvasNode).css({
          margin: '0 auto',
          display: 'block'
        });
        // console.log("map rows: ", mapRows);
        $('.world-map').append( canvasNode );
      });
    });
    console.log("/init map");
  }
  

  return {
    init: function(player, world){
      
      initMap();
      
      // display the player's inventory
      var $inventoryNode = $("<ul></ul>");
      for(var i=0; i<player.inventory.length; i++){
        $inventoryNode.append("<li>"+ player.inventory[i] +"</li>");
      }
      $('.inventory')
        .html("<p>Maybe an Inventory list here?</p>")
        .append($inventoryNode);

      // display the player's current weapon
      $('.weapon').html( "<p>" + player.currentWeapon.name + "</p>");

      // display the 10,000ft view map
      $('.world-map').html("<p></p>");
    }
  }
  ;
});
