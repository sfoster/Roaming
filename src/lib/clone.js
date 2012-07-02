define(['lib/util'], function(util){
  var reExcludeName = /^(_)|(jQuery\d)/;
  function exclude(name, value){
    return reExcludeName.test(name) || 'function' == typeof value;
  }
  
  function sanitizedClone(obj, clone){
    var type = util.getType(obj);
    switch(type){
      case 'object' :
      case 'unknown' :
        clone = clone || {};
        Object.keys(obj).forEach(function(name){
          if(! exclude(name, obj[name]) ) {
            clone[name] = sanitizedClone(obj[name]);
          }
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