define([
  '$', 'resources/util', 'resources/event', 'resources/template', 
  'main-ui',
  'resources/UrlRouter',
  'resources/Promise', 'resources/world', 'models/player'], function(
    $, util, Evented, template, 
    ui,
    UrlRouter, 
    Promise, world, player){
  $('#main').html("It works (so far)");
  
  var when = Promise.when;
  
  // setup the global as an event sink and emitter
  util.mixin(this, Evented);
  
  console.log("Player: ", player);
  
  // draw and fill the layout
  ui.init( player );
  
  // login or init player
  // set up main game stack
  // get world data for the starting position
  // enter the region and tile
  
  var game ={};
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
  
  router.match(location.hash || '#0,0');
  
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
  

  Evented.on("onafterlocationenter", function(evt){
    console.log("onafterlocationenter: ", evt);
    var tile = evt.target, 
        directionsTemplate = template('{{coords}}: To the <a href="#{{coords}}" class="option">{{direction}}</a> you see {{terrain}}');
        
    var edges = world.getEdges(tile.x, tile.y);
    var $options = $('<ol></ol>');
    
    edges.forEach(function(edge){
      console.log("adjacent edge: ", edge);
      var context = {
        terrain: edge.afar || edge.type,
        coords: edge.x +','+edge.y,
        direction: getCardinalDirection(tile, edge)
      };
      $options.append("<li>" + directionsTemplate(context) + "</li>");
    });
    $("#main").append($options);
  });
  
});