define([
  'dollar', 
  'knockout', 
  'lib/koHelpers',
  'lib/util', 
  'resources/template',
  'lib/event',
  'models/Map'
], function($, ko, koHelpers, util, template, Evented, Map){

  // viewModel 
  var ui = { };
  var viewModel = ui.viewModel = {
    messages: ko.observableArray([]),
    status: ko.observableArray(['loading'])
  };
  
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
    var minimap =this.minimap = new Map({ 
      id: 'minimap',
      canvasNode: document.getElementById('minimap'),
      tileSize: 6 
    });
    viewModel.player = koHelpers.makeObservable(player); 
    viewModel.region = koHelpers.makeObservable(region);
    // minimap.render( region.tiles, { });
    // this.initHud(player, world);
    // this.initSidebar(player, world);
    // this.initMain(player, world);

    ko.applyBindings( viewModel );
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
