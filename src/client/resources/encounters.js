define(['lib/util', 'lib/event', 'resources/npc'], function(util, Evented, npc){
  var mixin = util.mixin; 
  var range = function(lbound, ubound){
    var num = Math.round(lbound + Math.random() * (ubound-lbound));
    return num;
  };
  
  var Encounter = function(args){
    mixin(this, args || {});
  };
  
  Encounter.extend = util.extend;
  
  mixin(Encounter.prototype, {
    enter: function(location, player, world){ },
    exit: function(location, player, world){ },
    update: function(location, player, world){ }
  });
  
  NPCEncounter = Encounter.extend({
    enter: function(location, player, world){
      // get the terrain type from the location
      var terrain = location.type;
      // console.log("NPCEncounter entering terrain: " +  terrain);
      // get the subset of NPCs that exist in this terrain
      var npcs = util.values(npc).filter(function(npc){
        return (
          npc.hp < 100 &&
          npc.terrain && npc.terrain.indexOf(terrain) > -1
        );
      });
      // console.log("available NPCs", npcs);
      // a random number of npcs
      var howMany = range(1, 2), 
          hereCreatures = [];
      // add them to the location

      for(var i=0, idx; i<howMany; i++){
        idx = range(0,npcs.length-1);
        // console.log("creature index: ", idx, npcs[idx]);
        hereCreatures.push( npcs[idx] );
      }
      // console.log("added creatures: ", hereCreatures);
      if(howMany){
        location.here = location.here.concat(hereCreatures);
        Evented.emit('encounterstart', { target: this });
      }
    },
    exit: function(){
      Evented.emit('encounterend', { target: this });
    }
  });
  
  var encounters = {};
  encounters.npc = new NPCEncounter({
    description: 'Oh oh, you run smack into trouble.'
  });
  
  encounters.beginning = new Encounter({
    firstVisit: [
      'Your adventure starts here',
      'You dont quite know what you need to do, but you seem to be on the right track'
    ],
    reVisit: ['Your adventure started here. You have a long way to go still']
  });

  return encounters;
});