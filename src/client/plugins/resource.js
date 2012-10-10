define(['dollar', 'lib/util', 'lib/json/ref'], function($, util, json){

  var resourceClassMap = {
    'location': 'models/Location',
    'player': 'models/Player',
    'region': 'models/Region'
  };
  
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
  
  var resourcePlugin = {
    load: function (resourceId, req, onLoad, requireConfig) {
      var resourceType = resourceId.substring(0, resourceId.indexOf('/') );
      console.log("resource plugin load: ", resourceId, resourceType);
      var resourceUrl = config.baseUrl.replace(/\/$/, '') +'/' + resourceId;
      get(resourceId, function(resp){
        var resourceData;
        if(resp.status && resp.status === "ok" && resp.d) {
          resourceData = json.resolveJson(resp.d);
          // console.log("resolved resourceData: ", resourceData);
          var ctorModule = resourceType && resourceClassMap[resourceType];
          if(ctorModule) {
            require([ctorModule], function(Clazz){
              var instance = new Clazz(resourceData); 
              onLoad(instance);
            });
          } else {
            onLoad(resourceData);
          }
        }
        else {
          console.error("Problem loading: "+resourceUrl + ", response was: ", resp);
        }
      });
    }
  };

  return resourcePlugin;
});