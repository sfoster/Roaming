define([], function(){
  
  var weapons = {};
  var weaponClasses = {};
  
  weapons.knife = {
    name: 'Knife',
    shortRangeDamage: 5/100,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 1,
    mpbonus: 0
  };

  weapons.bowAndArrow = {
    name: 'Bow',
    shortRangeDamage: 3/100,
    longRangeDamage: 10/100,
    mediumRangeDamage: 15/100,
    ammo: 15,
    weaponclass: "longrange",
    weight: 1,
    mpbonus: 0
  };

  weapons.fishingSpear = {
    name: 'Fishing Spear',
    shortRangeDamage: 1/100,
    longRangeDamage:0,
    mediumRangeDamage: 10/100,
    weaponclass: "mediumrange",
    weight: 2,
    mpbonus: 0
  };
  
  weapons.throwingKnife = {
    name: 'Throwing Knife',
    shortRangeDamage: 3/100,
    longRangeDamage: 0,
    mediumRangeDamage: 5/100,
    ammo: 5,
    weaponclass: "longrange",
    weight: 2,
    mpbonus: 0
  };
  weapons.trident = {
    name: 'Trident',
    shortRangeDamage: 1/100,
    longRangeDamage: 0,
    mediumRangeDamage: 25/100,
    weaponclass: "mediumrange",
    weight: 8,
    mpbonus: 0
  };
  weapons.javelin = {
    name: 'Javelin',
    shortRangeDamage: 7/00,
    longRangeDamage: 15/100,
    mediumRangeDamage: 10/100,
    ammo: 3,
    weaponclass: "longrange",
    weight: 3,
    mpbonus: 0
  };
  
  weapons.spear = {
    name: 'Spear',
    shortRangeDamage: 1/100,
    longRangeDamage: 0,
    mediumRangeDamage: 15/100,
    weaponclass: "mediumrange",
    weight: 4,
    mpbonus: 0
  };
  weapons.sword = {
    name: 'Sword',
    shortRangeDamage: 20/100,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 4,
    mpbonus: 0
  };
  weapons.sling = {
    name: 'Sling',
    shortRangeDamage: 5/100,
    longRangeDamage: 6/100,
    mediumRangeDamage: 7/100,
    ammo: 20,
    weaponclass: "longrange",
    weight: 1,
    mpbonus: 0
    };
  weapons.stick = {
    name: 'Stick',
    shortRangeDamage: 2/100,
    longRangeDamage: 0,
    mediumRangeDamage: 1/100,
    weaponclass: "shortrange",
    weight: 2,
    mpbonus: 0
  };
  weapons.club = {
    name: 'Club',
    shortRangeDamage: 6/100,
    longRangeDamage: 0,
    mediumRangeDamage: 1/100,
    weaponclass: "shortrange",
    weight: 5,
    mpbonus: 0
  };
  weapons.mace = {
    name: 'Mace',
    shortRangeDamage: 15/100,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 7,
    mpbonus: 0
  };
  weapons.morningstar = {
    name: 'Morningstar',
    shortRangeDamage: 30/100,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 10,
    mpbonus: 0
  };  
  weapons.longbowAndarrow = {
    name: 'Longbow',
    shortRangeDamage: 4/100,
    longRangeDamage: 15/100,
    mediumRangeDamage: 20/100,
    ammo: 15,
    weaponclass: "longrange",
    weight: 1,
    mpbonus: 0
  };   
  weapons.shortsword = {
    name: 'Shortsword',
    shortRangeDamage: 15/100,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 2,
    mpbonus: 0
  };  
  weapons.longsword = {
    name: 'Longsword',
    shortRangeDamage: 25/100,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 6,
    mpbonus: 0
  };
  weapons.broadsword = {
    name: 'Broadsword',
    shortRangeDamage: 30/100,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 7,
    mpbonus: 0
  };
  weapons.dagger = {
    name: 'Dagger',
    shortRangeDamage: 7/100,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 1,
    mpbonus: 0
  };
  weapons.hatchet = {
    name: 'Hatchet',
    shortRangeDamage: 7/100,
    longRangeDamage: 0,
    mediumRangeDamage: 3/100,
    weaponclass: "shortrange",
    weight: 4,
    mpbonus: 0
  };
  weapons.Axe = {
    name: 'Axe',
    shortRangeDamage: 14/100,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 5,
    mpbonus: 0
  };
  weapons.throwingAxe = {
    name: 'Throwing Axe',
    shortRangeDamage: 4/100,
    longRangeDamage: 0,
    mediumRangeDamage: 6/100,
    ammo: 5,
    weaponclass: "longrange",
    weight: 4,
    mpbonus: 0
  };
  weapons.battleaxe = {
    name: 'Battleaxe',
    shortRangeDamage: 25/100,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 7,
    mpbonus: 0
  };
 weapons.katana = {
    name: 'Katana',
    shortRangeDamage: 20/100,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 4,
    mpbonus: 0
  };
  weapons.ninja_to = {
    name: 'Ninja-to',
    shortRangeDamage: 15/100,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 3,
    mpbonus: 0
  };
  weapons.throwingStars = {
    name: 'Throwing Stars',
    shortRangeDamage: 5/100,
    longRangeDamage: 5/100,
    mediumRangeDamage: 10/100,
    ammo: 10,
    weaponclass: "longrange",
    weight: 2,
    mpbonus: 0
  };
   weapons.staff = {
    name: 'Staff',
    shortRangeDamage: 6/100,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 3,
    mpbonus: 5
  };
   weapons.sabre = {
    name: 'Sabre',
    shortRangeDamage: 15/100,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 3,
    mpbonus: 0
  };
   weapons.hammer = {
    name: 'Hammer',
    shortRangeDamage: 7/100,
    longRangeDamage: 0,
    mediumRangeDamage: 3/100,
    weaponclass: "shortrange",
    weight: 2,
    mpbonus: 0
  };
  weapons.warhammer = {
    name: 'Warhammer',
    shortRangeDamage: 15/100,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 4,
    mpbonus: 0
  };
  weapons.maul = {
    name: 'Maul',
    shortRangeDamage: 35/100,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 12,
    mpbonus: 0
  };
  weapons.lance = {
    name: 'Lance',
    shortRangeDamage: 1/100,
    longRangeDamage: 0,
    mediumRangeDamage: 20/100,
    weaponclass: "mediumrange",
    weight: 6,
    mpbonus: 0
  };
   weapons.eliteSword = {
    name: 'Elite Sword',
    shortRangeDamage: 30/100,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 3,
    mpbonus: 1
  };
  weapons.eliteLance = {
    name: 'Elite Lance',
    shortRangeDamage: 2/100,
    longRangeDamage: 0,
    mediumRangeDamage: 25/100,
    weaponclass: "mediumrange",
    weight: 5,
    mpbonus: 1
  };
  weapons.eliteLongbow = {
    name: 'Elite Longbow',
    shortRangeDamage: 5/100,
    longRangeDamage: 20/100,
    mediumRangeDamage: 25/100,
    weaponclass: "longrange",
    weight: 1,
    mpbonus: 1
  };
   weapons.holyKnife = {
    name: ' Holy Knife',
    shortRangeDamage: 6/100,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 1,
    mpbonus: 3
  };
  weapons.holyBowandArrow = {
    name: ' Holy Bow',
    shortRangeDamage: 4/100,
    longRangeDamage: 11/100,
    mediumRangeDamage: 16/100,
    ammo: 15,
    weaponclass: "longrange",
    weight: 1,
    mpbonus: 3
  };
  weapons.holyFishingspear = {
    name: ' Holy Fishing Spear',
    shortRangeDamage: 2/100,
    longRangeDamage:0,
    mediumRangeDamage: 11/100,
    weaponclass: "mediumrange",
    weight: 2,
    mpbonus: 3
  };
 weapons.holyThrowingknife = {
    name: ' Holy Throwing Knife',
    shortRangeDamage: 2/100,
    longRangeDamage: 0,
    mediumRangeDamage: 6/100,
    ammo: 5,
    weaponclass: "longrange",
    weight: 2,
    mpbonus: 3
  };
   weapons.holyTrident = {
    name: 'Holy Trident',
    shortRangeDamage: 2/100,
    longRangeDamage: 0,
    mediumRangeDamage: 26/100,
    weaponclass: "mediumrange",
    weight: 8,
    mpbonus: 3
  };
   weapons.holyJavelin = {
    name: 'Holy Javelin',
    shortRangeDamage: 8/100,
    longRangeDamage: 16/100,
    mediumRangeDamage: 11/100,
    ammo: 3,
    weaponclass: "longrange",
    weight: 3,
    mpbonus: 3
  };
  weapons.holySpear = {
    name: 'Holy Spear',
    shortRangeDamage: 2/100,
    longRangeDamage: 0,
    mediumRangeDamage: 16/100,
    weaponclass: "mediumrange",
    weight: 4,
    mpbonus: 3
  };
   weapons.holySword = {
    name: 'Holy Sword',
    shortRangeDamage: 21/100,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 4,
    mpbonus: 3
  };
  weapons.holySling = {
    name: 'Holy Sling',
    shortRangeDamage: 6/100,
    longRangeDamage: 7/100,
    mediumRangeDamage: 8/100,
    ammo: 20,
    weaponclass: "longrange",
    weight: 1,
    mpbonus: 3
    };
     weapons.holyStick = {
    name: 'Holy Stick',
    shortRangeDamage: 3/100,
    longRangeDamage: 0,
    mediumRangeDamage: 2/100,
    weaponclass: "shortrange",
    weight: 2,
    mpbonus: 3
  };
 weapons.holyClub = {
    name: 'Holy Club',
    shortRangeDamage: 7/100,
    longRangeDamage: 0,
    mediumRangeDamage: 2/100,
    weaponclass: "shortrange",
    weight: 5,
    mpbonus: 3
  };
 weapons.holyMace = {
    name: 'Holy Mace',
    shortRangeDamage: 16/100,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 7,
    mpbonus: 3
  };
  weapons.holyMorningstar = {
    name: 'Holy Morningstar',
    shortRangeDamage: 31/100,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 10,
    mpbonus: 3
  };
  weapons.holyLongbowandArrow = {
    name: 'Holy Longbow',
    shortRangeDamage: 5/100,
    longRangeDamage: 16/100,
    mediumRangeDamage: 21/100,
    ammo: 15,
    weaponclass: "longrange",
    weight: 1,
    mpbonus: 3
  };
   weapons.holyShortsword = {
    name: 'Holy Shortsword',
    shortRangeDamage: 16/100,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 2,
    mpbonus: 3
  };
  weapons.holyLongsword = {
    name: 'Holy Longsword',
    shortRangeDamage: 26/100,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 6,
    mpbonus: 3
  };
  weapons.holyBroadsword = {
    name: 'Holy Broadsword',
    shortRangeDamage: 31/100,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 7,
    mpbonus: 3
  };
  weapons.holyDagger = {
    name: 'Holy Dagger',
    shortRangeDamage: 8/100,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 1,
    mpbonus: 3
  };
  weapons.holyHatchet = {
    name: 'Holy Hatchet',
    shortRangeDamage: 8/100,
    longRangeDamage: 0,
    mediumRangeDamage: 4/100,
    weaponclass: "shortrange",
    weight: 4,
    mpbonus: 3
  };
  weapons.holyAxe = {
    name: 'Holy Axe',
    shortRangeDamage: 15/100,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 5,
    mpbonus: 3
  };
  weapons.holyThrowingaxe = {
    name: 'Holy Throwing Axe',
    shortRangeDamage: 5/100,
    longRangeDamage: 0,
    mediumRangeDamage: 7/100,
    ammo: 5,
    weaponclass: "longrange",
    weight: 4,
    mpbonus: 3
  };
  weapons.holyBattleaxe = {
    name: 'Holy Battleaxe',
    shortRangeDamage: 26/100,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 7,
    mpbonus: 3
  };
 weapons.holyKatana = {
    name: 'Holy Katana',
    shortRangeDamage: 21/100,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 4,
    mpbonus: 3
  };
  weapons.holyNinja_to = {
    name: 'Ninja-to',
    shortRangeDamage: 16/100,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 3,
    mpbonus: 0
  };
  weapons.holyThrowingstars = {
    name: 'Holy Throwing Stars',
    shortRangeDamage: 6/100,
    longRangeDamage: 6/100,
    mediumRangeDamage: 11/100,
    ammo: 10,
    weaponclass: "longrange",
    weight: 2,
    mpbonus: 3
  };
   weapons.holyStaff = {
    name: 'Holy Staff',
    shortRangeDamage: 7/100,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 3,
    mpbonus: 8
  };
   weapons.holySabre = {
    name: 'Holy Sabre',
    shortRangeDamage: 16/100,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 3,
    mpbonus: 3
  };
   weapons.holyHammer = {
    name: 'Holy Hammer',
    shortRangeDamage: 8/100,
    longRangeDamage: 0,
    mediumRangeDamage: 4/100,
    weaponclass: "shortrange",
    weight: 3,
    mpbonus: 3
  };
  weapons.holyWarhammer = {
    name: 'Holy Warhammer',
    shortRangeDamage: 16/100,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 4,
    mpbonus: 3
  };
  weapons.holyMaul = {
    name: 'Holy Maul',
    shortRangeDamage: 36/100,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 12,
    mpbonus: 3
  };
  weapons.holyLance = {
    name: 'Holy Lance',
    shortRangeDamage: 2/100,
    longRangeDamage: 0,
    mediumRangeDamage: 21/100,
    weaponclass: "mediumrange",
    weight: 6,
    mpbonus: 3
  };
    weapons.theStaff = {
    name: 'Staff',
    shortRangeDamage: 500/100,
    longRangeDamage: 500/100,
    mediumRangeDamage: 500/100,
    weaponclass: "shortrange, mediumrange, longrange",
    weight: 1,
    mpbonus: 0
  };
    weapons.theDragonsword = {
    name: 'Dragonsword',
    shortRangeDamage: 500/100,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 5,
    mpbonus: 0
  };
  return weapons;
});