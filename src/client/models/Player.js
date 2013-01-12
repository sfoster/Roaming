define([
  'compose', 'lib/event', 'lib/util', 'models/Inventory', 'models/Actor', 'resources/weapons'
], function(Compose, Evented, util, Inventory, Actor, weapons){
  
  var Player = Actor.extend({

    propertiesWithReferences: [].concat(Actor.prototype.propertiesWithReferences),

    declaredClass: "Player",
    name: "You", // by default
    level: 0,
    currentWeapon: 'fishingSpear', // by default
    history: {},
    score: 0,
    stats: {
      health: 50,
      level: 1,
      energy: 50
    },
    visits: null,
    damage: function(distance){
      var level = this.level;
      var weapon = this.currentWeapon; 
      var damage = 1;

      // shortRangeDamage: 3,
      // longRangeDamage: 0,
      // mediumRangeDamage: 5

      if(distance < 5) {
        damage = damage + weapon.shortRangeDamage; 
      } else if(distance < 15){
        damage = damage + weapon.mediumRangeDamage; 
      } if(distance < 200){
        damage = damage + weapon.longRangeDamage; 
      } else {
        damage = 0; // too far!
      }
      return damage;
    }
  }, function(args){
    console.log("Player ctor, got args", args);
  });

  // TODO: needs to live elsewhere, 
  // probably in main/startup as the inventory args to the Player constructor
  Player.initialInventory = [
    "boots",
    "fishingSpear",
    "knife",
    "whetstone",
    "cloak"
  ];

  return Player;
});