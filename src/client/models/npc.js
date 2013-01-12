define(['lib/event', 'lib/util', 'models/Actor', 'resources/npc', 'resources/items'], function(Evented, util, Actor, npc, items){

  var Monster = Actor.extend({
    propertiesWithReferences: [].concat(Actor.prototype.propertiesWithReferences),
    declaredClass: "Monster"
  });

  return Monster;
});