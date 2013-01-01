define([
  'lib/util'
 ], function(util){

  var mixin = util.mixin; 
  var Encounter = function(args){
    console.log("Encounter ctor:", args);
    mixin(this, args || {});
  };
  
  Encounter.extend = util.extend;
  
  mixin(Encounter.prototype, {
    enter: function(location, player, world){ },
    exit: function(location, player, world){ },
    update: function(location, player, world){ },
    export: function(){
      var cleanData = sanitizedClone(this, {}, { 
        type: true,
        regionId: true
      });
      return cleanData;
    }
  });

  return Encounter;
});