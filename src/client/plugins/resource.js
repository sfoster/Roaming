define([
  'dollar',
  'promise',
  'lib/util',
  'lib/json/ref'
], function($, Promise, util, json){

  var resourceClassMap = {
    'location': 'models/Location',
    'player': 'models/Player',
    'region': 'models/Region',
    'npc': 'models/npc',
    'items': 'models/Item'
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
    // resolve convenience aliases to their actual resource ids
    var defd = Promise.defer();
    var loaderPrefix = '',
        suffix = '',
        resourceId = type,
        fragmentMatch = resourceId.match(/^([^#]+)(#.+)/);

    if(fragmentMatch) {
      loaderPrefix = 'plugins/property!';
      resourceId = fragmentMatch[1];
      suffix += fragmentMatch[2];
    }
    if(resourceId in resourceClassMap) {
      resourceId = resourceClassMap[resourceId];
      fragmentMatch = resourceId.match(/^([^#]+)(#.+)/);
      if(fragmentMatch) {
        loaderPrefix = 'plugins/property!';
        resourceId = fragmentMatch[1];
        suffix += fragmentMatch[2];
      }
    }
    // load via the property plugin if the resourceId has a fragment identifier
    require([loaderPrefix+resourceId+suffix], function(Model){
      defd.resolve(Model);
    });
    return defd.promise;
  }

  function resolveModelData(data) {
    // { resource: 'some/path' }
    var resourceId = ('resource' in data) ? data.resource : '';
    var resourceData;

    if(!resourceId) {
      // { params: { 'foo': 'bar' }, }
      resourceData = data.params || {};
      return wrapAsPromise(resourceData);
    }

    var defd = Promise.defer();
    var loaderPrefix = '',
        suffix = '',
        fragmentMatch = resourceId.match(/^([^#]+)(#.+)/);
    if(fragmentMatch) {
      // { resource: 'foo/bar#bazz' }
      loaderPrefix = 'plugins/property!';
      resourceId = fragmentMatch[1];
      suffix = fragmentMatch[2];
    }

    // load via the property plugin if the resourceId has a fragment identifier
    require([loaderPrefix+resourceId+suffix], function(resourceData){
      // put the resource data into place
      if(suffix && !('id' in resourceData)) {
        resourceData.id = (suffix.split('#'))[1];
      }
      defd.resolve(resourceData);
    });
    return defd.promise;
  }

  function thaw(value) {
    var defd = Promise.defer();
    var type = value.type; // TODO: are there cases where we infer type?
    var Clazz;
    var resourceData;

    if(!type && value.resource) {
      // support magic type-mapping for resources/foo#bar
      // if 'foo' is a registered type
      type = value.resource.replace(/^resources\/(\w+).*/, '$1');
      if(!(type in resourceClassMap)) {
        type = null;
      }
    }
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
        // thawing out resource data can involve multiple asyn steps
        // which are tracked in this queue array
        var promiseQueue = [];
        // make instance
        // thaw out any properties that are flagged as containing references
        if(!Model.prototype){
          throw new Error("Missing/unexpected Model:", Model);
        }
        var propertiesWithReferences = Model.prototype.propertiesWithReferences || [];

        propertiesWithReferences
          .filter(function(pname){
            // hasProperty supports dot paths like 'foo.bar'
            return util.hasProperty(resourceData, pname);

          }).forEach(function(pname){
            var value = util.getObject(pname, resourceData);
            if(value instanceof Array) {
              value.forEach(function(refData, idx, coln){
                var promisedValue = thaw(refData).then(function(pData){
                  // console.log("refd property %s resolved: %o", pname, pData);
                  if(coln.addAt) {
                    // Let Collection instances do their thing
                    coln.addAt(pData, idx);
                  } else {
                    coln[idx] = pData;
                  }
                });
                promiseQueue.push(promisedValue);
              });
            } else {
              var promisedValue = thaw(value).then(function(pData){
                  resourceData[pname] = pData;
              });
              promiseQueue.push(promisedValue);
            }
          }
        );
        if(promiseQueue.length) {
          return Promise.all(promiseQueue).then(function(){
            return {data: resourceData, model: Model };
          });
        } else {
          return { data: resourceData, model: Model };
        }
      },
      function(params){
        var Model = params.model,
            resourceData = params.data;
        var instance = new Model(resourceData);
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