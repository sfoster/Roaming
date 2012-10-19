define(['dollar', 'lib/util', 'lib/json/ref', 'models/Location'], function($, util, json, Location){
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

  // usage: require(['plugins/location!region/0,0'], function(tile, region){ ... })
  var global = window, 
      config = global.config || (global.config = {});
  
  var locationPlugin = {
    
    load: function (resourceId, req, onLoad, requireConfig) {
      // get the resource id
      var match = (/([^\/]+)\/(\d+,\d+)(.*)$/).exec(resourceId);

      console.assert(match && match.length === 4, "location plugin given bad coords param:" + resourceId);
      
      var region = match[1], 
          coords = match[2],  
          params = match[3] ? match[3].substring(1) : '';  // lop off the '!'
      resourceId = 'location/'+ region + '/' + coords;
      console.log("location plugin load: ", resourceId);
      require(['plugins/resource!'+resourceId], function(tileData){
        tileData.regionId = region;

        var ctorModule = tileData.terrainType || 'models/Location';
        require([ctorModule], function(Clazz){
          var tile = new Clazz(tileData); 
          onLoad(tile);
        });
      });

    }
  };

  return locationPlugin;
});