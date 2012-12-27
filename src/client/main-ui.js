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
    // player.inventory.on('onafteradd', function(evt){
    //   $inventoryNode.empty();
    //   for(var i=0; i<player.inventory.length; i++){
    //     $inventoryNode.append("<li>"+ player.inventory[i].name +"</li>");
    //   }
    // });
    // player.inventory.on('onafterdrop', function(evt){
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

      self.emit("onitemclick", {
       id:  parts[1],
       text: evt.target.text,
       href: evt.target.href
      });
    });
  };

  util.mixin(ui, Evented);
  
  ui.init = function(player, region){
    viewModel.player = koHelpers.makeObservable(player);
    
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
    var locationStubs = region.tiles.slice(0, 6); // koHelpers.resolveObservable( );

    var ids = locationStubs.map(function(tile){ 
      return tile.id; 
    });
    console.log("Load tiles: ", ids);
    
    console.log("viewModel.player: ", viewModel.player);
    ko.applyBindings( viewModel );

    // region.loadTiles( ids ).then(function( tiles ){
    //   minimap.render( tiles );
    //   ko.applyBindings( viewModel );
    // });
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
