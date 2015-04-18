define([
  'lib/util',
  'lib/uiUtil',
  'lib/promise',
  'resources/template',
  'lib/event',
  'models/Map',
  'plugins/template!resources/templates/summaryInspector.html!summary-inspector',
  'plugins/template!resources/templates/actorInspector.html!actor-inspector'
], function($, ko, koHelpers, util, uiUtil, Promise, template, Evented, Map){

  var ui = window.ui = {
    _inited: false
  };


  ui.init = function(player, tile, region, game){
    if(this._inited && (
      this.game === game
    )){
      return;
    }

    this.game = game;
    window.viewModel = ui.viewModel = {}

    console.log("viewModel: ", viewModel);

    var minimap =this.minimap = new Map({
      id: 'minimap',
      canvasNode: document.getElementById('minimap'),
      tileSize: MINIMAP_TILE_SIZE
    });

    switchboard.on('game:locationenter',
                   ui.onLocationEnter.bind(this));
    switchboard.on('game:encounterstart',
                   ui.onEncounterStart.bind(this));
    this._inited = true;
  };

  ui.onLocationEnter = function(evt){
      var centerTile = evt.target;
      var region = game.region;
      var minimap = this.minimap;
      console.log("onLocationEnter, tile:", centerTile.id);

      var cx = centerTile.x,
          cy = centerTile.y;

      /////////////////////////////////////
      // Update the mini map for this tile

      var nearest9 = [centerTile].concat( region.getEdges(cx, cy) );
      region.loadTiles(nearest9).then(function( tiles ){
        minimap.startX = centerTile.x-1;
        minimap.startY = centerTile.y-1;
        minimap.render( tiles );
      });

      /////////////////////////////////////

      centerTile.backdrop = centerTile.backdrop.replace(/^.*image!/, '');
      console.log("UI: location enter: ", cx, cy, centerTile.backdrop);
      // TODO: actually enter the new tile
  };

  ui.onEncounterStart = function(evt){
    var encounter = evt.target;
    ui.message(encounter.description);
    console.log("ui.onEncounterStart, encounter: ", encounter);
  };

  ui.onCombatStart = function(evt){
    var combat = evt.target;
    // TODO: ...
  };
  ui.onCombatStrike = function(evt) {
    var strikee = evt.defender;
    strike(strikee);
  };

  ui.flush = function(dest){
    console.log("TODO: implement ui.flush");
  };

  ui.showItems = function(items, heading) {
    ui.info(heading || "Items", '', items);
  };

  ui.info = function(heading, body, items) {
    // enqueue an info message
    var update = function(){
      ui.showInfo({
        heading: heading,
        body: body,
        items: items
      });
      // tidy up any timer associated with this update
      ui._infoCloseTimer = null;
    };
    if(ui.isInfoShowing()){
      // the info panel is already showing,
      // so queue up this update for when it is next closed
      var queue = ui._infoQueue || (ui._infoQueue = []);
      // TODO: also increment some display of info counter?
      queue.push(update);
    } else {
      update();
    }
  };

  ui.message = function(cont, opt){
    opt = opt || {};
    var dest = opt.dest || 'messages';
    console.log("ui.message, to dest: " + dest, document.getElementById(dest) );
    ui.addMessage(cont);
    setTimeout(function(){
      var msgs = document.querySelectorAll('#'+dest+' > ul > li.message');
      if(msgs.length) {
        msgs[msgs.length-1].scrollIntoView();
      }
    }, 0);
  };

  ui.status = function(cont){
    cont = cont || "";
    cont = cont.split('\n');
    ui.message('<p class="status">'+cont.join('<br>')+'</p>');
  };

  function tileAt(x, y){
    // resolve pixel coordinates to a region tile
  }

  function findPos(obj) {
    var curleft = curtop = 0;
    do {
      curleft += obj.offsetLeft;
      curtop += obj.offsetTop;
    } while (obj = obj.offsetParent);
    return { x: curleft, y: curtop };
  }

  function pluralize(word, howMany) {
    if(undefined !== howMany && howMany <= 1) {
      return word;
    }
    switch(word.toLowerCase()) {
      case "is": return "are";
      case "was": return "were";
    }
    return word;
  }

  function onTileClick(vm, evt){
    var map = ui.minimap;
    var pixelX = evt.pageX - document.querySelector(evt.target).offset().left;
    var pixelY = evt.pageY - document.querySelector(evt.target).offset().top;

    var tileSize = map.tileSize;

    // resolve click coordinates to a value from the map's 0,0
    // and get a region coordinate
    var x = Math.floor(pixelX / tileSize) + map.startX,
        y = Math.floor(pixelY / tileSize) + map.startY;

    if(game.canMoveTo(x,y)) {
      // how to handle moving between regions?
      var hash = '#'+game.locationToString(x,y);
      window.location.hash = hash;
    } else {
      console.log("Unable to move to: %s,%s", x, y);
    }
  }

  function onMessagesClick(vm, evt){
    document.querySelector('#messages').classList.toggle('collapsed');
  }

  function onInventoryClick(vm, evt){
    document.querySelector('#inventory').classList.toggle('collapsed');
  }

  // TODO: implement strike in actions.js
  ui.renderStrike = function(id, options) {
    options = options || {};
    console.log("renderStrike: thing id: ", id);
    var elm = document.getElementById(id);
    if(!elm) {
      console.log("renderStrike: no element for id: ", id);
    }
    elm.addEventListener("animationend", function onAnimationEnd() {
      console.log("unlistening for animation");
      elm.removeEventListener("animationend", onAnimationEnd);
      elm.classList.remove('struck');
    }, false);
    console.log("striking: ", elm);
    elm.classList.add('struck');
  }

  return ui;

});
