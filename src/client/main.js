define([
  '$', 'lib/util', 'lib/event', 'resources/template', 
  'main-ui',
  'resources/map',
  'lib/UrlRouter',
  'lib/Promise', 
  'lib/markdown',
  'resources/world', 
  'models/player',
  'resources/encounters',
  'resources/items', 'resources/weapons', 'resources/armor', 'resources/traps'
], function(
    $, util, Evented, template, 
    ui,
    map,
    UrlRouter, 
    Promise, 
    markdown,
    world, 
    player, 
    encounters,
    items, weapons, armor, traps
){
  var when = Promise.when;
  
  // setup the global as an event sink and emitter
  util.mixin(this, Evented);
  
  console.log("Player: ", player);
  
  world.on('enter', function(){
    ui.status("You enter the world");
  });
  world.on('exit', function(){
    ui.status("You leave this world");
  });
  
  // draw and fill the layout
  ui.init( player );
  map.init();
  
  // login or init player
  // set up main game stack
  // get world data for the starting position
  // enter the region and tile
  
  var game ={
    player: player
  };
  var locationsByCoords = {};
  var stack = window.stack = (function(){
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
  

  var routes = [
    [
      "#:x,:y", 
      function(req){
        var x = Number(req.x), 
            y = Number(req.y);
            
          var id = [x,y].join(',');
          console.log("route match for location: ", x, y, id);
          require(['plugins/location!'+id], function(location){
            var encounterId = location.encounter;
            if('string' == typeof encounterId) {
              if(!(encounterId in encounters)){
                throw "Encounter " + encounterId + " not defined";
              }
              // resolve encounter ids to their contents
              location.encounter = encounters[encounterId];
            }
            if(!location.enter) {
              throw "Error loading location: " + id;
            }
            // walk up the stack to the world
            if(!stack.length){
              stack.push(world);
            } 
            if(stack.length > 1){
              stack.pop();
            }
            stack.push(location);
          });
          
      }
    ]    
  ];
  var router = new UrlRouter(routes);
  router.compile();
  
  window.onhashchange = function() {
    router.match(window.location.hash); // returns the data object if successfull, undefined if not.
  };
  
  router.match(window.location.hash || '#3,2');
  
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
  
  function loadLocation(id) {
    var locationModel = locationsByCoords[id];
    var locationPromise = new Promise();
    if(locationModel) {
      setTimeout(function(){
        locationPromise.resolve(locationModel);
      }, 10);
    } else {
      require(['json!/location/'+id+'.json'], function(location){
        if(!location.coords){
          console.error("No location at: ", id);
          location = {
            coords: id.split(',')
          };
        } else {
          location.id = location.coords.join(',');
        }
        locationPromise.resolve(location);
      });
    }
    return locationPromise;
  }
  
  function loadLocations() {
    var locations = [];
    var allLocationsPromise = new Promise();
    var ids = Array.prototype.slice.call(arguments, 0);

    ids.forEach(function(id){
      loadLocation(id).then(function(location){
        locations.push(location);
        if(locations.length >= ids.length){
          // all loaded
          allLocationsPromise.resolve(locations);
        }
      });
    });
    return allLocationsPromise;
  }
  
  $('#nearbyMap').click(function(evt){
    var tileSize = nearbyMap.tileSize;
    var x = Math.floor(evt.clientX / tileSize), 
        y = Math.floor(evt.clientY / tileSize);

    // add the offsets for the current location
    var location = world.tileAt(nearbyMap.startX +x, nearbyMap.startY+y);
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
  
  ui.on('onitemclick', function(evt){
    var id = evt.id, 
        item = resolveItem(id, { name: evt.text }); 
    console.log("taking item: ", item);
    // just add it directly. We might want a context menu or something eventually with a list of avail. actions
    player.inventory.add(item);
  });
  
  Evented.on("onafterlocationenter", function(evt){
    console.log("onafterlocationenter: ", evt);
    
    ui.flush("main");
    
    var tile = evt.target, 
        directionsTemplate = template('{{coords}}: To the <a href="#{{coords}}" class="option">{{direction}}</a> you see {{terrain}}');
        
    var edges = world.getEdges(tile.x, tile.y);
    var edgesById = {};
    var locationsById = {};
    var ids = edges.map(function(tile){
      var id = tile.x +',' + tile.y;
      edgesById[id] = tile;
      return id;
    });

    var history = player.history[tile.id], 
        visits = history && history.visits;
        
    console.log("history for location: ", history);
    ui.main("<p>"+ tile.description +" at: " + tile.coords + "</p>");

    if(visits.length > 1){
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

      var handle = player.inventory.on('onafteradd', function(evt){
        for(var i=0, hereItems = tile.here; i<hereItems.length; i++){
          if(evt.target.id == hereItems[i].id) break;
        }
        if(i < hereItems.length) {
          console.log("removing took item: ", hereItems[i]);
          hereItems.splice(i, 1);
        }
        ui.status("You take the "+evt.target.name);
      });
      tile.onExit(function(){
        console.log("unhooking onaferadd handler for tile: ", tile.id);
        handle.remove();
      });
    }

    if(tile.encounter){
      var encounterText = visits.length <= 1 ? tile.encounter.firstVisit : tile.encounter.reVisit;
      encounterText.forEach(function(mdText){
        var html = markdown(mdText);
        ui.main("<p class='encounter'>"+html+"</p>");
      });
    }
    
    loadLocations.apply(this, ids).then(function(locations){
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
      nearbyMap = { 
        canvasNode: $('#nearbyMap')[0],
        showCoords: true,
        tileSize: 50,
        startX: tile.x-1, 
        startY: tile.y-1
      };

      var canvasNode = map.renderMap( locationTiles, nearbyMap);
      
      $('#nearby').css({
        margin: '0',
        padding: '5px',
        display: 'block'
      });

    });
  });
  
});