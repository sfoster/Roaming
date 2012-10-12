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
      var baseUrl = Location.prototype.baseUrl;
      var match = (/([^\/]+)\/(\d+,\d+)(.*)$/).exec(resourceId);

      console.log("location plugin load: ", resourceId, typeof resourceId);
      console.assert(match && match.length === 4, "location plugin given bad coords param:" + resourceId);
      
      var region = match[1], 
          coords = match[2],  
          params = match[3] ? match[3].substring(1) : '';  // lop off the '!'
      resourceId = region + '/' + coords;
          
      if(!params || params.indexOf('refresh') == -1){
        locn = window.locations[resourceId];
      }
      if(locn) {
        onLoad(locn);
      } else {
        get(baseUrl + '/' + resourceId + '.json', function(resp){
          resp = json.resolveJson(resp);
          var tileData;
          if(resp.status && resp.status !== "ok") {
            console.error("Problem loading /location/"+resourceId + ", response was: ", resp);
          }
          else {
            tileData = util.mixin(resp.d || resp, {
              id: coords,
              resourceId: resourceId,
              regionId: region
            });
            var ctorModule = tileData.terrainType || 'models/Location';
            require([ctorModule], function(Clazz){
              var tile = new Clazz(tileData); 
              onLoad(tile);
            });
          }
        });
      }
    }
  };

  return locationPlugin;
});