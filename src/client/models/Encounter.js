define([
  'lib/util'
 ], function(util){

  var mixin = util.mixin;
  var Encounter = function(args){
    util.prepareModel(this, args || {});
    console.log("Encounter: ", this.name, this.type, this._id);
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