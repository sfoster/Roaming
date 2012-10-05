define(['models/Location', 'models/Region'], function(Location, Region){

  // usage: require(['plugins/location!region/0,0'], function(tile, region){ ... })
  var global = window, 
      config = global.config || (global.config = {});
  
  Location.prototype.baseUrl		= "../../data/location";
  Region.prototype.baseUrl			= "../../data/location";

  var bootstrapPlugin = {
    
    load: function (resourceId, req, onLoad, requireConfig) {
      console.log("Bootstrap with: ", resourceId);
    	require([resourceId], function(){
    		onLoad("OK");
    	});
    }
  };

  return bootstrapPlugin;

});
