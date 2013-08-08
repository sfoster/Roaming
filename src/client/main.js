define([
  'dollar', 'lib/util', 'lib/event', 'resources/template',
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
    },
    random: function() {
      return Math.random();
    }
  }, Evented );
  // for debug
  window.Combat = Combat;

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
  game.player = player;

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

  var currentLocation = player.position || START_LOCATION;
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
    return !(npc.friendly || npc.neutral);
  }

  function getName(thing) {
    return thing.name;
  };

  game.on("beforelocationenter", function(evt){
    game.ui.flush();
    game.ui.message("You enter " + evt.target.id);
    var id = game.locationToString(evt.target);
    var locationHistory = game.player.history[id] || (game.player.history[id] = {});
  });

  game.on("combatroundstart", function(evt){
    game.ui.set('allies', evt.allies, ui.viewModel.combat);
    game.ui.set('opponents', evt.opponents, ui.viewModel.combat);
    game.ui.set('showCombat', true);
  });
  game.on("combatroundend", function(evt){
    var tile = game.tile;
    var deadOpponents = evt.opponents.filter(Combat.deadFilter);
    var aliveOpponents = evt.opponents.filter(Combat.aliveFilter);
    var aliveAllies = evt.allies.filter(Combat.aliveFilter);

    deadOpponents.forEach(function(npc){
      console.log("combatend, dead opponent: ", npc);
      // TODO: move out of npcs, possibly as corpose into tile.here
      // do creatures drop weapon, and need to be searched for anything else?
      if(npc.currentWeapon && !npc.currentWeapon.fixed) {
        npc.currentWeapon.transferTo(game.tile.here);
        npc.inventory.remove(npc.currentWeapon);
        game.tile.here.push(npc.currentWeapon);
        npc.currentWeapon = null;
      }
      // remove the npc from the tile's list
      var idx = game.tile.npcs.indexOf(npc);
      if(idx > -1) {
        tile.npcs.splice(idx, 1);
      }
      // add the corpose to the tile's items list
      npc.name += " corpse";
      npc.fixed = true; // you can't take corpses with you
      game.tile.here.push(npc);
    });
    game.ui.set('allies', aliveAllies, ui.viewModel.combat);
    game.ui.set('opponents', aliveOpponents, ui.viewModel.combat);

    if(!aliveOpponents.length) {
      game.ui.set('showCombat', false);
      // yay you won
    }
    if(!aliveAllies.length) {
      game.ui.set('showCombat', false);
      // ugh, all dead. handle game over
    }
  });

  game.on("combatend", function(evt){
    game.ui.info("Combat concluded", "There was carnage: <pre>" + JSON.stringify(evt.scoreboard,null,2)+"</pre>");
  });

  game.on("combatstrike", ui.onCombatStrike);

  game.initCombat = function(allies, hostiles) {
    game.ui && game.ui.message("You are faced with: " + util.pluck(hostiles, 'name').join(', '));

    var combat = new Combat({ roundInterval: 250 });
    var isFirstRound = true;
    return combat.start(allies, hostiles).then(
      function(result){
        console.log("combat complete");
      },
      function(err){
        console.log("combat error: ", err);
      },
      function(update){
        // console.log("combat progress, pausing ", update);
        // combat.pause();
      }
    );
  };

  game.introduceNpcs = function(npcs) {
    if(!npcs.length) return;
    game.ui.info(
      "NPCs",
      "At this location you see: "+npcs.map(getName).join(", ")
    );
  };
  game.describeItems = function(items) {
    if(!items.length) return;
    game.ui.showItems(items);
  };

  game.on("locationenter", function(evt){
    var tile = evt.target;
    // beforelocationenter runs any setup
    // locationenter is our main hook for location action
    // things that can happen, and the order they should happen in
    // * run any encounters
    // * combat with any hostiles
    // * dialog with non-hostile
    // * describe scene and any items

    var hostiles = tile.npcs.filter(isHostile);
    if(hostiles.length) {
      tile.onAfterEnter(function(){
        return game.initCombat([game.player], hostiles);
      });
    }
    // we'll want to know more about any (surviving) npcs
    if(tile.npcs.length) {
      tile.onAfterEnter(function(){
        if(tile.npcs.length) {
          return game.introduceNpcs(tile.npcs);
        }
      });
    }
    tile.onAfterEnter(function(){
      if(tile.here.length) {
        return game.describeItems(tile.here);
      }
    });
  });

  game.on("locationexit", function(evt){
    var id = game.locationToString(evt.target);
    var locationHistory = game.player.history[id];
    locationHistory.lastVisit = game.now();
    console.log("Updated lastVisit to %s: %o", id, locationHistory);
  });


});