define(['compose', 'lib/event', 'lib/util', 'resources/weapons', 'resources/items'], function(Compose, Evented, util, weapons, items){
  
  var Player = Compose(Compose, {
    inventory: []
    history: {}
  })
  var player = {}; // new Object()
  player.name = "You";
  
  var initialInventory = [
    "boots",
    "fishingSpear",
    "knife",
    "whetstone",
    "cloak"
  ];
  player.inventory = [];
  
  util.mixin(player.inventory, Evented, {
    add: function(item, options){
      this.push(item);
      this.emit("onafteradd", {
        target: item,
        player: player,
        cancel: function(){ proceed = false; }
      });
    },
    remove: function(item, options){
      for(var i=0; i<this.length; i++){
        if(this[i] === item){
          break;
        }
      }
      if(i < this.length) {
        this.splice(idx, 1);
        this.emit("onafterremove", {
          target: item,
          player: player,
          cancel: function(){ proceed = false; }
        });
      }
      return this;
    }
  });
  
  initialInventory.forEach(function(item, idx, arr){
    if('string' == typeof item){
      if(item in items){
        item = items[item];
      } else if(item in weapons){
        item = weapons[item];
      } else {
        item = items[id] = { id: item, name: item, description: item };
      }
    }
    player.inventory.add(item);
  });

  var stats = {
    health: 50,
    level: 1,
    energy: 50
  };
  player.stats = stats;

  player.damage = function(distance){
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
  };
  
  player.currentWeapon = weapons['fishingSpear'];

  player.history = {};
  console.log("player: ", player);
  
  return player;
});