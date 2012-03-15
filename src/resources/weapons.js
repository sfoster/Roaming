define([], function(){
  
  var weapons = {};
  var weaponClasses = {};
  
  weapons.knife = {
    name: 'Knife',
    shortRangeDamage: 5,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: shortrange,
    weight: 1,
    mpbonus: 0
  };

  weapons.bowAndArrow = {
    name: 'Bow',
    shortRangeDamage: 3,
    longRangeDamage: 10,
    mediumRangeDamage: 15,
    ammo: 15,
    weaponclass: longrange,
    weight: 1,
    mpbonus: 0
  };

  weapons.fishingSpear = {
    name: 'Fishing Spear',
    shortRangeDamage: 1,
    longRangeDamage:0,
    mediumRangeDamage: 10,
    weaponclass: mediumrange
  };
  
  weapons.throwingKnife = {
    name: 'Throwing Knife',
    shortRangeDamage: 3,
    longRangeDamage: 0,
    mediumRangeDamage: 5,
    ammo: 5,
    weaponclass: longrange,
    weight: 2,
    mpbonus: 0
  };
  weapons.trident = {
    name: 'Trident',
    shortRangeDamage: 1,
    longRangeDamage: 0,
    mediumRangeDamage: 25,
    weaponclass: mediumrange,
    weight: 8,
    mpbonus: 0
  };
  weapons.javelin = {
    name: 'Javelin',
    shortRangeDamage: 7,
    longRangeDamage: 15,
    mediumRangeDamage: 10,
    ammo: 3,
    weaponclass: longrange,
    weight: 3,
    mpbonus: 0
  };
  
  weapons.spear = {
    name: 'Spear',
    shortRangeDamage: 1,
    longRangeDamage: 0,
    mediumRangeDamage: 15,
    weaponclass: mediumrange,
    weight: 4,
    mpbonus: 0
  };
  weapons.sword = {
    name: 'Sword',
    shortRangeDamage: 20,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: shortrange,
    weight: 4,
    mpbonus: 0
  };
  weapons.sling = {
    name: 'Sling',
    shortRangeDamage: 5,
    longRangeDamage: 6,
    mediumRangeDamage: 7,
    ammo: 20,
    weaponclass: longrange,
    weight: 1,
    mpbonus: 0
    };
  weapons.stick = {
    name: 'Stick',
    shortRangeDamage: 2,
    longRangeDamage: 0,
    mediumRangeDamage: 1,
    weaponclass: shortrange,
    weight: 2,
    mpbonus: 0
  };
  weapons.club = {
    name: 'Club',
    shortRangeDamage: 6,
    longRangeDamage: 0,
    mediumRangeDamage: 1,
    weaponclass: shortrange,
    weight: 5,
    mpbonus: 0
  };
  weapons.mace = {
    name: 'Mace',
    shortRangeDamage: 15,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: shortrange,
    weight: 7,
    mpbonus: 0
  };
weapons.morningstar = {
    name: 'Morningstar',
    shortRangeDamage: 30,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: shortrange,
    weight: 10,
    mpbonus: 0
  };  
  weapons.longbowAndarrow = {
    name: 'Longbow',
    shortRangeDamage: 4,
    longRangeDamage: 15,
    mediumRangeDamage: 20,
    ammo: 15,
    weaponclass: longrange,
    weight: 1,
    mpbonus: 0
  };   
  weapons.shortsword = {
    name: 'Shortsword',
    shortRangeDamage: 15,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: shortrange,
    weight: 2,
    mpbonus: 0
  };  
  weapons.longsword = {
    name: 'Longsword',
    shortRangeDamage: 25,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: shortrange,
    weight: 6,
    mpbonus: 0
  };
  weapons.broadsword = {
    name: 'Broadsword',
    shortRangeDamage: 30,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: shortrange,
    weight: 7,
    mpbonus: 0
  };
  weapons.dagger = {
    name: 'Dagger',
    shortRangeDamage: 7,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: shortrange,
    weight: 1,
    mpbonus: 0
  };
weapons.hatchet = {
    name: 'Hatchet',
    shortRangeDamage: 7,
    longRangeDamage: 0,
    mediumRangeDamage: 3,
    weaponclass: shortrange,
    weight: 4,
    mpbonus: 0
  };
  weapons.Axe = {
    name: 'Axe',
    shortRangeDamage: 14,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: shortrange,
    weight: 5,
    mpbonus: 0
  };
  weapons.throwingAxe = {
    name: 'Throwing Axe',
    shortRangeDamage: 4,
    longRangeDamage: 0,
    mediumRangeDamage: 6,
    ammo: 5,
    weaponclass: longrange,
    weight: 4,
    mpbonus: 0
  };
  weapons.battleaxe = {
    name: 'Battleaxe',
    shortRangeDamage: 25,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: shortrange,
    weight: 7,
    mpbonus: 0
  };
 weapons.katana = {
    name: 'Katana',
    shortRangeDamage: 20,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: shortrange,
    weight: 4,
    mpbonus: 0
  };
  weapons.ninja_to = {
    name: 'Ninja-to',
    shortRangeDamage: 15,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: shortrange,
    weight: 3,
    mpbonus: 0
  };
  weapons.throwingStars = {
    name: 'Throwing Stars',
    shortRangeDamage: 5,
    longRangeDamage: 5,
    mediumRangeDamage: 10,
    ammo: 10,
    weaponclass: longrange,
    weight: 2,
    mpbonus: 0
  };
   weapons.staff = {
    name: 'Staff',
    shortRangeDamage: 6,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: shortrange,
    weight: 3,
    mpbonus: 5
  };
   weapons.sabre = {
    name: 'Sabre',
    shortRangeDamage: 15,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: shortrange,
    weight: 3,
    mpbonus: 0
  };
  return weapons;
});