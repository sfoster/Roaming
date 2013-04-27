define([
  'dollar',
  'knockout',
  'lib/koHelpers',
  'lib/util',
  'resources/template',
  'lib/event',
  'models/Map',
  'text!resources/templates/player.html',
  'text!resources/templates/tile.html'
], function($, ko, koHelpers, util, template, Evented, Map, playerTemplate, tileTemplate){

  function importTemplate(id, tmpl, bindProperty){
    // setup templates
    var tmplNode = document.createElement('script');
    tmplNode.setAttribute('type', 'text/html');
    tmplNode.id = id;
    var tmplText = document.createTextNode( tmpl );
    tmplNode.appendChild(tmplText);
    return document.body.appendChild( tmplNode );
  }

  var ui = {
    _inited: false
  };

  var viewModel = ui.viewModel = {
    messages: ko.observableArray([]),
    backdrop: ko.observable('resources/graphics/terrain/clearbg.jpg'),
    showCombat: ko.observable(false),
    showInfo: ko.observable(false),
    hideInfo: function(){ viewModel.showInfo(false); },
    combat: {
      allies: ko.observableArray([]),
      opponents: ko.observableArray([])
    },
    health: function(thing){
      
      if(thing.dead) {
          return 0;
      } else {
        var fullHealth = thing.baseStats.health;
        var percentHealth = 100 * (thing.stats.health/fullHealth);
        return percentHealth;
      }
    },
    info: {
      heading: ko.observable("Info"),
      body: ko.observable("Blah")
    },
    status: ko.observableArray(['loading']),
    onMessagesClick: onMessagesClick,
    onInventoryClick: onInventoryClick,
    onTileClick: onTileClick,
    tile: null
  };

  importTemplate('player-template', playerTemplate, 'player');
  importTemplate('location-template', tileTemplate, 'location');

  util.mixin(ui, Evented);

  var MINIMAP_TILE_SIZE = 36;


  function pluckNames(coln) {
    return coln.map(function(thing){
      return thing.name;
    });
  }

  ui.init = function(player, tile, region, game){
    if(this._inited && (
      this.game === game
    )){
      return;
    }

    this.game = game;
    viewModel.player = player;
    viewModel.tile = ko.observable( tile );

    var minimap =this.minimap = new Map({
      id: 'minimap',
      canvasNode: document.getElementById('minimap'),
      tileSize: MINIMAP_TILE_SIZE
    });

    // console.log("viewModel.player: ", viewModel.player);
    ko.applyBindings( viewModel );

    game.on('locationenter', ui.onLocationEnter.bind(ui));
    game.on('encounterstart', ui.onEncounterStart.bind(ui));

    this._inited = true;
  };

  ui.set = function(pname, value, obj) {
    obj = obj || viewModel;
    switch(typeof obj[pname]){
      case "function":
        var oldValue =  obj[pname]();
        if("array"==util.getType(oldValue)){
          // update array in-situ
          var items = value.map(function(item){
            return ko.observable(item);
          });
          obj[pname].splice.apply(obj[pname], [0, oldValue.length].concat(items));
        } else {
          obj[pname](value);
        }
        break;
      case "undefined":
        obj[pname] =value;
        break;
      case "object":
        Object.keys(value).forEach(function(key){
          ui.set(key, value[key], obj[pname]);
        });
        break;
    }
  };

  ui.onLocationEnter = function(evt){
      var centerTile = evt.target;
      var region = ui.game.region;
      var minimap =this.minimap;

      if(viewModel.tile.id === centerTile.id) {
        return;
      }

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

      centerTile.backdrop = centerTile.backdrop.replace(/^.*image!/, '')
      viewModel.tile(centerTile);

      if(centerTile.here.length) {
        ui.message("Items at this location: " + pluckNames(centerTile.here).join(", "));
      }

      console.log("UI: location enter: ", cx, cy, centerTile.backdrop);
  };

  ui.onEncounterStart = function(evt){
    var encounter = evt.target;
    ui.message(encounter.description);
    viewModel.tile(game.tile);
    console.log("ui.onEncounterStart, encounter: ", encounter);
    // TODO: redraw the stage
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
    dest = dest || 'messages';
    var coln = viewModel[dest];
    console.log("flushing " + dest, coln);
    if(coln && coln().length) {
      coln.splice(0, coln().length);
    }
    console.log("flushed " + dest, coln);
  };

  ui.info = function(heading, body) {
    viewModel.info.heading(heading);
    viewModel.info.body(body);
    viewModel.showInfo(true);
  };

  ui.message = function(cont, opt){
    opt = opt || {};
    var dest = opt.dest || 'messages';
    console.log("ui.message, to dest: " + dest, document.getElementById(dest) );
    viewModel[dest].push(cont);
    setTimeout(function(){
      var msgs = $('#'+dest+' > ul > li.message');
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
    var pixelX = evt.pageX - $(evt.target).offset().left;
    var pixelY = evt.pageY - $(evt.target).offset().top;

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
    $('#messages').toggleClass('collapsed');
  }

  function onInventoryClick(vm, evt){
    $('#inventory').toggleClass('collapsed');
  }

  function strike(thing) {
    var id = thing._id;
    if(!id) {
      console.log("strike: thing without id: ", thing);
      return;
    }
    var elm = document.getElementById(id);
    if(!elm) {
      console.log("strike: no element for id: ", id);
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
