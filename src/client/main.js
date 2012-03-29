define([
  '$', 'lib/util', 'lib/event', 'resources/template', 
  'main-ui',
  'resources/map',
  'lib/UrlRouter',
  'lib/Promise', 'resources/world', 'models/player'], function(
    $, util, Evented, template, 
    ui,
    map,
    UrlRouter, 
    Promise, world, player){
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
  
  var game ={};
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
      
      var canvasNode = map.renderMap( locationTiles, { 
        canvasNode: $('#nearbyMap')[0],
        showCoords: true,
        tileSize: 50,
        startX: tile.x-1, 
        startY: tile.y-1
      });
      
      $('#nearby').css({
        margin: '0',
        padding: '5px',
        display: 'block'
      });
      
      // var $options = $('<ol></ol>');
      // locations.forEach(function(edge){
      //   console.log("adjacent edge: ", edge);
      //   var coords = edge.id.split(','), 
      //       x = coords[0], 
      //       y = coords[1];
      //   var afar = edge.afar; 
      //   if(!afar || afar.match(/^--/)){
      //     afar = edgesById[edge.id].type;
      //   }
      //   var context = {
      //     terrain: afar,
      //     coords: edge.id,
      //     direction: getCardinalDirection(tile, { x: x, y: y }),
      //     x: x,
      //     y: y
      //   };
      //   console.log("template context: ", context);
      //   $options.append("<li>" + directionsTemplate(context) + "</li>");
      // });
      // $("#main").append($options);
    });
  });
  
});