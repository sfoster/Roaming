define(['dollar', 'promise', 'lib/util', 'lib/json/ref'], function($, Promise, util, json){

  var resourceClassMap = {
    'location': 'models/Location',
    'player': 'models/Player',
    'region': 'models/Region'
  };
  

  function fetch(url){
    var defd = Promise.defer();
    $.ajax({
      url: url,
      dataType: 'json',
      success: function(resp){
        defd.resolve.apply(defd, arguments);
      },
      error: function(err){
        console.error("Error loading " + url, err);
        defd.reject.apply(defd, arguments);
      }
    });
    return defd.promise;
  }
  function registerType(typestr, resourcePath) {
    resourceClassMap[typestr] = resourcePath;
  }
  function thaw(value) {
    var defd = Promise.defer();
    var ctorModule;
    if(value.type) {
      ctorModule = resourceClassMap[value.type];
      if(!ctorModule) {
        throw new Error("No mapping for type: " + value.type);
      }
      require([ctorModule], function(Clazz){
        var instance = new Clazz(value.params || {}); 
        defd.resolve(instance);
      });
      return defd.promise; 
    }
    if(value.resource) {
      require([value.resource], function(res){
       defd.resolve(res);
      });
      return defd.promise; 
    }
    setTimeout(function(){
      defd.resolve(value);
    }, 0);
    return defd.promise; 
  }

  // usage: require(['plugins/resource!region/0,0'], function(tile, region){ ... })
  var global = window, 
      config = global.config || (global.config = {});
  
  var resourcePlugin = {
    thaw: thaw,
    registerType: registerType,
    load: function (resourceId, req, onLoad, requireConfig) {
      var resourceParts = resourceId.split('/');
      var resourceType = resourceParts.shift();
      var resourceUrl = req.toUrl(resourceId + '.json');

      // promise to represent the loaded and expanded resource
      // which might entail nested resource loading
      var promisedGet = fetch(resourceUrl);
      promisedGet.then(function(resp){
        var queue = [];
        var resourceData;
        if(resp.status && resp.status !== "ok") {
          console.error("Problem loading: "+resourceUrl + ", response was: ", resp);
          throw new Error("Resource "+resourceId+"failed to load: " + resp.status);
        }
        resourceData = json.resolveJson(resp.status ? resp.d : resp);
        resourceData._resourceUrl = resourceUrl; 
        resourceData._resourceId = resourceId; 

        // console.log("resolved resourceData: ", resourceData);
        var dataType = resourceType;

        switch(dataType) {
          case 'location': 
            resourceData.regionId = resourceParts[0];
            resourceData.coords = resourceParts[1];
            if(resourceData.here) {
              resourceData.here.forEach(function(thing, idx, coln){
                var promisedValue = thaw(itemData).then(function(itemInstance){
                  coln[idx] = itemInstance;
                });
                queue.push(promisedValue);
              });
            }
            if(resourceData.encounter) {
              var promisedEncounter = thaw(resourceData.encounter).then(function(encounterInstance){
                resourceData.encounter =  encounterInstance;
              });
              queue.push(promisedEncounter);
            }
            break;
            
          default: 
            break;
        }

        var promisedResource = thaw({ type: dataType, params: resourceData });
        queue.push(promisedResource);
        
        Promise.all(queue).then(function(){
          console.log("promisedResource is ready: ", promisedResource);
          onLoad(promisedResource);
        });

      }, function(){
        console.warn("Failed to load: " + resourceUrl);
        console.log("errback given args: ", arguments);
        onLoad({});
      });
    }
  };

  return resourcePlugin;
});