define([
  '$', 'lib/util', 'lib/event', 'resources/template', 
  'main-ui',
  'resources/map',
  'lib/UrlRouter',
  'lib/Promise', 
  'resources/world', 
  'models/player',
  'resources/encounters'
], function(
    $, util, Evented, template, 
    ui,
    map,
    UrlRouter, 
    Promise, 
    world, 
    player, 
    encounters
){
  $('#main').html("It works (so far)");
  
  var when = Promise.when;
  
  // setup the global as an event sink and emitter
  util.mixin(this, Evented);
  
  console.log("Player: ", player);
  
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
  var stack = (function(){
    var _stack = [];
    return {
      push: function(state){
        _stack.push(state);
        state.enter(game.player, game);
      }, 
      pop: function(){
        var state = _stack.pop();
        state.exit(game.player, game);
      }, 
      replace: function(state) {
        this.pop(); 
        this.push(state);
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
            console.log("enter the world");
            var encounterId = location.encounter;
            if('string' == typeof encounterId) {
              if(!(encounterId in encounters)){
                throw "Encounter " + encounterId + " not defined";
              }
              location.encounter = encounters[encounterId];
            }
            stack.push(world);
            if(!location.enter) {
              throw "Error loading location: " + id;
            }
            console.log("got back location: ", location);
            stack.push(location);
          });
          
      }
    ]    
  ];
  var router = new UrlRouter(routes);
  router.compile();
  
  window.onhashchange = function() {
    router.match(location.hash); // returns the data object if successfull, undefined if not.
  };
  
  router.match(location.hash || '#3,2');
  
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
  
  Evented.on("onafterlocationenter", function(evt){
    console.log("onafterlocationenter: ", evt);
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
    $("#main").append("<p>"+ tile.description +" at: " + tile.coords + "</p>");

    if(visits.length > 1){
      $("#main").append("<p>It looks familiar, you think you've been here before.</p>");
    }

    if(tile.encounter){
      console.log("TODO: Run encounter", tile.encounter);
      var encounterText = visits.length <= 1 ? tile.encounter.firstVisit : tile.encounter.reVisit;
      encounterText.forEach(function(text){
        $("#main").append("<p>"+text+"</p>");
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