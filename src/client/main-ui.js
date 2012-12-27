define([
  'dollar', 
  'knockout', 
  'lib/koHelpers',
  'lib/util', 
  'resources/template',
  'lib/event',
  'models/Map',
  'text!resources/templates/player.html'
], function($, ko, koHelpers, util, template, Evented, Map, playerTemplate){

  function importTemplate(id, tmpl, bindProperty){
    // setup templates
    var tmplNode = document.createElement('script'); 
    tmplNode.setAttribute('type', 'text/html');
    tmplNode.id = id;
    var tmplText = document.createTextNode( tmpl );
    tmplNode.appendChild(tmplText);
    return document.body.appendChild( tmplNode );
  }
  // viewModel 
  var ui = { };
  var viewModel = ui.viewModel = {
    messages: ko.observableArray([]),
    status: ko.observableArray(['loading'])
  };
  
  importTemplate('player-template', playerTemplate, 'player');
  
  ui.initSidebar = function(player, world){
    // player.inventory.on('afteradd', function(evt){
    //   $inventoryNode.empty();
    //   for(var i=0; i<player.inventory.length; i++){
    //     $inventoryNode.append("<li>"+ player.inventory[i].name +"</li>");
    //   }
    // });
    // player.inventory.on('afterdrop', function(evt){
    //   $inventoryNode.empty();
    //   for(var i=0; i<player.inventory.length; i++){
    //     $inventoryNode.append("<li>"+ player.inventory[i].name +"</li>");
    //   }
    // });
  };

  ui.initMain = function(player, world){
    var self = this;
    $('#main').delegate("a[href^='item:']", "click", function(evt){
      evt.preventDefault();
      var parts = evt.target.href.split(':');

      self.emit("itemclick", {
       id:  parts[1],
       text: evt.target.text,
       href: evt.target.href
      });
    });
  };

  util.mixin(ui, Evented);
  
  ui.init = function(player, region, game){
    viewModel.player = player;
    
    var minimap =this.minimap = new Map({ 
      id: 'minimap',
      canvasNode: document.getElementById('minimap'),
      tileSize: 6 
    });


    // minimap.render( region.tiles, { });
    // this.initHud(player, world);
    // this.initSidebar(player, world);
    // this.initMain(player, world);
    console.log("UI.init with region: ", region);

    // var ids = region.tileIds().slice(0, 6); // koHelpers.resolveObservable( );
    // console.log("Load tiles: ", ids);
    
    console.log("viewModel.player: ", viewModel.player);
    ko.applyBindings( viewModel );

    game.on('locationenter', function(evt){
      var centerTile = evt.target, 
          cx = centerTile.x, 
          cy = centerTile.y;

      console.log("UI: location enter: ", cx, cy);

      var visibleTileIds = (function(tile){
        var ids = [];
        for(var yo=-1; yo<=1; yo++){
          for(var xo=-1; xo<=1; xo++){
              ids.push((cx+xo)+','+(cy+yo));
          }
        }
        return ids;
      })(centerTile);

      console.log("UI: visibleTileIds: ", visibleTileIds);
      region.loadTiles( visibleTileIds ).then(function( tiles ){
        minimap.render( tiles );
      });

    });
  };

  ui.flush = function(id){
    $("#"+id).empty();
  };
  
  ui.main = function(cont){
     viewModel.messages.push(cont);
  };

  ui.status = function(cont){
    cont = cont.split('\n');
    viewModel.status.push(cont.join('<br>'));
  };
  
  return ui;

});
