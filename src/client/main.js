define([
  'dollar', 'lib/util', 'lib/event', 'resources/template', 
  'knockout', 'lib/koHelpers',
  'main-ui',
  'resources/map',
  'lib/UrlRouter',
  'promise', 
  'lib/markdown',
  'plugins/resource!player/'+(config.playerid || 'guest'), 
  'resources/encounters',
  'resources/items', 'resources/weapons', 'resources/armor', 'resources/traps'
], function(
    $, util, Evented, template, 
    ko, koHelpers,
    ui,
    map,
    UrlRouter, 
    Promise, 
    markdown,
    player, 
    encounters,
    items, weapons, armor, traps
){
  var START_LOCATION = 'world/3,2';
  var when = Promise.when;

  // setup the game object as an event sink and emitter
  var game = window.game = util.mixin({
    ui: ui
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

      var encounterId = tile.encounter;
      console.log("Loaded region: ", region);
      console.log("Loaded tile: ", tile);
      if('string' == typeof encounterId) {
        if(!(encounterId in encounters)){
          throw "Encounter " + encounterId + " not defined";
        }
        // resolve encounter ids to their contents
        tile.encounter = encounters[encounterId];
      }

      // draw and fill the layout
      ui.init( player, region );

      // game.emit("onafterlocationenter", { target: tile });

      region.on('enter', function(){
        ui.status("You enter the region");
      });
      region.on('exit', function(){
        ui.status("You leave this region");
      });
      
      // if(!tile.enter) {
      //   throw "Error loading location: " + id;
      // }
      // walk up the stack to the region
      if(!stack.length){
        stack.push(region);
      } 
      if(stack.length > 1){
        stack.pop();
      }
      stack.push(tile);
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
  
  router.match(window.location.hash || '#'+START_LOCATION);
  
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
  
  $('#nearbyMap').click(function(evt){
    var tileSize = nearbyMap.tileSize;
    var x = Math.floor(evt.clientX / tileSize), 
        y = Math.floor(evt.clientY / tileSize);

    // add the offsets for the current location
    var location = region.tileAt(nearbyMap.startX +x, nearbyMap.startY+y);
    var hash = '#'+[location.x, location.y].join(',');
    window.location.hash = hash;
    console.log("map clicked at: ", evt, location, hash);
  });
  
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
  
  game.ui.on('onitemclick', function(evt){
    var id = evt.id, 
        item = resolveItem(id, { name: evt.text }); 
    console.log("taking item: ", item);
    // just add it directly. We might want a context menu or something eventually with a list of avail. actions
    player.inventory.push(item);
  });
  
  game.on("onafterlocationenter", function(evt){
    console.log("onafterlocationenter: ", evt);
    
    var ui = game.ui;
    ui.flush("main");
    
    var tile = evt.target, 
        directionsTemplate = template('{{coords}}: To the <a href="#{{coords}}" class="option">{{direction}}</a> you see {{terrain}}');
        
    var edges = game.region.getEdges(tile.x, tile.y);
    var edgesById = {};
    var locationsById = {};
    var ids = edges.map(function(tile){
      var id = tile.x +',' + tile.y;
      edgesById[id] = tile;
      return id;
    });

    var history = game.player.history[tile.id], 
        visits = history && history.visits;
        
    console.log("history for location: ", history);
    ui.main("<p>"+ tile.description +" at: " + tile.coords + "</p>");

    if(visits && visits.length > 1){
      ui.main("<p>It looks familiar, you think you've been here before.</p>");
    }

    if(tile.here){
      console.log(tile.id, "tile.here: ", tile.here);
      
      var hereText = tile.here.map(function(obj){
        if('string' == typeof obj) {
          obj = resolveItem(obj, { name: '??'} );
        }
        var mdText = obj.description;
        if(!mdText) mdText = "You see: ["+obj.name+"](item:"+obj.category+"/"+obj.id+")";
        var html = markdown(mdText);
        return html;
      }).join('<br>');
      
      ui.main("<p class='here'>"+hereText+"</p>");

      // var handle = player.inventory.subscribe(function(vm, evt){
      //   for(var i=0, hereItems = tile.here; i<hereItems.length; i++){
      //     if(evt.target.id == hereItems[i].id) break;
      //   }
      //   if(i < hereItems.length) {
      //     console.log("removing took item: ", hereItems[i]);
      //     hereItems.splice(i, 1);
      //   }
      //   ui.status("You take the "+evt.target.name);
      // });
      tile.onExit(function(){
        console.log("unhooking onaferadd handler for tile: ", tile.id);
        handle.remove();
      });
    }

    game.region.loadTiles(ids).then(function(tiles){
      var locations = tiles;
      // populate the by-id lookup for the location objects
      locations.forEach(function(){
        locationsById[location.id] = location;
      });
      
      var locationTiles = util.map(edges, function(edgeTile){
        var location = locationsById[edgeTile.id] || {};
        var tile = util.mixin( Object.create(edgeTile), location);
        return tile;
      });
      
      // update the nearby map with tiles around the current location
      // nearbyMap = { 
      //   canvasNode: $('#nearbyMap')[0],
      //   showCoords: true,
      //   tileSize: 50,
      //   startX: tile.x-1, 
      //   startY: tile.y-1
      // };

      // var canvasNode = map.renderMap( locationTiles, nearbyMap);
      
      // $('#nearby').css({
      //   margin: '0',
      //   padding: '5px',
      //   display: 'block'
      // });

    });
  });
  
});