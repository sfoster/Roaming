define([], function(){
  
  var weapons = {};
  var weaponClasses = {};
  
  weapons.knife = {
    name: 'Knife',
    shortRangeDamage: 5,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange"
  };

  weapons.bowAndArrow = {
    name: 'Bow',
    shortRangeDamage: 3,
    longRangeDamage: 10,
    mediumRangeDamage: 15,
    ammo: 15,
    weaponclass: "longrange"
  };

  weapons.fishingSpear = {
    name: 'Fishing Spear',
    shortRangeDamage: 1,
    longRangeDamage:0,
    mediumRangeDamage: 10,
    weaponclass: "mediumrange"
  };
  
  weapons.throwingKnife = {
    name: 'Throwing Knife',
    shortRangeDamage: 3,
    longRangeDamage: 0,
    mediumRangeDamage: 5,
    ammo: 5,
    weaponclass: "longrange"
  };
  weapons.trident = {
    name: 'Trident',
    shortRangeDamage: 1,
    longRangeDamage: 0,
    mediumRangeDamage: 25,
    weaponclass: "mediumrange"
  };
  weapons.javelin = {
    name: 'Javelin',
    shortRangeDamage: 7,
    longRangeDamage: 15,
    mediumRangeDamage: 10,
    ammo: 3,
    weaponclass: "longrange"
  };
  
  weapons.spear = {
    name: 'Spear',
    shortRangeDamage: 1,
    longRangeDamage: 0,
    mediumRangeDamage: 15,
    weaponclass: "mediumrange"
  };
  weapons.sword = {
    name: 'Sword',
    shortRangeDamage: 20,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange"
  };
  weapons.sling = {
    name: 'Sling',
    shortRangeDamage: 5,
    longRangeDamage: 6,
    mediumRangeDamage: 7,
    ammo: 20,
    weaponclass: "longrange"
    };
  weapons.stick = {
    name: 'Stick',
    shortRangeDamage: 2,
    longRangeDamage: 0,
    mediumRangeDamage: 1,
    weaponclass: "shortrange"
  };
  weapons.club = {
    name: 'Club',
    shortRangeDamage: 6,
    longRangeDamage: 0,
    mediumRangeDamage: 1,
    weaponclass: "shortrange"
  };
  weapons.mace = {
    name: 'Mace',
    shortRangeDamage: 15,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange"
  };
weapons.morningstar = {
    name: 'Morningstar',
    shortRangeDamage: 30,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange"
  };  
  weapons.longbowAndarrow = {
    name: 'Longbow',
    shortRangeDamage: 4,
    longRangeDamage: 15,
    mediumRangeDamage: 20,
    ammo: 15,
    weaponclass: "longrange"
  };   
  weapons.shortsword = {
    name: 'Shortsword',
    shortRangeDamage: 15,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange"
  };  
  weapons.longsword = {
    name: 'Longsword',
    shortRangeDamage: 25,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange"
  };
  weapons.broadsword = {
    name: 'Broadsword',
    shortRangeDamage: 30,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange"
  };
  weapons.dagger = {
    name: 'Dagger',
    shortRangeDamage: 7,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange"
  };
weapons.hatchet = {
    name: 'Hatchet',
    shortRangeDamage: 7,
    longRangeDamage: 0,
    mediumRangeDamage: 3,
    weaponclass: "shortrange"
  };
  weapons.Axe = {
    name: 'Axe',
    shortRangeDamage: 14,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange"
  };
  weapons.throwingAxe = {
    name: 'Throwing Axe',
    shortRangeDamage: 4,
    longRangeDamage: 0,
    mediumRangeDamage: 6,
    ammo: 5,
    weaponclass: "longrange"
  };
  weapons.battleaxe = {
    name: 'Battleaxe',
    shortRangeDamage: 25,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange"
  };
 weapons.katana = {
    name: 'Katana',
    shortRangeDamage: 20,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange"
  };
  weapons.ninja_to = {
    name: 'Ninja-to',
    shortRangeDamage: 15,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange"
  };
  weapons.throwingStars = {
    name: 'Throwing Stars',
    shortRangeDamage: 5,
    longRangeDamage: 5,
    mediumRangeDamage: 10,
    ammo: 10,
    weaponclass: "longrange"
  };
   weapons.staff = {
    name: 'Staff',
    shortRangeDamage: 6,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange"
  };
  return weapons;
});