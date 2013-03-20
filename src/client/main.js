define([
  'dollar', 'lib/util', 'lib/event', 'resources/template',
  'knockout', 'lib/koHelpers',
  'main-ui',
  'lib/UrlRouter',
  'promise',
  'lib/markdown',
  'plugins/resource!player/'+(config.playerid || 'guest'),
  'resources/encounters',
  'resources/items', 'resources/weapons', 'resources/armor', 'resources/traps',
  'models/Region', 'models/Location',
  'models/Combat'
], function(
    $, util, Evented, template,
    ko, koHelpers,
    ui,
    UrlRouter,
    Promise,
    markdown,
    player,
    encounters,
    items, weapons, armor, traps,
    Region, Location,
    Combat
){
  var START_LOCATION = 'world/3,2';
  var when = Promise.when;

  // setup the game object as an event sink and emitter
  var game = window.game = util.mixin({
    ui: ui,
    now: function(){
      // game timestamp, second units
      return Math.floor( Date.now() / 1000 );
    }
  }, Evented );

  // the scene is modelled as a stack of states
  var stack = game.stack = (function(){
    var _stack = [];
    return {
      length: 0,
      push: function(state){
        _stack.push(state);
        this.length++;
        state.enter(game.player, game);
      },
      pop: function(){
        var state = _stack.pop();
        this.length--;
        state.exit(game.player, game);
      },
      replace: function(state) {
        this.pop();
        this.push(state);
      },
      get: function(idx){
        return _stack[idx];
      }
    };
  })();


  if(!player.score){
    player.score = 0;
  }
  game._player = player;
  player = game.player = koHelpers.makeObservable(player);

  // login or init player
  // set up main game stack
  // get region data for the starting position
  // enter the region and tile


  function enterAt(regionId, x, y) {

    // load the region and current tile to set the scene
    var locationId = regionId + '/' + [x,y].join(',');
    console.log("enterAt, regionId: %s, locationId: %s", regionId, locationId);

    require([
      'plugins/resource!region/'+regionId+'/index',
      'plugins/resource!location/'+locationId
    ], function(region, tile){
      game.region = region;
      game.tile = tile;

      // draw and fill the layout
      ui.init( player, tile, region, game );

      function getIndexOfInstanceInStack(matcher) {
        // get the position of the first instance of the given ctor
        var stackIdx=stack.length,
            state = null,
            tile = null;
        while((state = stack.get(--stackIdx))){
          if(matcher(state)) {
            return stackIdx;
          }
        }
        return -1;
      }

      var regionStackIdx = getIndexOfInstanceInStack(function(thing){
        return (thing instanceof Region);
      });
      var currentRegion = (regionStackIdx > -1) ? stack.get(regionStackIdx) : null;

      if(currentRegion) {
        if(currentRegion !== region){
          // region change
          while(regionStackIdx < stack.length-1){
            stack.pop();
          }
          stack.replace(region);
        }
      } else {
        // add the region to the stack (and enter it)
        stack.push(region);
      }

      var tileStackIdx = getIndexOfInstanceInStack(function(thing){
        return (thing instanceof Location);
      });
      var currentTile = (tileStackIdx > -1) ? stack.get(tileStackIdx) : null;

      if(currentTile) {
        if(currentTile !== tile) {
          // tile change
          while(tileStackIdx < stack.length-1){
            stack.pop();
          }
          stack.replace(tile);
        }
      } else {
        stack.push(tile);
      }


      var encounterId = tile.encounter;
      if('string' == typeof encounterId) {
        if(!(encounterId in encounters)){
          throw "Encounter " + encounterId + " not defined";
        }
        // resolve encounter ids to their contents
        tile.encounter = encounters[encounterId];
      }

    });
  }

  var routes = game.routes = [
    [
      "#:region/:x,:y",
      function(req){
        var regionId = req.region,
            x = Number(req.x),
            y = Number(req.y);

          console.log("route match for location: ", regionId, x, y);
          enterAt(regionId, x, y);
      }
    ]
  ];
  var router = game.router = new UrlRouter(routes);
  router.compile();

  window.onhashchange = function() {
    router.match(window.location.hash); // returns the data object if successfull, undefined if not.
  };

  var currentLocation = player.position() || START_LOCATION;
  router.match(window.location.hash || '#'+currentLocation);

  ////////////////////////////////
  // find a home for:
  //
  function getCardinalDirection(origin, target){
    var x = target.x - origin.x,
        y = target.y - origin.y;

    var names={              // 8 4 2 1
      1:"north",            // 0 0 0 1 north         1
      3:"north-east",       // 0 0 1 1 north-east    3
      2:"east",             // 0 0 1 0 east          2
      6:"south-east",       // 0 1 1 0 south-east    6
      4:"south",            // 0 1 0 0 south         4
      12:"south-west",      // 1 1 0 0 south-west    12
      8:"west",             // 1 0 0 0 west          8
      9:"north-west"        // 1 0 0 1 north-west    9
    };
    var keyMask = 0;
    if(y < 0) keyMask = 1;
    if(y > 0) keyMask |=4;
    if(x > 0) keyMask |=2;
    if(x < 0) keyMask |=8;

    return names[keyMask];
  }

  function resolveItem(id, defaults){
    var cat = 'items',
        delimIdx = id.indexOf('/'),
        item;
    if(delimIdx > -1){
      cat = id.substring(0, delimIdx);
      id = id.substring(delimIdx+1);
    }
    switch(cat){
      case 'misc':
      case 'items':
        item = items[id];
        break;
      case 'armor':
        item = armor[id];
        break;
      case 'weapons':
        item = weapons[id];
        break;
      default:
        item = items[id] || weapons[id] || armor[id];
        break;
    }
    if(!item && defaults) {
       item = util.create(defaults, { id: id, category: cat });
    }
    if(!item.id) item.id = id;
    if(!item.category) item.category = cat;
    return item;
  }

  game.ui.on('itemclick', function(evt){
    var id = evt.id,
        item = resolveItem(id, { name: evt.text });
    console.log("taking item: ", item);
    // just add it directly. We might want a context menu or something eventually with a list of avail. actions
    player.inventory.push(item);
  });

  game.canMoveTo = function(x,y,_region) {
    var region = _region || game.region;
    var tile = region.getTileAtCoord(x,y);
    var terrain = tile ? tile.type : '';

    // determine if there's any impediment to the player moving off
    // the current tile and onto the proposed tile
    // (more logic may follow)
    if(terrain && !(/abyss|void/).test(terrain)) {
      return true;
    } else {
      return false;
    }
  }

  // convenience to build fragment ids for a given point/x,y coordinate
  game.locationToString = function(x,y,_region) {
    if('object' == typeof x) {
      y = x.y;
      x = x.x;
    }
    var region = _region || game.region;
    return region.id+'/'+x+','+y;
  };

  function isHostile(npc) {
    return !npc.friendly;
  }

  game.on("beforelocationenter", function(evt){
    console.log("beforelocationenter, flushing messages");
    game.ui.flush();
    game.ui.message("You enter " + evt.target.id);
    var id = game.locationToString(evt.target);
    var locationHistory = game.player.history[id] || (game.player.history[id] = {});
  });

  game.on("afterlocationenter", function(evt){
    var tile = evt.target;
    var hostiles = tile.npcs.filter(isHostile);
    if(hostiles.length) {
      game.ui && game.ui.message("You are faced with: " + util.pluck(hostiles, 'name').join(', '));

      console.log("Combat, with: ", hostiles);
      var combat = new Combat();
      // combat.start([player], hostiles).then(
      //   function(result){
      //     console.log("combat concluded: ", result);
      //   },
      //   function(err){
      //     console.log("combat error: ", err);
      //   },
      //   function(update){
      //     console.log("combat progress: ", update);
      //   }
      // );
    }
  });

  game.on("locationexit", function(evt){
    var id = game.locationToString(evt.target);
    var locationHistory = game.player.history[id];
    locationHistory.lastVisit = game.now();
    console.log("Updated lastVisit to %s: %o", id, locationHistory);
  });


});