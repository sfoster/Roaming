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
    weaponclass: mediumrange,
    weight: 2,
    mpbonus: 0
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
   weapons.holyKnife = {
    name: ' Holy Knife',
    shortRangeDamage: 5,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: shortrange,
    weight: 1,
    mpbonus: 3
  };
  weapons.holyBowandArrow = {
    name: ' Holy Bow',
    shortRangeDamage: 3,
    longRangeDamage: 10,
    mediumRangeDamage: 15,
    ammo: 15,
    weaponclass: longrange,
    weight: 1,
    mpbonus: 3
  };
  weapons.holyFishingspear = {
    name: ' Holy Fishing Spear',
    shortRangeDamage: 1,
    longRangeDamage:0,
    mediumRangeDamage: 10,
    weaponclass: mediumrange,
    weight: 2,
    mpbonus: 3
  };
 weapons.holyThrowingknife = {
    name: ' Holy Throwing Knife',
    shortRangeDamage: 3,
    longRangeDamage: 0,
    mediumRangeDamage: 5,
    ammo: 5,
    weaponclass: longrange,
    weight: 2,
    mpbonus: 3
  };
   weapons.holyTrident = {
    name: 'Holy Trident',
    shortRangeDamage: 1,
    longRangeDamage: 0,
    mediumRangeDamage: 25,
    weaponclass: mediumrange,
    weight: 8,
    mpbonus: 3
  };
   weapons.holyJavelin = {
    name: 'Holy Javelin',
    shortRangeDamage: 7,
    longRangeDamage: 15,
    mediumRangeDamage: 10,
    ammo: 3,
    weaponclass: longrange,
    weight: 3,
    mpbonus: 3
  };
  weapons.holySpear = {
    name: 'Holy Spear',
    shortRangeDamage: 1,
    longRangeDamage: 0,
    mediumRangeDamage: 15,
    weaponclass: mediumrange,
    weight: 4,
    mpbonus: 3
  };
   weapons.holySword = {
    name: 'Holy Sword',
    shortRangeDamage: 20,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: shortrange,
    weight: 4,
    mpbonus: 3
  };
  weapons.holySling = {
    name: 'Holy Sling',
    shortRangeDamage: 5,
    longRangeDamage: 6,
    mediumRangeDamage: 7,
    ammo: 20,
    weaponclass: longrange,
    weight: 1,
    mpbonus: 3
    };
     weapons.holyStick = {
    name: 'Holy Stick',
    shortRangeDamage: 2,
    longRangeDamage: 0,
    mediumRangeDamage: 1,
    weaponclass: shortrange,
    weight: 2,
    mpbonus: 3
  };
 weapons.holyClub = {
    name: 'Holy Club',
    shortRangeDamage: 6,
    longRangeDamage: 0,
    mediumRangeDamage: 1,
    weaponclass: shortrange,
    weight: 5,
    mpbonus: 3
  };
 weapons.holyMace = {
    name: 'Holy Mace',
    shortRangeDamage: 15,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: shortrange,
    weight: 7,
    mpbonus: 3
  };
  weapons.holyMorningstar = {
    name: 'Holy Morningstar',
    shortRangeDamage: 30,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: shortrange,
    weight: 10,
    mpbonus: 3
  };
  weapons.holyLongbowandArrow = {
    name: 'Holy Longbow',
    shortRangeDamage: 4,
    longRangeDamage: 15,
    mediumRangeDamage: 20,
    ammo: 15,
    weaponclass: longrange,
    weight: 1,
    mpbonus: 3
  };
   weapons.holyShortsword = {
    name: 'Holy Shortsword',
    shortRangeDamage: 15,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: shortrange,
    weight: 2,
    mpbonus: 3
  };
  weapons.holyLongsword = {
    name: 'Holy Longsword',
    shortRangeDamage: 25,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: shortrange,
    weight: 6,
    mpbonus: 3
  };
  weapons.holyBroadsword = {
    name: 'Holy Broadsword',
    shortRangeDamage: 30,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: shortrange,
    weight: 7,
    mpbonus: 3
  };
  weapons.holyDagger = {
    name: 'Holy Dagger',
    shortRangeDamage: 7,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: shortrange,
    weight: 1,
    mpbonus: 3
  };
  weapons.holyHatchet = {
    name: 'Holy Hatchet',
    shortRangeDamage: 7,
    longRangeDamage: 0,
    mediumRangeDamage: 3,
    weaponclass: shortrange,
    weight: 4,
    mpbonus: 3
  };
  weapons.holyAxe = {
    name: 'Holy Axe',
    shortRangeDamage: 14,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: shortrange,
    weight: 5,
    mpbonus: 3
  };
  weapons.holyThrowingaxe = {
    name: 'Holy Throwing Axe',
    shortRangeDamage: 4,
    longRangeDamage: 0,
    mediumRangeDamage: 6,
    ammo: 5,
    weaponclass: longrange,
    weight: 4,
    mpbonus: 3
  };
  weapons.holyBattleaxe = {
    name: 'Holy Battleaxe',
    shortRangeDamage: 25,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: shortrange,
    weight: 7,
    mpbonus: 3
  };
 weapons.holyKatana = {
    name: 'Holy Katana',
    shortRangeDamage: 20,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: shortrange,
    weight: 4,
    mpbonus: 3
  };
  weapons.holyNinja_to = {
    name: 'Ninja-to',
    shortRangeDamage: 15,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: shortrange,
    weight: 3,
    mpbonus: 0
  };
  weapons.holyThrowingstars = {
    name: 'Holy Throwing Stars',
    shortRangeDamage: 5,
    longRangeDamage: 5,
    mediumRangeDamage: 10,
    ammo: 10,
    weaponclass: longrange,
    weight: 2,
    mpbonus: 3
  };
   weapons.holyStaff = {
    name: 'Holy Staff',
    shortRangeDamage: 6,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: shortrange,
    weight: 3,
    mpbonus: 8
  };
   weapons.holySabre = {
    name: 'Holy Sabre',
    shortRangeDamage: 15,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: shortrange,
    weight: 3,
    mpbonus: 3
  };
  return weapons;
});