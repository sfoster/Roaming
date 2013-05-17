define([
  'dollar',
  'promise',
  'lib/util',
  'lib/json/ref'
], function($, Promise, util, json){

  var resourceMapping = {
    _map: {
      'location': 'models/Location',
      'player': 'models/Player',
      'region': 'models/Region',
      'npc': 'models/npc',
      'items': 'models/Item',
      'armor': 'models/Item',
      'weapons': 'models/Item'
    },
    resolve: function(id) {
      id = id.replace(/#.*/, '');
      if(id.indexOf('resources/') == 0) {
        id = id.substring('resources/'.length);
        return this.resolve(id);
      }
      if(id.indexOf('/data/') == 0) {
        id = id.substring('/data/'.length);
        return this.resolve(id);
      }
      var prefix = id.indexOf('/') > -1 ?
            id.substring(0, id.indexOf('/')) : id;
      // check for explicit registered prefix => Model match
      if(prefix in this._map) {
        return this._map[prefix];
      }
      console.warn("Nothing mapped for: " + id);
    },
    register: function(prefix, resourcePath) {
      this._map[prefix] = resourcePath;
    }
  };

  function promisedRequire(resources){
    var defd = Promise.defer();
    console.log("promisedRequire for ", resources);
    require(
      resources,
      function(){
        console.log("promisedRequire resolving with ", arguments[0]);
        defd.resolve.apply(defd, arguments);
      },
      function(){
        defd.reject.apply(defd, arguments);
      }
    );
    return defd.promise;
  }

  function fetch(url, options){
    options = options || {};
    // are we fetching data to be thawed, or a module?
    var isData = (/\.json$/.test(url));
    // TODO: need to handle module differently
    //
    var defd = Promise.defer();
    $.ajax({
      url: url,
      dataType: options.dataType || 'json',
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

  function wrapAsPromise(value) {
    var defd = Promise.defer();
    setTimeout(function(){
      defd.resolve(value);
    }, 0);
    return defd.promise;
  }

  function resolveTypeToModel(type) {
    // resolve convenience aliases to their actual resource ids
    var factory = resourceMapping.resolve(type);
    console.log("resolveTypeToModel: ", type, factory);
    if(factory) {
      if(type.indexOf("#") > -1) {
        factory += type.substring(type.indexOf("#"));
      }
      return resolveModel(factory);
    } else {
      var defd = Promise.defer();
      setTimeout(function(){
        defd.reject(new Error("Unable to resolve " + type + " to Model"));
      },0);
      return defd.promise;
    }
  }

  function resolveModel(resourceId) {
    var defd = Promise.defer();
    var loaderPrefix = '',
        suffix = '',
        fragmentMatch = resourceId.match(/^([^#]+)(#.+)/);

    if(fragmentMatch) {
      loaderPrefix = 'plugins/property!';
      resourceId = fragmentMatch[1];
      suffix += fragmentMatch[2];
    }
    console.log("resolveModel: ", loaderPrefix+resourceId+suffix);
    // load via the property plugin if the resourceId has a fragment identifier
    require([loaderPrefix+resourceId+suffix], function(Model){
      console.log("resolveModel, loaded ", Model.name || Model);
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
    var factory = value.factory;
    var type = value.type; // TODO: are there cases where we infer type?
    var Clazz;
    var resourceData;
    console.log("thaw: ", value, type||factory);

    if(!(type || factory) && value.resource) {
      // support magic type-mapping for resources/foo#bar
      // if 'foo' is a registered type
      factory = resourceMapping.resolve(value.resource);
    }
    // simplest case - just return data
    if(!(type || factory)){
      return resolveModelData(value);
    }

    var sequence = [
      function(){
        return resolveModelData(value);
      },
      function(data){
        resourceData = data;
        return factory ? resolveModel(factory) : resolveTypeToModel(type);
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
    registerType: function(prefix, resourcePath){
      return resourceMapping.register(prefix, resourcePath);
    },
    resolveType: function(typeId){
      return resourceMapping.resolve(typeId);
    },
    load: function (resourceId, req, onLoad, requireConfig) {
      console.log("resource plugin load: "+resourceId, req, requireConfig);
      var resourceFactoryId = resourceMapping.resolve(resourceId);
      var fragmentId = "", loaderPrefix = "";
      var isJson = false;

      var fragmentMatch = resourceId.match(/^([^#]+)(#.+)/);
      if(fragmentMatch) {
        loaderPrefix = 'plugins/property!';
        resourceId = fragmentMatch[1];
        fragmentId = fragmentMatch[2];
      }
      // e.g. player/guest becomes player/guest.json
      // what about resources/items#rock?
      var resourceUrl = req.nameToUrl(resourceId);
      if(resourceUrl.indexOf('/data/') > -1) {
        resourceUrl = resourceUrl.replace(/\.js$/, '.json');
        isJson = true;
      }

      // promise to represent the loaded and expanded resource
      // which might entail nested resource loading
      console.info("load: "+resourceId, resourceUrl);
      var promisedData;
      if(isJson) {
        promisedData = fetch(resourceUrl, { dataType: 'json' }).then(function(resp){
          var resourceData = fragmentId ?
                  util.getObject(resp, fragmentId.substring(1)) : resp;
          resourceData._resourceUrl = resourceUrl;
          resourceData._resourceId = resourceId;
          return resourceData;
        });
      } else {
        promisedData = promisedRequire([loaderPrefix+resourceId+fragmentId]);
      }
      promisedData.then(function(resourceData){
        console.info("Got promisedData: ", resourceData, ", factory: ", resourceFactoryId);
        thaw({ factory: resourceFactoryId, params: resourceData }).then(function(resource){
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