define([], function(){
  
  var weapons = {};
  var weaponClasses = {};
  
  weapons.knife = {
    name: 'Knife',
    shortRangeDamage: 5,
    longRangeDamage: 0,
    mediumRangeDamage: 0
  };

  weapons.bowAndArrow = {
    name: 'Bow and Arrow',
    shortRangeDamage: 1,
    longRangeDamage: 5,
    mediumRangeDamage: 7
  };

  weapons.fishingSpear = {
    name: 'Fishing Spear',
    shortRangeDamage: 1,
    longRangeDamage:0,
    mediumRangeDamage: 10
  };
  
  weapons.throwingKnife = {
    name: 'Throwing Knife',
    shortRangeDamage: 3,
    longRangeDamage: 0,
    mediumRangeDamage: 5
  };
  weapons.trident = {
    name: 'Trident',
    shortRangeDamage: 1,
    longRangeDamage: 0,
    mediumRangeDamage: 25
  };
  weapons.javelin = {
    name: 'Javelin',
    shortRangeDamage: 7,
    longRangeDamage: 15,
    mediumRangeDamage: 10
  };
  
  weapons.spear = {
    name: 'Spear',
    shortRangeDamage: 1,
    longRangeDamage: 0,
    mediumRangeDamage: 15
  };
  weapons.sword = {
    name: 'Sword',
    shortRangeDamage: 25,
    longRangeDamage: 0,
    mediumRangeDamage: 0
  };
  
  
  
  
  
  
  return weapons;
});