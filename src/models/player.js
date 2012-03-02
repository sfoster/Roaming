define(['resources/weapons'], function(weapons){
  
  var player = {}; // new Object()

  player.name = "You";
  
  player.inventory = [
    "boots",
    "fishing spear",
    "hunting knife",
    "cloak"
  ];
  
  var stats = {
    health: 50,
    level: 1,
    energy: 50,
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
  
  return player
});