define(['$', 'models/Location'], function($, Location){
  console.log("loading location plugin");
  
  window.locations = {};

  // usage: require(['location!0,0'], function(tile, region){ ... })
  var global = window, 
      config = global.config || (global.config = {});
  
  var locationPlugin = {
    // pluginBuilder: './locationBuilder',
    
    load: function (coords, req, onLoad, requireConfig) {
      console.log("location plugin load: ", coords);
      var locn = window.locations[coords]; 
      if(locn) {
        onLoad(locn);
      } else {
        $.ajax({
          dataType: 'json',
          url: '../data/location/' + coords + '.json',
          success: function(resp){
            var tile = new Location(resp); 
            onLoad(tile);
          }, 
          error: function(err) {
            onLoad(err);
          }
        });
      }
      
    }
  };

  return locationPlugin;
});