define([
  'compose', 'lib/util', 'models/Actor', 'resources/npc', 'resources/items'
], function(Compose, util, Actor, npc, items){

  var Npc = Actor.extend({
    propertiesWithReferences: [].concat(Actor.prototype.propertiesWithReferences),
    declaredClass: "Npc",
    type: "npc",
    icon: "./resources/graphics/BaddieIcon.png"
  });

  return Npc;
});