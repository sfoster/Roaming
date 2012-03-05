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
    name: 'Bow',
    shortRangeDamage: 3,
    longRangeDamage: 10,
    mediumRangeDamage: 15
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
    shortRangeDamage: 20,
    longRangeDamage: 0,
    mediumRangeDamage: 0
  };
  weapons.sling = {
    name: 'Sling',
    shortRangeDamage: 5,
    longRangeDamage: 6,
    mediumRangeDamage: 7
  };
  weapons.stick = {
    name: 'Stick',
    shortRangeDamage: 2,
    longRangeDamage: 0,
    mediumRangeDamage: 1
  };
  weapons.club = {
    name: 'Club',
    shortRangeDamage: 6,
    longRangeDamage: 0,
    mediumRangeDamage: 1
  };
  weapons.mace = {
    name: 'Mace',
    shortRangeDamage: 15,
    longRangeDamage: 0,
    mediumRangeDamage: 0
  };
weapons.morningstar = {
    name: 'Morningstar',
    shortRangeDamage: 30,
    longRangeDamage: 0,
    mediumRangeDamage: 0
  };  
  weapons.longbowAndarrow = {
    name: 'Longbow',
    shortRangeDamage: 4,
    longRangeDamage: 15,
    mediumRangeDamage: 20
  };  
  weapons.shortsword = {
    name: 'Shortsword',
    shortRangeDamage: 15,
    longRangeDamage: 0,
    mediumRangeDamage: 0
  };  
  weapons.longsword = {
    name: 'Longsword',
    shortRangeDamage: 25,
    longRangeDamage: 0,
    mediumRangeDamage: 0
  };
  weapons.broadsword = {
    name: 'Broadsword',
    shortRangeDamage: 30,
    longRangeDamage: 0,
    mediumRangeDamage: 0
  };
  weapons.dagger = {
    name: 'Dagger',
    shortRangeDamage: 7,
    longRangeDamage: 0,
    mediumRangeDamage: 0
  };
weapons.hatchet = {
    name: 'Hatchet',
    shortRangeDamage: 7,
    longRangeDamage: 0,
    mediumRangeDamage: 3
  };
  weapons.Axe = {
    name: 'Axe',
    shortRangeDamage: 14,
    longRangeDamage: 0,
    mediumRangeDamage: 0
  };
  weapons.throwingAxe = {
    name: 'Throwing Axe',
    shortRangeDamage: 4,
    longRangeDamage: 0,
    mediumRangeDamage: 6
  };
  weapons.battleaxe = {
    name: 'Battleaxe',
    shortRangeDamage: 25,
    longRangeDamage: 0,
    mediumRangeDamage: 0
  };
  return weapons;
});