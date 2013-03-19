// property.js
define(['lib/util'], function(util){


  // usage: require(['plugins/resource!some/module#some.property'], function(someProperty){ ... })
  var propertyPlugin = {
    load: function (resourceId, req, onLoad, requireConfig) {
      // we need to load a model for this type
      var subProperty;
      if(resourceId.indexOf('#') > -1) {
        subProperty = resourceId.substring(1+resourceId.indexOf('#'));
        resourceId = resourceId.substring(0, resourceId.indexOf('#'));
      }
      console.log("property plugin, requiring resource: " + resourceId);
      console.log("property plugin, subProperty: " + subProperty);
      require([resourceId], function(res){
        console.log("property plugin, calling onLoad");
      	onLoad( subProperty ? util.getObject(subProperty, res) : res );
      });
    }
  };
  return propertyPlugin;
});
