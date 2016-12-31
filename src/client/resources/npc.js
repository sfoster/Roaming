define([], function(){

  var npc = {};
  // available terrain:
  // ["clear", "barren", "desert", "marsh", "mountains", "plains", "water", "abyss", "sand", "forest", "ice"]

  npc.goblin = {
    name: 'Goblin',
    icon: 'resources/graphics/GoblinIcon.png',
    affinity: 'monster',
    strength: 4,
    hp: 10,
    mp: 0,
    range: 'short',
    evasion: 5,
    terrain: ["marsh", "mountains", "plains", "forest"]
  };
  npc.goblinChamp = {
    name: 'Goblin Champion',
    affinity: 'monster',
    strength: 6,
    hp: 20,
    mp: 0,
    range: 'short',
    evasion: 7,
    terrain: ["marsh", "mountains", "plains", "forest"]
  };
  npc.goblinShaman = {
    name: 'Goblin Shaman',
    affinity: 'monster',
    strength: 2,
    hp: 5,
    mp: 10,
    range: 'short, medium',
    evasion: 3,
    terrain: ["marsh", "mountains", "plains", "forest"]
    // Goblin Shaman has Rage Aura spell/ability
  //(doubles the damage of accompanying fighters )
  };
  npc.goblinWarlord = {
    name: 'Goblin Warlord',
    affinity: 'monster',
    strength: 8,
    hp: 30,
    mp: 0,
    range: 'short',
    evasion: 6,
    terrain: ["marsh", "mountains", "plains", "forest"]
  };
npc.juvinileTroll = {
    name: 'Juvenile Troll',
    affinity: 'monster',
    strength: 10,
    hp: 50,
    mp: 0,
    range: 'short',
    evasion: 3,
    terrain: ["marsh", "mountains", "plains", "forest", "barren"]
  };
  npc.troll = {
    name: 'troll',
    affinity: 'monster',
    strength: 16,
    hp: 60,
    mp: 0,
    range: 'short',
    evasion: 2,
    terrain: ["marsh", "mountains", "plains", "forest", "barren"]
  };
  npc.trollElder = {
    name: 'Troll Elder',
    affinity: 'monster',
    strength: 4,
    hp: 25,
    mp: 20,
    range: 'short, medium',
    evasion: 1,
    terrain: ["marsh", "mountains", "plains", "forest", "barren"]
    // Troll Elder has Camouflage spell/ability
  //(makes foes much harder to hit)
  };

  npc.trollHulk = {
    name: 'Troll Hulk',
    affinity: 'monster',
    strength: 20,
    hp: 80,
    mp: 0,
    range: 'short',
    evasion: 1,
    terrain: ["marsh", "mountains", "plains", "forest", "barren"]
  };
  npc.hugeRat = {
    name: 'Huge Rat',
    affinity: 'monster',
    strength: 4,
    hp: 10,
    mp: 0,
    range: 'short',
    evasion: 7,
    terrain: ["marsh", "mountains", "plains", "forest", "desert"]
  };
  npc.giantRat = {
    name: 'Giant Rat',
    affinity: 'monster',
    strength: 6,
    hp: 20,
    mp: 0,
    range: 'short',
    evasion: 5,
    terrain: ["marsh", "mountains", "plains", "forest", "desert"]
  };
  npc.mutantRat = {
    name: 'Mutant Rat',
    affinity: 'monster',
    strength: 2,
    hp: 5,
    mp: 10,
    range: 'short,',
    evasion: 10,
    terrain: ["marsh", "mountains", "plains", "forest", "desert"]
    // Mutant Rat has Venom spell/ability
  //( half damge reccurs for 2-3 turns after attack )
  };
  npc.ratLord = {
    name: 'Rat Lord',
    affinity: 'monster',
    strength: 8,
    hp: 30,
    mp: 0,
    range:'short',
    evasion: 20,
    terrain: ["marsh", "mountains", "plains", "forest", "desert"]
  };
  npc.anaconda = {
    name: 'Anaconda',
    affinity: 'wildlife',
    strength: 18,
    hp: 50,
    mp: 0,
    range: 'short',
    evasion: 4,
    terrain: ["marsh", "water"]
  };
  npc.gaintAdder = {
    name: 'Gaint Adder',
    affinity: 'monster',
    strength: 6,
    hp: 15,
    mp: 20,
    range: 'short,medium',
    evasion: 7,
    terrain: ["plains", "forest", "barren", "desert"]
    // Gaint Adder has Hypnotism spell/ability(target loses 3 turns)
    // Giant Adder has Strong Venom ability
    // ( damage reccurs for 3-4 turns after attack )
  };
  npc.gaintCobra = {
    name: 'Gaint Cobra',
    affinity: 'monster',
    strength: 22,
    hp: 70,
    mp: 10,
    range: 'short',
    evasion: 5,
    terrain: ["sand", "barren", "desert"]
    // Giant Cobra has Strong Venom ability
    // ( damage reccurs for 3-4 turns after attack )
  };
  npc.wildcat = {
    name: 'Wildcat',
    affinity: 'wildlife',
    strength: 8,
    hp: 30,
    mp: 0,
    range: 'short',
    evasion: 16,
    terrain: ["plains", "forest", "barren", "desert"]
  };
  npc.angryDog = {
    name: 'Angry Dog',
    affinity: 'monster',
    strength: 10,
    hp: 35,
    mp: 0,
    range: 'short',
    evasion: 14,
    terrain: ["plains", "forest", "barren"]
  };
  npc.cheetah = {
    name: 'Cheetah',
    affinity: 'wildlife',
    strength: 10,
    hp: 35,
    mp: 0,
    range: 'short',
    evasion: 24,
    terrain: ["plains"]
  };
  npc.angryWolf = {
    name: 'Angry Wolf',
    affinity: 'monster',
    strength: 12,
    hp: 40,
    mp: 0,
    range: 'short',
    evasion: 12,
    terrain: ["plains", "forest", "ice"]
  };
  npc.tiger = {
    name: 'Tiger',
    affinity: 'wildlife',
    strength: 14,
    hp: 40,
    mp: 0,
    range: 'short',
    evasion: 28,
    terrain: ["marsh", "forest"]
  };
  npc.bear = {
    name: 'Bear',
    affinity: 'wildlife',
    strength: 20,
    hp: 50,
    mp: 0,
    range: 'short',
    evasion: 2,
    terrain: ["forest"]
  };
  npc.sickCat = {
    name: 'Sick Cat',
    affinity: 'monster',
    strength: 4,
    hp: 10,
    mp: 50,
    range: 'short',
    evasion: 6,
    terrain: ["marsh", "forest", "barren"]
    // Sick Cat has Venom spell/abilty
    // (see Mutant Rat)
  };
 npc.rabidDog = {
    name: 'Rabid Dog',
    affinity: 'monster',
    strength: 10,
    hp: 35,
    mp: 50,
    range: 'short',
    evasion: 12,
    terrain: ["marsh", "forest", "barren", "desert"]
    // Rabid Dog has Venom spell/ability
    // (see Mutant Rat)
  };
  npc.lioness = {
    name: 'Lioness',
    affinity: 'wildlife',
    strength: 20,
    hp: 50,
    mp: 0,
    range: 'short',
    evasion: 20,
    terrain: ["plains"]
  };
   npc.horse = {
    name: 'Horse',
    affinity: 'wildlife',
    strength: 14,
    hp: 60,
    mp: 0,
    range: 'short',
    evasion: 20
  };
  npc.lion = {
    name: 'Lion',
    affinity: 'wildlife',
    strength: 15,
    hp: 60,
    mp: 0,
    range: 'short',
    evasion: 15,
    terrain: ["plains"]
  };
  npc.chimpanzee = {
    name: 'Chimpanzee',
    affinity: 'wildlife',
    strength: 18,
    hp: 40,
    mp: 0,
    range: 'short',
    evasion: 12
  };
  npc.gorrila = {
    name: 'Gorrila',
    affinity: 'wildlife',
    strength: 22,
    hp: 60,
    mp: 0,
    range: 'short',
    evasion: 4,
    terrain: ["forest"]
  };
  npc.centaur = {
    name: 'Centaur',
    affinity: 'wildlife',
    strength: 16,
    hp: 50,
    mp: 0,
    weapon: 'weaponclass:long range',
    evasion: 15,
    terrain: ["plains", "forest"]
  };
  npc.orc = {
    name: 'Orc',
    affinity: 'monster',
    strength: 26,
    hp: 90,
    mp: 0,
    weapon: 'weaponclass:short range',
    evasion: 2,
    terrain: ["plains", "forest", "marsh", "sand", "barren"]
  };
  npc.bull = {
    name: 'Bull',
    affinity: 'wildlife',
    strength: 30,
    hp: 75,
    mp: 0,
    range: 'short',
    evasion: 1,
    terrain: ["mountains", "barren"]
  };
  npc.minotaur = {
    name: 'Minotaur',
    affinity: 'monster',
    strength: 40,
    hp: 100,
    mp: 0,
    weapon: 'weaponclass:medium range, weaponclass:shortrange',
    evasion: 1,
    terrain: ["mountains", "barren"]
  };
  npc.humanSoldier = {
    name: 'Soldier',
    affinity: 'indigene',
    strength: 8,
    hp: 25,
    mp: 0,
    weapon: 'weaponclass:shortrange, weaponclass:mediumrange, weaponclass:longrange',
    evasion: 7,
    terrain: ["plains", "forest", "marsh", "sand", "barren"]
  };
  npc.humanLongbowman = {
    name: 'Longbowman',
    affinity: 'indigene',
    strength: 10,
    hp: 20,
    mp: 0,
    weapon: 'weapons.longbow',
    evasion: 7,
    terrain: ["plains", "forest", "marsh", "sand", "barren"]
  };
  npc.humanKnight = {
    name: 'Knight',
    affinity: 'indigene',
    strength: 20,
    hp: 60,
    mp: 0,
    weapon: 'weapons.lance, weapons.longsword',
    evasion: 1,
    terrain: ["plains", "forest", "marsh", "sand", "barren"]
  };
  npc.humanElite = {
    name: 'Elite Warrior',
    affinity: 'indigene',
    strength: 30,
    hp: 75,
    mp: 30,
    weapon: 'weapons.eliteSword, weapons.eliteLance, weapons.elitelongbow',
    evasion: 10,
    terrain: ["plains", "forest", "marsh", "sand", "barren"]
  };

  npc.harpy = {
    name: 'Harpy',
    affinity: 'monster',
    strength: 15,
    hp: 15,
    mp: 0,
    range: 'short, medium, long',
    evasion: 50,
    terrain: ["water"]
  };
   npc.mammoth = {
    name: 'Mammoth',
    affinity: 'wildlife',
    strength: 60,
    hp: 300,
    mp: 0,
    range: 'short',
    evasion: 0,
    terrain: ["ice", "mountains"]
  };
   npc.giant = {
    name: 'Giant',
    affinity: 'monster',
    strength: 50,
    hp: 300,
    mp: 0,
    range: 'short',
    evasion: 0,
    terrain: ["mountains", "ice", "barren", "forest"]
  };
  npc.juggernaut = {
    name: 'Juggernaut',
    affinity: 'monster',
    strength: 100,
    hp: 1000,
    mp: 0,
    weapon: 'weapons.maul',
    evasion: 0,
    terrain: ["desert"]
  };
  npc.hdyra = {
    name: 'Hydra',
    affinity: 'monster',
    strength: 120,
    hp: 300,
    mp: 50,
    range: 'short, medium',
    evasion: 15,
    terrain: ["desert", "sand", "forest"]
    // Hydra has Venom Spit ability
    // (same as Venom, but medium range)
    // Hydra has Deadly Toxin ability
    //(Double damage reccurs for 5-6 turns after attack)
  };
  npc.cyclop = {
    name: 'Cyclop',
    affinity: 'monster',
    strength: 130,
    hp: 200,
    mp: 0,
    range: 'short, medium, long',
    evasion: 2,
    terrain: ["desert", "sand", "barren", "mountains"]
  };

  npc.dragon = {
    name: 'Dragon',
    affinity: 'monster',
    strength: 80,
    hp: 500,
    mp: 50,
    range: 'short, medium, long',
    evasion: 25,
    terrain: ["mountains"]
    // Dragon has Flame Breath abilty
  // (medium+long range attack, causes burning( half damage reccurs for 2-3 turns after attack))
  };
  npc.theRoc = {
    name: 'The Roc',
    affinity: 'monster',
    strength: 150,
    hp: 500,
    mp: 0,
    range: 'short, medium',
    evasion: 20,
    terrain: ["mountains"]
  };


  // All spells cost 10 mp per cast
  // dmg=strength x wpn dmg divided by 5(?)

  var npcDefaults = {
    type: "npc",
    name: "NPC", // by default
    level: 1,
    affinity: 'monster',
    luck: 10/100,
    icon: "./resources/graphics/BaddieIcon.png",
    currentWeapon: 'claws', // by default
    // stats
    level: 1,
    health: 4,
    strength: 6,
    mana: 0
  };

  Object.defineProperty(npc, 'fillDefaults', {
    value: function(npcData) {
      for(var i in npcDefaults) {
        if(!npcData.hasOwnProperty(i)) {
           npcData[i] = npcDefaults[i];
        }
      }
      return npcData;
    }
  });
  npc.defaults = npcDefaults;

  return npc;
});