define([
  'compose', 'lib/util', 'models/Item', 'resources/weapons'
], function(Compose, util, Item, weapons){

  var Weapon = Item.extend({
    propertiesWithReferences: [].concat(Item.prototype.propertiesWithReferences),

    declaredClass: "Weapon",
    type: "weapon",
    damage: 0,
    range: 0,
    equipped: false
  }, function(args){
    console.log("Weapon ctor, got args", args);
  });
