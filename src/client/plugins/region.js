define(['dollar', 'lib/json/ref', 'models/Region'], function($, json, Region){
  console.log("loading region plugin");
  
  // usage: require(['plugins/region!world], function(region){ ... })
  var global = window, 
      config = global.config || (global.config = {});
  
  global.regions = {};

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

  var regionPlugin = {
    
    load: function (id, req, onLoad, requireConfig) {
      var parts = id.split(/[!?]/),
          params = parts[1], 
          region = null;
      id = parts[0];
      var resourceUrl = Region.prototype.baseUrl.replace(/\/$/, '') +'/' + id + '/index.json';
      
      // only re-create the region instance if necessary
      // This maybe dupes functionality in the plugin system
      if(!params || params.indexOf('refresh') == -1){
        region = global.regions[id];
      }
      console.log("region plugin load: ", region);
      if(region) {
        onLoad(region);
      } else {
        // we're currently storing regions at location/name.json
        get(resourceUrl, function(resp){
          resp = json.resolveJson(resp);
          if(resp.status == 'ok'){
            region = new Region({ 
              id: id, 
              resourceUrl: resourceUrl,
              tiles: resp.d
            });
            onLoad(region);
          } else {
            throw "Error loading resourceUrl, status: " + status;
          }
        });
      }
    }
  };

  return regionPlugin;
});