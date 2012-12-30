define([
  'compose', 'lib/event', 'lib/util', 'models/Inventory', 'resources/weapons'
], function(Compose, Evented, util, Inventory, weapons){
  
  var Player = Compose(Compose, {

    propertiesWithReferences: ['inventory'],

    name: "You", // by default
    inventory: null,
    level: 0,
    currentWeapon: 'fishingSpear', // by default
    history: {},
    equipped: {},
    stats: {
      health: 50,
      level: 1,
      energy: 50
    },
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
  }, function(){
    // constructor
    // create the player's inventory
    var inventory = this.inventory = Inventory.resolve(this.inventory || []);
    var equipped = this.equipped;
    var weaponId = this.currentWeapon.id || this.currentWeapon;

    inventory.forEach(function(item){
      if(weaponId && weaponId == item.id) {
        this.currentWeapon = item;
        equipped[item.id] = true;
      }
      item.isEquipped = !!equipped[item.id];
    }, this);

    if(this.currentWeapon && typeof this.currentWeapon === "string") {
      this.currentWeapon = weapons[this.currentWeapon];
    }
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