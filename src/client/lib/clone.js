define(['lib/util'], function(util){
  var reExcludeName = /^(_)|(jQuery\d)/;
  function exclude(name, value){
    return reExcludeName.test(name) || 'function' == typeof value;
  }
  
  function sanitizedClone(obj, clone, excludes){
    var type = util.getType(obj);
    excludes = excludes || {};
    switch(type){
      case 'object' :
      case 'unknown' :
        clone = clone || {};
        // Object.keys omits prototype properties
        Object.keys(obj).forEach(function(name){
          if(name.charAt(0) === '_') {
            // omit _ prefixed props
            return; 
          }
          if(name in excludes || exclude(name, obj[name]) ) {
            return;
          }
          clone[name] = sanitizedClone(obj[name]);
        });
        return clone;
      case 'array' :
        clone = clone || [];
        obj.forEach(function(val, idx){
          if(!exclude(idx, val)){
            clone.push( sanitizedClone(val) );
          }
        });
        return clone;
      case 'null'   :
      case 'number' :
      case 'string' :
      case 'date'   :
        return obj; // copy by value
    }
  }
  
  return sanitizedClone;
});