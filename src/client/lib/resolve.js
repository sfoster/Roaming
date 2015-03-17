/* jslint browser: true */
/* globals console, define, require */
'use strict';

define([
  // DOM promise - might need to polyfill?
  'lib/util'
], function(util){

  var DEBUG = false;
  var debug = {
    log: DEBUG ? console.log.bind(console, 'resource') : function() {}
  };

  function wrapAsPromise(value) {
    // TODO: should be: return Promise.resolve(value);
    var promise = new window.Promise(function(resolve, reject) {
      window.setTimeout(function(){
        resolve(value);
      }, 0);
    });
    return promise;
  }

  function assertType(thing, type, details) {
    if (typeof thing !== type) {
      var message = 'Type mismatch, expected ' + type + ', got: ' + typeof thing;
      if (arguments.length >= 2) {
        var slice = Array.prototype.slice;
        var logArgs = [message].concat(slice.call(arguments, 2));
        console.log.apply(console, logArgs);
      }
      throw new Error(message);
    }
  }

  /*
   * returns Promise
   */
  function resolveResource(resourceId) {
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

    var promise = new Promise(function(resolve, reject) {
      // load via the property plugin if the repl.start(prompt, source, eval, useGlobal, ignoreUndefined);d has a fragment identifier
      require([loaderPrefix+resourceId+suffix], function(result){
        console.log('resolve, ' + loaderPrefix+resourceId+suffix + ' loaded data: ', JSON.stringify(result, null, 2));
        var expandedResult = resolveObjectProperties(result);
        expandedResult.$resource = resourceId;
        expandedResult.then(function(result) {
          console.log('resolveResource, got result: ', result);
          resolve(result);
        }, function(err) {
          console.warn('resolveResource, got error: ', err);
          reject(err);
        });
      });

    });
    return promise;
  }


  function walkObject(resourceData) {
    // return Promise
    var resolvedData = {};
    var eventualResults = Object.keys(resourceData).map(function(key) {
      var value = resourceData[key];
      var valueType = util.getType(value);
      console.log('walkObject, ', value, key, valueType);
      switch (valueType) {
        case 'object':
        case 'objectish':
          if(value.$resource) {
            // treat value as a reference: resource: { }
            // TODO: keep track of depth to avoid recursion errors?
            return resolveObjectProperties(value).then(function(result) {
              resolvedData[key] = result;
            }, function(err) {
              console.warn('walkObject: Error resolving key, value: ', key, value);
              throw err;
            });
          } else {
            return walkObject(value).then(function(result) {
              resolvedData[key] = result;
            }, function(err) {
              console.warn('walkObject: Error resolving key, value: ', key, value);
              throw err;
            });
          }
          break;
        case 'array':
        case 'arraylike':
          resolvedData[key] = [];
          var eventualItems = value.map(function(item, idx) {
            if ('object' == typeof item) {
              if('$resource' in item) {
                return resolveObjectProperties(item).then(function(result) {
                  resolvedData[key][idx] = result;
                });
              } else {
                return walkObject(item);
              }
            }
            return item;
          });
          return Promise.all(eventualItems);
        case 'thenable':
          value.then(function(result) {
            resolvedData[key] = result;
          });
          return value;
        default:
          resolvedData[key] = value;
          return value;
      }
    });
    return Promise.all(eventualResults).then(function() {
      return resolvedData;
    });
  }

  function resolveObjectProperties(data) {
    assertType(data, 'object', 'resolveObjectProperties: data not an object:', data);

    // walk the structure, deferencing as we go
    // FIXME: is it $resource or 'resource' or what?
    var resourceId = data.$resource;
    var params = data.params;
    delete data.params;
    delete data.$resource;
    var resourceData;
    var promisedResult;
    if(resourceId) {
      promisedResult = new Promise(function(resolve, reject) {
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
          walkObject(resourceData).then(function(result) {
            if (params) {
              util.mixin(result, params);
            }
            result.$resource = resourceId;
            resolve(result);
          }, function(err) {
            console.err('resolveObjectProperties: Error attempting to walk object', err);
            reject(err);
          });
        });
      });
    } else {
      // plain value, nothing to resolve
      promisedResult = walkObject(data);
    }

    return promisedResult;
  }

  return {
    resolveResource: resolveResource,
    resolveObjectProperties: resolveObjectProperties
  };

});