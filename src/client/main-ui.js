define([
  '$', 'lib/util', 'resources/template',
  'lib/event',
  'resources/map'
], function($, util, template, Evented, map){

  var ui = {};
  
  ui.initHud = function(player, world){
    $('<canvas id="nearbyMap" width="150" height="150"></canvas>').appendTo($("#nearby"));
  };
  
  ui.initMap = function(player, world){
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
  };
  
  ui.initSidebar = function(player, world){
    // display the player's inventory
    var $inventoryNode = $("<ul></ul>");
    $('.inventory')
      // .html("<p>Maybe an Inventory list here?</p>")
      .append($inventoryNode);
    
    player.inventory.forEach(function(item){
      $inventoryNode.append("<li>"+ item.name +"</li>");
    });
    
    player.inventory.on('onafteradd', function(evt){
      $inventoryNode.empty();
      for(var i=0; i<player.inventory.length; i++){
        $inventoryNode.append("<li>"+ player.inventory[i].name +"</li>");
      }
    });
    player.inventory.on('onafterdrop', function(evt){
      $inventoryNode.empty();
      for(var i=0; i<player.inventory.length; i++){
        $inventoryNode.append("<li>"+ player.inventory[i].name +"</li>");
      }
    });

    // display the player's current weapon
    $('.weapon').html( "<p>" + player.currentWeapon.name + "</p>");
    
    // display the 10,000ft view map
    $('.world-map').html("<p></p>");
  };

  ui.initMain = function(player, world){
    var self = this;
    $('#main').delegate("a[href^='item:']", "click", function(evt){
      evt.preventDefault();
      var parts = evt.target.href.split(':');

      self.emit("onitemclick", {
       id:  parts[1],
       text: evt.target.text,
       href: evt.target.href
      });
    });
  };

  util.mixin(ui, Evented);
  
  ui.init = function(player, world){
    this.initMap(player, world);
    this.initHud(player, world);
    this.initSidebar(player, world);
    this.initMain(player, world);
    
    self.on("onitemclick", function(evt){
      console.log("onitemclick event: ", evt);
    });
  };

  ui.main = function(cont){
    return $("#main").append(cont);
  };
  
  return ui;

});
