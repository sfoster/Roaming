define(['dollar', 'promise', 'lib/util', 'lib/json/ref'], function($, Promise, util, json){

  var resourceClassMap = {
    'location': 'models/Location',
    'player': 'models/Player',
    'region': 'models/Region',
    'npc': 'models/npc'
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

  function wrapAsPromise(value) {
    var defd = Promise.defer();
    setTimeout(function(){
      defd.resolve(value);
    }, 0);
    return defd.promise;
  }

  function resolveTypeToModel(type) {
    var defd = Promise.defer();
    var Model;
    var typeProperty;
    // we need to load a model for this type
    if(type.indexOf('#') > -1) {
      typeProperty = type.substring(1+type.indexOf('#'));
      type = type.substring(0, type.indexOf('#'));
    }
    require([resourceClassMap[type] || type], function(res){
      Model = (typeProperty) ? res[typeProperty] : res;
      defd.resolve(Model);
    });
    return defd.promise;
  }

  function resolveModelData(data) {
    var resourceId = data.resource;
    var resourceProperty;
    var resourceData;

    if(!resourceId) {
      resourceData = data.params || {};
      return wrapAsPromise(resourceData);
    }

    var defd = Promise.defer();
    if(resourceId.indexOf('#') > -1) {
      resourceProperty = resourceId.substring(1+resourceId.indexOf('#'));
      resourceId = resourceId.substring(0, resourceId.indexOf('#'));
    }
    require([resourceId], function(res){
      // put the resource data into place
      if(resourceProperty){
        resourceData = res[resourceProperty];
        if(!('id' in res)) {
          resourceData.id = resourceProperty;
        }
      } else {
        resourceData = res;
      }
      defd.resolve(resourceData);
    });
    return defd.promise;
  }

  function thaw(value) {
    var defd = Promise.defer();
    var type = value.type; // TODO: are there cases where we infer type?
    var Clazz;

    // simplest case - just return data
    if(!type){
      return resolveModelData(value);
    }

    var sequence = [
      function(){
        return resolveModelData(value);
      },
      function(data){
        resourceData = data;
        return resolveTypeToModel(type);
      },
      function(Model){
        Clazz = Model;
        // thawing out resource data can involve multiple asyn steps
        // which are tracked in this queue array
        var promiseQueue = [];
        // make instance
        // thaw out any properties that are flagged as containing references
        var propertiesWithReferences = Clazz.prototype.propertiesWithReferences || [];

        propertiesWithReferences.filter(function(pname){
          return (pname in resourceData);
        }).forEach(function(pname){
          if(resourceData[pname] instanceof Array) {
            resourceData[pname].forEach(function(refData, idx, coln){
              var promisedValue = thaw(refData).then(function(pData){
                // console.log("refd property %s resolved: %o", pname, pData);
                coln[idx] = pData;
              });
              promiseQueue.push(promisedValue);
            });
          } else {
            var promisedValue = thaw(resourceData[pname]).then(function(pData){
                console.log("refd property %s resolved: %o", pname, pData);
                resourceData[pname] = pData;
            });
            promiseQueue.push(promisedValue);
          }
        });
        if(promiseQueue.length) {
          return Promise.all(promiseQueue);
        } else {
          return resourceData;
        }
      },
      function(modelData){
        var instance = new Clazz(resourceData);
        return instance;
      }
    ];

    Promise.seq(sequence).then(function(instance){
      // console.log("thawed resource is ready: ", instance);
      defd.resolve(instance);
    }, function(){
      defd.reject("Failed to fully thaw value");
    });
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
        // console.log("promisedGet callback, dataType: %s, resourceData: %o", dataType, resourceData);

        thaw({ type: dataType, params: resourceData }).then(function(resource){
          // console.log("resource is ready: ", resource);
          onLoad(resource);
        }, function(){
          onLoad({});
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