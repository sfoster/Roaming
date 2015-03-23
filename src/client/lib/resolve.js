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
    var resourceRefId = resourceId;

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

    console.log('resolve, requiring resource at path: ' + loaderPrefix+resourceId+suffix);
    var promise = new Promise(function(resolve, reject) {
      // load via the property plugin if the repl.start(prompt, source, eval, useGlobal, ignoreUndefined);d has a fragment identifier
      require([loaderPrefix+resourceId+suffix], function(result){
        console.log('resolve, ' + loaderPrefix+resourceId+suffix + ' loaded data: ', result);
        var expandedResult = resolveObjectProperties(result);
        expandedResult.then(function(result) {
          result._resourceId = resourceRefId;
          // console.log('resolveResource, got result: ', result);
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
      var resourceId;
      var resultPromise;
      switch (valueType) {
        case 'object':
        case 'objectish':
          if(value.$resource) {
            resourceId = value.$resource;
            // treat value as a reference: resource: { }
            // TODO: keep track of depth to avoid recursion errors?
            resultPromise = resolveObjectProperties(value).then(function(result) {
              // console.log('walkObject, resolved, ', valueAsString, result);
              result._resourceId = resourceId;
              return result;
            }, function(err) {
              console.warn('walkObject: Error resolving key, value: ', key, value);
              throw err;
            });
          } else {
            resultPromise = walkObject(value).then(null, function(err) {
              console.warn('walkObject: Error resolving key, value: ', key, value);
              throw err;
            });
          }
          break;
        case 'array':
        case 'arraylike':
          var eventualItems = value.map(function(item, idx) {
            if (typeof item == 'object') {
              if(item.$resource) {
                var resourceId = item.$resource;
                // treat item as a reference: resource: { }
                return resolveObjectProperties(item).then(function(result) {
                  // console.log('walkObject, resolved, ', itemAsString, result);
                  result._resourceId = resourceId;
                  return result;
                }, function(err) {
                  console.warn('walkObject: Error resolving key, item: ', key, item);
                  throw err;
                });
              } else {
                return walkObject(item);
              }
            } else {
              return item;
            }
          });
          resultPromise = Promise.all(eventualItems).then(null, function(err) {
            console.warn('walkObject: Error resolving array items: ', err);
          });
          break;
        case 'thenable':
          resultPromise = value;
          break;
        default:
          resultPromise = Promise.resolve(value);
      }
      return resultPromise.then(function(result) {
        return (resolvedData[key] = result);
      });
    });
    return Promise.all(eventualResults).then(function(result) {
      return resolvedData;
    }, function(err) {
      console.warn('walkObject: Error resolving eventualResults: ', err);
    });
  }

  function resolveObjectProperties(data) {
    assertType(data, 'object', 'resolveObjectProperties: data not an object:', data);

    // walk the structure, deferencing as we go
    // FIXME: is it $resource or 'resource' or what?
    var resourceRefId = data.$resource;
    var resourceId = resourceRefId;
    var params = data.params;
    var paramNames;
    if (params) {
      paramNames = Object.keys(params).join(',');
    }
    delete data.params;
    // delete data.$resource;
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
          if (paramNames) {
            resourceData._paramNames = paramNames;
          }
          promisedResult = walkObject(resourceData).then(function(result) {
            resolve(result);
          }, function(err) {
            console.err('resolveObjectProperties: Error attempting to walk object', err);
            reject(err);
          });
        });
      });
    } else {
      // plain value, nothing to resolve at top level, walk it
      promisedResult = walkObject(data);
    }
    return promisedResult.then(function(result) {
      if (params) {
        util.mixin(result, params);
      }
      return result;
    });
  }

  return {
    resolveResource: resolveResource,
    resolveObjectProperties: resolveObjectProperties
  };

});