define([
  'promise',
  'lib/util'
], function(Promise, util){

  var DEBUG = false;
  var debug = {
    log: DEBUG ? console.log.bind(console, 'resource') : function() {}
  };

  function wrapAsPromise(value) {
    var defd = Promise.defer();
    setTimeout(function(){
      defd.resolve(value);
    }, 0);
    return defd.promise;
  }


  function assertType(thing, type) {
    return typeof thing === type;
  }

  /*
   * returns Promise
   */
  function resolveResource(resourceId) {
    var defd = Promise.defer();
    var loaderPrefix = '',
        suffix = '',
        fragmentMatch = resourceId.match(/^([^#]+)(#.+)/),
        isJson = false;

    if(fragmentMatch) {
      loaderPrefix = 'plugins/property!';
      resourceId = fragmentMatch[1];
      suffix += fragmentMatch[2];
    }

    // e.g. player/guest becomes player/guest.json
    // what about resources/items#rock?
    if((/^(player|location|region)/).test(resourceId)) {
      if (!resourceId.endsWith('.json')) {
        resourceId += '.json';
      }
      isJson = true;
      loaderPrefix = 'plugins/vendor/json!';
    }

    // load via the property plugin if the repl.start(prompt, source, eval, useGlobal, ignoreUndefined);d has a fragment identifier
    require([loaderPrefix+resourceId+suffix], function(result){
      defd.resolve(result);
    });
    return defd.promise;
  }

  function resolveObjectProperties(data) {
    if(!assertType(data, 'object')) {
      debug.log("resolveModelData: data not an object:", data);
      throw "resolveModelData: data not an object";
    }

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
      // e.g. { resource: 'foo/bar#bazz' }
      loaderPrefix = 'plugins/property!';
      resourceId = fragmentMatch[1];
      suffix = fragmentMatch[2];
    }

    // load via the property plugin if the resourceId has a fragment identifier
    require([loaderPrefix+resourceId+suffix], function(resourceData){
      debug.log("resource: resolveObjectProperties, require callback for: " +
                loaderPrefix+resourceId+suffix, resourceData, "("+typeof resourceData+")");
      // put the resource data into place
      if(suffix && !('id' in resourceData)) {
        resourceData.id = (suffix.split('#'))[1];
      }
      defd.resolve(resourceData);
    });
    return defd.promise;
  }

  return {
    resolveResource: resolveResource,
    resolveObjectProperties: resolveObjectProperties
  };

});