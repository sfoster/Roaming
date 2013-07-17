define([], function(){

  var weapons = {};
  var weaponClasses = {};

  weapons.fist = {
    name: 'fist',
    shortRangeDamage: 1,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 0,
    mpbonus: 0,
    fixed: true
  };

  weapons.claws = {
    name: 'claws',
    shortRangeDamage: 1,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 0,
    mpbonus: 0,
    fixed: true
  };

  weapons.knife = {
    name: 'Knife',
    shortRangeDamage: 5,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 1,
    mpbonus: 0
  };

  weapons.bowAndArrow = {
    name: 'Bow',
    shortRangeDamage: 3,
    longRangeDamage: 10,
    mediumRangeDamage: 15,
    ammo: 15,
    weaponclass: "longrange",
    weight: 1,
    mpbonus: 0
  };

  weapons.fishingSpear = {
    name: 'Fishing Spear',
    shortRangeDamage: 1,
    longRangeDamage:0,
    mediumRangeDamage: 10,
    weaponclass: "mediumrange",
    weight: 2,
    mpbonus: 0
  };

  weapons.throwingKnife = {
    name: 'Throwing Knife',
    shortRangeDamage: 3,
    longRangeDamage: 0,
    mediumRangeDamage: 5,
    ammo: 5,
    weaponclass: "longrange",
    weight: 2,
    mpbonus: 0
  };
  weapons.trident = {
    name: 'Trident',
    shortRangeDamage: 1,
    longRangeDamage: 0,
    mediumRangeDamage: 25,
    weaponclass: "mediumrange",
    weight: 8,
    mpbonus: 0
  };
  weapons.javelin = {
    name: 'Javelin',
    shortRangeDamage: 7,
    longRangeDamage: 15,
    mediumRangeDamage: 10,
    ammo: 3,
    weaponclass: "longrange",
    weight: 3,
    mpbonus: 0
  };

  weapons.spear = {
    name: 'Spear',
    shortRangeDamage: 1,
    longRangeDamage: 0,
    mediumRangeDamage: 15,
    weaponclass: "mediumrange",
    weight: 4,
    mpbonus: 0
  };
  weapons.sword = {
    name: 'Sword',
    shortRangeDamage: 20,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 4,
    mpbonus: 0
  };
  weapons.sling = {
    name: 'Sling',
    shortRangeDamage: 5,
    longRangeDamage: 6,
    mediumRangeDamage: 7,
    ammo: 20,
    weaponclass: "longrange",
    weight: 1,
    mpbonus: 0
    };
  weapons.stick = {
    name: 'Stick',
    shortRangeDamage: 2,
    longRangeDamage: 0,
    mediumRangeDamage: 1,
    weaponclass: "shortrange",
    weight: 2,
    mpbonus: 0
  };
  weapons.club = {
    name: 'Club',
    shortRangeDamage: 6,
    longRangeDamage: 0,
    mediumRangeDamage: 1,
    weaponclass: "shortrange",
    weight: 5,
    mpbonus: 0
  };
  weapons.mace = {
    name: 'Mace',
    shortRangeDamage: 15,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 7,
    mpbonus: 0
  };
  weapons.morningstar = {
    name: 'Morningstar',
    shortRangeDamage: 30,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 10,
    mpbonus: 0
  };
  weapons.longbowAndarrow = {
    name: 'Longbow',
    shortRangeDamage: 4,
    longRangeDamage: 15,
    mediumRangeDamage: 20,
    ammo: 15,
    weaponclass: "longrange",
    weight: 1,
    mpbonus: 0
  };
  weapons.shortsword = {
    name: 'Shortsword',
    shortRangeDamage: 15,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 2,
    mpbonus: 0
  };
  weapons.longsword = {
    name: 'Longsword',
    shortRangeDamage: 25,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 6,
    mpbonus: 0
  };
  weapons.broadsword = {
    name: 'Broadsword',
    shortRangeDamage: 30,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 7,
    mpbonus: 0
  };
  weapons.dagger = {
    name: 'Dagger',
    shortRangeDamage: 7,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 1,
    mpbonus: 0
  };
  weapons.hatchet = {
    name: 'Hatchet',
    shortRangeDamage: 7,
    longRangeDamage: 0,
    mediumRangeDamage: 3,
    weaponclass: "shortrange",
    weight: 4,
    mpbonus: 0
  };
  weapons.Axe = {
    name: 'Axe',
    shortRangeDamage: 14,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 5,
    mpbonus: 0
  };
  weapons.throwingAxe = {
    name: 'Throwing Axe',
    shortRangeDamage: 4,
    longRangeDamage: 0,
    mediumRangeDamage: 6,
    ammo: 5,
    weaponclass: "longrange",
    weight: 4,
    mpbonus: 0
  };
  weapons.battleaxe = {
    name: 'Battleaxe',
    shortRangeDamage: 25,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 7,
    mpbonus: 0
  };
 weapons.katana = {
    name: 'Katana',
    shortRangeDamage: 20,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 4,
    mpbonus: 0
  };
  weapons.ninjato = {
    name: 'Ninjato',
    shortRangeDamage: 15,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 3,
    mpbonus: 0
  };
  weapons.throwingStars = {
    name: 'Throwing Stars',
    shortRangeDamage: 5,
    longRangeDamage: 5,
    mediumRangeDamage: 10,
    ammo: 10,
    weaponclass: "longrange",
    weight: 2,
    mpbonus: 0
  };
   weapons.staff = {
    name: 'Staff',
    shortRangeDamage: 6,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 3,
    mpbonus: 5
  };
   weapons.sabre = {
    name: 'Sabre',
    shortRangeDamage: 15,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 3,
    mpbonus: 0
  };
   weapons.hammer = {
    name: 'Hammer',
    shortRangeDamage: 7,
    longRangeDamage: 0,
    mediumRangeDamage: 3,
    weaponclass: "shortrange",
    weight: 2,
    mpbonus: 0
  };
  weapons.warhammer = {
    name: 'Warhammer',
    shortRangeDamage: 15,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 4,
    mpbonus: 0
  };
  weapons.maul = {
    name: 'Maul',
    shortRangeDamage: 35,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 12,
    mpbonus: 0
  };
  weapons.lance = {
    name: 'Lance',
    shortRangeDamage: 1,
    longRangeDamage: 0,
    mediumRangeDamage: 20,
    weaponclass: "mediumrange",
    weight: 6,
    mpbonus: 0
  };
   weapons.eliteSword = {
    name: 'Elite Sword',
    shortRangeDamage: 30,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 3,
    mpbonus: 1
  };
  weapons.eliteLance = {
    name: 'Elite Lance',
    shortRangeDamage: 2,
    longRangeDamage: 0,
    mediumRangeDamage: 25,
    weaponclass: "mediumrange",
    weight: 5,
    mpbonus: 1
  };
  weapons.eliteLongbow = {
    name: 'Elite Longbow',
    shortRangeDamage: 5,
    longRangeDamage: 20,
    mediumRangeDamage: 25,
    weaponclass: "longrange",
    weight: 1,
    mpbonus: 1
  };
   weapons.holyKnife = {
    name: ' Holy Knife',
    shortRangeDamage: 6,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 1,
    mpbonus: 3
  };
  weapons.holyBowandArrow = {
    name: ' Holy Bow',
    shortRangeDamage: 4,
    longRangeDamage: 11,
    mediumRangeDamage: 16,
    ammo: 15,
    weaponclass: "longrange",
    weight: 1,
    mpbonus: 3
  };
  weapons.holyFishingspear = {
    name: ' Holy Fishing Spear',
    shortRangeDamage: 2,
    longRangeDamage:0,
    mediumRangeDamage: 11,
    weaponclass: "mediumrange",
    weight: 2,
    mpbonus: 3
  };
 weapons.holyThrowingknife = {
    name: ' Holy Throwing Knife',
    shortRangeDamage: 2,
    longRangeDamage: 0,
    mediumRangeDamage: 6,
    ammo: 5,
    weaponclass: "longrange",
    weight: 2,
    mpbonus: 3
  };
   weapons.holyTrident = {
    name: 'Holy Trident',
    shortRangeDamage: 2,
    longRangeDamage: 0,
    mediumRangeDamage: 26,
    weaponclass: "mediumrange",
    weight: 8,
    mpbonus: 3
  };
   weapons.holyJavelin = {
    name: 'Holy Javelin',
    shortRangeDamage: 8,
    longRangeDamage: 16,
    mediumRangeDamage: 11,
    ammo: 3,
    weaponclass: "longrange",
    weight: 3,
    mpbonus: 3
  };
  weapons.holySpear = {
    name: 'Holy Spear',
    shortRangeDamage: 2,
    longRangeDamage: 0,
    mediumRangeDamage: 16,
    weaponclass: "mediumrange",
    weight: 4,
    mpbonus: 3
  };
   weapons.holySword = {
    name: 'Holy Sword',
    shortRangeDamage: 21,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 4,
    mpbonus: 3
  };
  weapons.holySling = {
    name: 'Holy Sling',
    shortRangeDamage: 6,
    longRangeDamage: 7,
    mediumRangeDamage: 8,
    ammo: 20,
    weaponclass: "longrange",
    weight: 1,
    mpbonus: 3
    };
     weapons.holyStick = {
    name: 'Holy Stick',
    shortRangeDamage: 3,
    longRangeDamage: 0,
    mediumRangeDamage: 2,
    weaponclass: "shortrange",
    weight: 2,
    mpbonus: 3
  };
 weapons.holyClub = {
    name: 'Holy Club',
    shortRangeDamage: 7,
    longRangeDamage: 0,
    mediumRangeDamage: 2,
    weaponclass: "shortrange",
    weight: 5,
    mpbonus: 3
  };
 weapons.holyMace = {
    name: 'Holy Mace',
    shortRangeDamage: 16,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 7,
    mpbonus: 3
  };
  weapons.holyMorningstar = {
    name: 'Holy Morningstar',
    shortRangeDamage: 31,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 10,
    mpbonus: 3
  };
  weapons.holyLongbowandArrow = {
    name: 'Holy Longbow',
    shortRangeDamage: 5,
    longRangeDamage: 16,
    mediumRangeDamage: 21,
    ammo: 15,
    weaponclass: "longrange",
    weight: 1,
    mpbonus: 3
  };
   weapons.holyShortsword = {
    name: 'Holy Shortsword',
    shortRangeDamage: 16,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 2,
    mpbonus: 3
  };
  weapons.holyLongsword = {
    name: 'Holy Longsword',
    shortRangeDamage: 26,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 6,
    mpbonus: 3
  };
  weapons.holyBroadsword = {
    name: 'Holy Broadsword',
    shortRangeDamage: 31,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 7,
    mpbonus: 3
  };
  weapons.holyDagger = {
    name: 'Holy Dagger',
    shortRangeDamage: 8,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 1,
    mpbonus: 3
  };
  weapons.holyHatchet = {
    name: 'Holy Hatchet',
    shortRangeDamage: 8,
    longRangeDamage: 0,
    mediumRangeDamage: 4,
    weaponclass: "shortrange",
    weight: 4,
    mpbonus: 3
  };
  weapons.holyAxe = {
    name: 'Holy Axe',
    shortRangeDamage: 15,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 5,
    mpbonus: 3
  };
  weapons.holyThrowingaxe = {
    name: 'Holy Throwing Axe',
    shortRangeDamage: 5,
    longRangeDamage: 0,
    mediumRangeDamage: 7,
    ammo: 5,
    weaponclass: "longrange",
    weight: 4,
    mpbonus: 3
  };
  weapons.holyBattleaxe = {
    name: 'Holy Battleaxe',
    shortRangeDamage: 26,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 7,
    mpbonus: 3
  };
 weapons.holyKatana = {
    name: 'Holy Katana',
    shortRangeDamage: 21,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 4,
    mpbonus: 3
  };
  weapons.holyNinja_to = {
    name: 'Ninja-to',
    shortRangeDamage: 16,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 3,
    mpbonus: 0
  };
  weapons.holyThrowingstars = {
    name: 'Holy Throwing Stars',
    shortRangeDamage: 6,
    longRangeDamage: 6,
    mediumRangeDamage: 11,
    ammo: 10,
    weaponclass: "longrange",
    weight: 2,
    mpbonus: 3
  };
   weapons.holyStaff = {
    name: 'Holy Staff',
    shortRangeDamage: 7,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 3,
    mpbonus: 8
  };
   weapons.holySabre = {
    name: 'Holy Sabre',
    shortRangeDamage: 16,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 3,
    mpbonus: 3
  };
   weapons.holyHammer = {
    name: 'Holy Hammer',
    shortRangeDamage: 8,
    longRangeDamage: 0,
    mediumRangeDamage: 4,
    weaponclass: "shortrange",
    weight: 3,
    mpbonus: 3
  };
  weapons.holyWarhammer = {
    name: 'Holy Warhammer',
    shortRangeDamage: 16,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 4,
    mpbonus: 3
  };
  weapons.holyMaul = {
    name: 'Holy Maul',
    shortRangeDamage: 36,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 12,
    mpbonus: 3
  };
  weapons.holyLance = {
    name: 'Holy Lance',
    shortRangeDamage: 2,
    longRangeDamage: 0,
    mediumRangeDamage: 21,
    weaponclass: "mediumrange",
    weight: 6,
    mpbonus: 3
  };
  weapons.rustyKnife = {
    name: 'Rusty Knife',
    shortRangeDamage: 3,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 1,
    mpbonus: 0
  };
  weapons.rustyFishingspear = {
    name: 'Rusty Fishing Spear',
    shortRangeDamage: 1,
    longRangeDamage:0,
    mediumRangeDamage: 7,
    weaponclass: "mediumrange",
    weight: 2,
    mpbonus: 0
  };

  weapons.rustytThrowingknife = {
    name: 'Rusty Throwing Knife',
    shortRangeDamage: 2,
    longRangeDamage: 0,
    mediumRangeDamage: 3,
    ammo: 5,
    weaponclass: "longrange",
    weight: 2,
    mpbonus: 0
  };
  weapons.rustyTrident = {
    name: 'Rusty Trident',
    shortRangeDamage: 1,
    longRangeDamage: 0,
    mediumRangeDamage: 20,
    weaponclass: "mediumrange",
    weight: 8,
    mpbonus: 0
  };
  weapons.rustyJavelin = {
    name: 'Rusty Javelin',
    shortRangeDamage: 5/00,
    longRangeDamage: 12,
    mediumRangeDamage: 7,
    ammo: 3,
    weaponclass: "longrange",
    weight: 3,
    mpbonus: 0
  };

  weapons.rustySpear = {
    name: 'Rusty Spear',
    shortRangeDamage: 1,
    longRangeDamage: 0,
    mediumRangeDamage: 12,
    weaponclass: "mediumrange",
    weight: 4,
    mpbonus: 0
  };
  weapons.rustySword = {
    name: 'Rusty Sword',
    shortRangeDamage: 17,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 4,
    mpbonus: 0
  };
  weapons.rustyShortsword = {
    name: 'Rusty Shortsword',
    shortRangeDamage: 12,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 2,
    mpbonus: 0
  };
  weapons.rustyLongsword = {
    name: 'Rusty Longsword',
    shortRangeDamage: 22,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 6,
    mpbonus: 0
  };
  weapons.rustyBroadsword = {
    name: 'Rusty Broadsword',
    shortRangeDamage: 27,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 7,
    mpbonus: 0
  };
  weapons.rustyDagger = {
    name: 'Rusty Dagger',
    shortRangeDamage: 5,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 1,
    mpbonus: 0
  };
  weapons.rustyHatchet = {
    name: 'Rusty Hatchet',
    shortRangeDamage: 5,
    longRangeDamage: 0,
    mediumRangeDamage: 1,
    weaponclass: "shortrange",
    weight: 4,
    mpbonus: 0
  };
  weapons.rustyAxe = {
    name: 'Rusty Axe',
    shortRangeDamage: 11,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 5,
    mpbonus: 0
  };
  weapons.rustyThrowingaxe = {
    name: 'Rusty Throwing Axe',
    shortRangeDamage: 2,
    longRangeDamage: 0,
    mediumRangeDamage: 3,
    ammo: 5,
    weaponclass: "longrange",
    weight: 4,
    mpbonus: 0
  };
  weapons.rustyBattleaxe = {
    name: 'Rusty Battleaxe',
    shortRangeDamage: 22,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 7,
    mpbonus: 0
  };
 weapons.rustyKatana = {
    name: 'Rusty Katana',
    shortRangeDamage: 17,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 4,
    mpbonus: 0
  };
  weapons.rustyNinjato = {
    name: 'Rusty Ninjato',
    shortRangeDamage: 15,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 3,
    mpbonus: 0
  };
  weapons.rustyThrowingstars = {
    name: 'Rusty Throwing Stars',
    shortRangeDamage: 2,
    longRangeDamage: 2,
    mediumRangeDamage: 7,
    ammo: 10,
    weaponclass: "longrange",
    weight: 2,
    mpbonus: 0
  };
  weapons.rustyMorningstar = {
    name: 'Rusty Morningstar',
    shortRangeDamage: 29,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 10,
    mpbonus: 0
  };
  weapons.rustySabre = {
    name: 'Rusty Sabre',
    shortRangeDamage: 12,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 3,
    mpbonus: 0
  };
   weapons.rustyHammer = {
    name: 'Rusty Hammer',
    shortRangeDamage: 6,
    longRangeDamage: 0,
    mediumRangeDamage: 2,
    weaponclass: "shortrange",
    weight: 2,
    mpbonus: 0
  };
  weapons.rustyWarhammer = {
    name: 'Rusty Warhammer',
    shortRangeDamage: 14,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 4,
    mpbonus: 0
  };
  weapons.rustyLance = {
    name: 'Rusty Lance',
    shortRangeDamage: 1,
    longRangeDamage: 0,
    mediumRangeDamage: 17,
    weaponclass: "mediumrange",
    weight: 6,
    mpbonus: 0
  };
  weapons.theStaff = {
    name: 'Staff',
    shortRangeDamage: 500,
    longRangeDamage: 500,
    mediumRangeDamage: 500,
    weaponclass: "shortrange, mediumrange, longrange",
    weight: 1,
    mpbonus: 0
  };
  weapons.theDragonsword = {
    name: 'Dragonsword',
    shortRangeDamage: 500,
    longRangeDamage: 0,
    mediumRangeDamage: 0,
    weaponclass: "shortrange",
    weight: 5,
    mpbonus: 0
  };

  // give each weapon a type property (weapons are a type of item)
  for(var id in weapons) {
    if(!('shortRangeDamage' in weapons[id])) {
      continue;
    }
    weapons[id].type = 'weapon';
  }
  return weapons;
});