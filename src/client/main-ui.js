define([
  'dollar',
  'knockout',
  'lib/koHelpers',
  'lib/util',
  'lib/uiUtil',
  'lib/promise',
  'resources/template',
  'lib/event',
  'models/Map',
  'plugins/template!resources/templates/summaryInspector.html!summary-inspector',
  'plugins/template!resources/templates/actorInspector.html!actor-inspector'
], function($, ko, koHelpers, util, uiUtil, Promise, template, Evented, Map){

  console.log("main-ui: typeof ko.mapping: ", typeof ko.mapping);

  var ui = window.ui = {
    _inited: false,
    ko: ko
  };

  function _ViewModel(player, tile, region, game){

    var classTransition = uiUtil.classTransition,
        setDisplayDefault = uiUtil.setDisplayDefault,
        setDisplayNone = uiUtil.setDisplayNone;

     this.tile = ko.computed(function(){
      var id = this.tileId();
      return ko.mapping.fromJS(ui.game.tile)
     }, this);

    this.player = ko.mapping.fromJS(player, {
      'inventory': {
        key: function(data) {
          return ko.utils.unwrapObservable(data.name);
        }
      }
    });

    this.player.inventory.subscribe(function(changed){
      player.inventory = ko.toJS(changed);
    });

    console.log("ViewModel ctor");
    this.tileId.subscribe(function(tileId){
      console.log("ViewModel, tileId observer:", tileId, ui.game.tile);
      console.log("viewModel, tileId changed: ", tileId);
    });

    this.onTileClick = function(){};

    this.combat = {
      allies: ko.observableArray([]),
      opponents: ko.observableArray([])
    };
    this.inCombat = ko.computed(function(){
      var isCombat = !!this.combat.opponents().length;
      return isCombat;
    }, this);

    this.inCombat.subscribe(function(isCombat){
      var $panels = $("#combatLayer > .panel");
      var combatLayer = document.querySelector("#combatLayer");

      console.log("inCombat.subscribe: ", isCombat);
      if(isCombat) {
        // show the combat layer
        $panels.each(function(){
          setDisplayDefault(this);
        });
        setDisplayDefault(combatLayer);
        classTransition(combatLayer, {
          className: 'collapsed', remove: true
        }).then(function(){
          // slide in the participants
          $panels.each(function(){
            this.classList.remove("collapsed");
          });
        });
      } else {
        // slide away the participants
        classTransition($panels, {
          className: 'collapsed',
          add: true
        }).then(function(){
          // then take the panels out of the document flow
          $panels.each(function(node){
            setDisplayNone(this);
          });
          // and hide the combat layer
          combatLayer.classList.add("collapsed");
        });
      }
    });
    this.activeScreen = ko.observable("location"); // game, location, player
    console.log("/ViewModel ctor");
  };
  _ViewModel.prototype = {
    activeScreen: ko.observable('location'),
    messages: ko.observableArray([]),
    backdrop: ko.observable('resources/graphics/terrain/clearbg.jpg'),
    showInfo: ko.observable(false),
    hideInfo: function(){ viewModel.showInfo(false); },
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
      body: ko.observable("Blah"),
      items: ko.observableArray([]),
      onItemClick: function() {
        // who wants it?
      }
    },
    status: ko.observableArray(['loading']),
    onMessagesClick: onMessagesClick,
    onInventoryClick: onInventoryClick,
    onTileClick: onTileClick,
    tileId: ko.observable()
  };

  // importTemplate('player-template', playerTemplate, 'player');
  // importTemplate('location-template', tileTemplate, 'location');

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
    window.viewModel = ui.viewModel = new _ViewModel(player, tile, region, game);

    var minimap =this.minimap = new Map({
      id: 'minimap',
      canvasNode: document.getElementById('minimap'),
      tileSize: MINIMAP_TILE_SIZE
    });

    $("#topbar").delegate(".screenLabel", "click", function(){
      var context = ko.contextFor(this);
      context.$data.activeScreen( this.getAttribute("data-screen") );
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
          ko.mapping.fromJS(value, {}, obj[pname]);
          // var items = value.map(function(item){
          //   return ko.observable(item);
          // });
          // obj[pname].splice.apply(obj[pname], [0, oldValue.length].concat(items));
        } else {
          obj[pname](value);
        }
        break;
      case "undefined":
        obj[pname] =value;
        break;
      case "object":
        ko.mapping.fromJS(value, {}, obj[pname]);
        // Object.keys(value).forEach(function(key){
        //   ui.set(key, value[key], obj[pname]);
        // });
        break;
    }
  };

  ui.onLocationEnter = function(evt){
      var centerTile = evt.target;
      var region = ui.game.region;
      var minimap =this.minimap;
      console.log("onLocationEnter, tile:", centerTile.id);

      if(viewModel.tile && viewModel.tile.id === centerTile.id) {
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

      centerTile.backdrop = centerTile.backdrop.replace(/^.*image!/, '');
      console.log("UI: location enter: ", cx, cy, centerTile.backdrop);
      viewModel.tileId(centerTile.id);
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
    dest = dest || 'messages';
    var coln = viewModel[dest];
    console.log("flushing " + dest, coln);
    if(coln && coln().length) {
      coln.splice(0, coln().length);
    }
    console.log("flushed " + dest, coln);
  };

  ui.showItems = function(items, heading) {
    ui.info(heading || "Items", '', items);
  };

  ui.info = function(heading, body, items) {
    var update = function(){
      viewModel.info.heading(heading);
      viewModel.info.body(body);
      koHelpers.updateArray(viewModel.info.items, items);
      viewModel.showInfo(true);
      // tidy up any timer associated with this update
      ui._infoCloseTimer = null;
    };
    if(viewModel.showInfo()){
      // the info panel is already showing,
      // so queue up this update for when it is next closed
      var queue = ui._infoQueue || (ui._infoQueue = []);
      queue.push(update);
      var subscription = ui._showInfoSubscription;
      if(!subscription) {
        // if we're not already listening for showInfo(), set up the callback to process the queue
        subscription = ui._showInfoSubscription = viewModel.showInfo.subscribe(function(newValue) {
          if(!newValue && ui._infoQueue && ui._infoQueue.length){
            if(!ui._infoCloseTimer){
              var infoUpdate = ui._infoQueue.shift();
              // guestimate around 1/2s for the transition to complete
              ui._infoCloseTimer = setTimeout(infoUpdate, 500);
            }
          }
        });
      }
    } else {
      update();
    }
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
    console.log("strike: thing id: ", id, thing);
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
