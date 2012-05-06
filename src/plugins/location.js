define(['$', 'compose', 'lib/json/ref', 'models/Location'], function($, Compose, json, Location){
  console.log("loading location plugin");
  
  window.locations = {};

  function get(url, callback){
    console.log("get url: ", url);
    $.ajax({
      url: url,
      dataType: 'json',
      success: callback,
      error: function(err){
        console.error("Error loading " + url, err);
      }
    });
  }

  // usage: require(['plugins/location!0,0'], function(tile, region){ ... })
  var global = window, 
      config = global.config || (global.config = {});
  
  var locationPlugin = {
    
    load: function (coords, req, onLoad, requireConfig) {
      var locn = window.locations[coords];
      console.log("location plugin load: ", locn);
      if(locn) {
        onLoad(locn);
      } else {
        get('/location/' + coords + '.json', function(resp){
          resp = json.resolveJson(resp);
          var ctorModule = resp.terrainType || 'models/Location';
          require([ctorModule], function(Clazz){
            var tile = new Clazz(resp); 
            onLoad(tile);
          });
        });
      }
    }
  };

  return locationPlugin;
});