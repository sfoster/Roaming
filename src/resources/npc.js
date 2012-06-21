define([], function(){
  
  var npc = {};
  // available terrain: 
  // ["clear", "barren", "desert", "marsh", "mountains", "plains", "water", "abyss", "sand", "forest", "ice"]
  
  npc.goblin = {
    name: 'Goblin',
    strength: 4,
    hp: 10,
    mp: 0,
    range: 'short',
    evasion: 5,
    terrain: ["marsh", "mountains", "plains", "forest"]
  };
  npc.goblinChamp = {
    name: 'Goblin Champion',
    strength: 6,
    hp: 20,
    mp: 0,
    range: 'short',
    evasion: 7,
    terrain: ["marsh", "mountains", "plains", "forest"]
  };
  npc.goblinShaman = {
    name: 'Goblin Shaman',
    strength: 2,
    hp: 5,
    mp: 10,
    range: 'short, medium',
    evasion: 3,
    terrain: ["marsh", "mountains", "plains", "forest"]
  };// Goblin Shaman has Damage Aura spell/ability
  //(doubles the damage of accompanying fighters )
  npc.goblinWarlord = {
    name: 'Goblin Warlord',
    strength: 8,
    hp: 30,
    mp: 0,
    range: 'short',
    evasion: 6,
    terrain: ["marsh", "mountains", "plains", "forest"]
  };

  npc.hugeRat = {
    name: 'Huge Rat',
    strength: 4,
    hp: 10,
    mp: 0,
    range: 'short',
    evasion: 7,
    terrain: ["marsh", "mountains", "plains", "forest", "desert"]
  };
  npc.giantRat = {
    name: 'Giant Rat',
    strength: 6,
    hp: 20,
    mp: 0,
    range: 'short',
    evasion: 5,
    terrain: ["marsh", "mountains", "plains", "forest", "desert"]
  };
  npc.mutantRat = {
    name: 'Mutant Rat',
    strength: 2,
    hp: 5,
    mp: 10,
    range: 'short,',
    evasion: 10,
    terrain: ["marsh", "mountains", "plains", "forest", "desert"]
  };// Mutant Rat has Poison spell/ability
  //( does reccuring half damage for 2-3 turns after attack )
  npc.ratHorde = {
    name: 'Rat Horde',
    strength: 8,
    hp: 30,
    mp: 0,
    range:'short',
    evasion: 20,
    terrain: ["marsh", "mountains", "plains", "forest", "desert"]
  };

  npc.juvinileTroll = {
    name: 'Juvenile Troll',
    strength: 10,
    hp: 50,
    mp: 0,
    range: 'short',
    evasion: 3,
    terrain: ["marsh", "mountains", "plains", "forest", "barren"]
  };
  npc.troll = {
      name: 'troll',
      strength: 16,
      hp: 60,
      mp: 0,
      range: 'short',
      evasion: 2,
      terrain: ["marsh", "mountains", "plains", "forest", "barren"]
  };
  npc.trollElder = {
    name: 'Troll Elder',
    strength: 4,
    hp: 25,
    mp: 20,
    range: 'short, medium',
    evasion: 1,
    terrain: ["marsh", "mountains", "plains", "forest", "barren"]
  };// Troll Elder has Camo spell/ability
  //(makes him much harder to hit)

  npc.trollHulk = {
    name: 'Troll Hulk',
    strength: 20,
    hp: 80,
    mp: 0,
    range: 'short',
    evasion: 1,
    terrain: ["marsh", "mountains", "plains", "forest", "barren"]
  };

  npc.python = {
    name: 'Python',
    strength: 12,
    hp: 30,
    mp: 0,
    range: 'short',
    evasion: 5,
    terrain: ["marsh", "forest"]
  };
  npc.anaconda = {
    name: 'Anaconda',
    strength: 18,
    hp: 50,
    mp: 0,
    range: 'short',
    evasion: 4,
    terrain: ["marsh", "water"]
  };
  npc.gaintAdder = {
    name: 'Gaint Adder',
    strength: 6,
    hp: 15,
    mp: 20,
    range: 'short,medium',
    evasion: 7,
    terrain: ["plains", "forest", "barren", "desert"]
  };// Gaint Adder has Hypnotism spell/ability 
  // (target loses a turn)
  
  npc.gaintCobra= {
    name: 'Gaint Cobra',
    strength: 22,
    hp: 70,
    mp: 10,
    range: 'short',
    evasion: 5,
    terrain: ["sand", "barren", "desert"]
    // Giant Cobra has Poison ability
    // (see Mutant Rat)
  };
  npc.wildcat = {
    name: 'Wildcat',
    strength: 8,
    hp: 30,
    mp: 0,
    range: 'short',
    evasion: 16,
    terrain: ["plains", "forest", "barren", "desert"]
  };
  npc.angryDog = {
    name: 'Angry Dog',
    strength: 10,
    hp: 35,
    mp: 0,
    range: 'short',
    evasion: 14,
    terrain: ["plains", "forest", "barren"]
  };
  npc.cheetah = {
    name: 'Cheetah',
    strength: 10,
    hp: 35,
    mp: 0,
    range: 'short',
    evasion: 24,
    terrain: ["plains"]
  };
  npc.angryWolf = {
    name: 'Angry Wolf',
    strength: 12,
    hp: 40,
    mp: 0,
    range: 'short',
    evasion: 12,
    terrain: ["plains", "forest", "ice"]
  };
  npc.tiger = {
    name: 'Tiger',
    strength: 14,
    hp: 40,
    mp: 0,
    range: 'short',
    evasion: 28,
    terrain: ["marsh", "forest"]
    
  };
  npc.bear = {
    name: 'Bear',
    strength: 20,
    hp: 50,
    mp: 0,
    range: 'short',
    evasion: 2,
    terrain: ["forest"]
  };
  npc.sickCat = {
    name: 'Sick Cat',
    strength: 4,
    hp: 10,
    mp: 50,
    range: 'short',
    evasion: 6,
    terrain: ["marsh", "forest", "barren"]
    // Sick Cat has poison spell/abilty
    // (see Mutant Rat)
  };
 npc.rabidDog = {
    name: 'Rabid Dog',
    strength: 10,
    hp: 35,
    mp: 50,
    range: 'short',
    evasion: 12,
    terrain: ["marsh", "forest", "barren", "desert"]
    // Rabid Dog has Poison spell/ability
    // (see Mutant Rat)
  };
  npc.lioness = {
    name: 'Lioness',
    strength: 20,
    hp: 50,
    mp: 0,
    range: 'short',
    evasion: 20,
    terrain: ["plains"]
  };
   npc.horse = {
    name: 'Horse',
    strength: 14,
    hp: 60,
    mp: 0,
    range: 'short',
    evasion: 20  
  };
  npc.chimpanzee = {
    name: 'Chimpanzee',
    strength: 18,
    hp: 40,
    mp: 0,
    range: 'short',
    evasion: 12
  };
  npc.gorrila = {
    name: 'Gorrila',
    strength: 22,
    hp: 60,
    mp: 0,
    range: 'short',
    evasion: 4,
    terrain: ["forest"]
  };
  npc.centaur = {
    name: 'Centaur',
    strength: 16,
    hp: 50,
    mp: 0,
    weapon: 'weaponclass:long range',
    evasion: 15,
    terrain: ["plains", "forest"]
  };
  npc.orc = {
    name: 'Orc',
    strength: 26,
    hp: 90,
    mp: 0,
    weapon: 'weaponclass:short range',
    evasion: 2,
    terrain: ["plains", "forest", "marsh", "sand", "barren"]
  };
  npc.minotaur = {
    name: 'Minotaur',
    strength: 40,
    hp: 100,
    mp: 0,
    weapon: 'weaponclass:medium range',
    evasion: 1, 
    terrain: ["mountains", "barren"]
  };
  npc.humanSoldier = {
    name: 'Soldier',
    strength: 8,
    hp: 25,
    mp: 0,
    weapon: 'weaponclass:shortrange, weaponclass:medium range, weaponclass:long range',
    evasion: 7,
    terrain: ["plains", "forest", "marsh", "sand", "barren"]
  };
  npc.humanKnight = {
    name: 'Knight',
    strength: 20,
    hp: 60,
    mp: 0,
    weapon: 'weapons.lance, weapons.longsword',
    evasion: 1,
    terrain: ["plains", "forest", "marsh", "sand", "barren"]
  };
  npc.humanElite = {
    name: 'Elite Warrior',
    strength: 30,
    hp: 75,
    mp: 30,
    weapon: 'weapons.eliteSword, weapons.eliteLance, weapons.elitelongbow',
    evasion: 10,
    terrain: ["plains", "forest", "marsh", "sand", "barren"]
  };

  npc.harpy = {
    name: 'Harpy',
    strength: 15,
    hp: 15,
    mp: 0,
    range: 'short, medium, long',
    evasion: 50,
    terrain: ["water"]
  };
   npc.mammoth = {
    name: 'Mammoth',
    strength: 60,
    hp: 300,
    mp: 0,
    range: 'short',
    evasion: 0,
    terrain: ["ice", "mountains"]
  };
   npc.giant = {
    name: 'Gaint',
    strength: 50,
    hp: 300,
    mp: 0,
    range: 'short',
    evasion: 0, 
    terrain: ["mountains", "barren", "forest"]
  };
  npc.juggernaut = {
    name: 'Juggernaut',
    strength: 100,
    hp: 1000,
    mp: 0,
    weapon: 'weapons.maul',
    evasion: 0, 
    terrain: ["desert"]
  };
  npc.hdyra = {
    name: 'Hydra',
    strength: 120,
    hp: 300,
    mp: 50,
    range: 'short, medium',
    evasion: 15, 
    terrain: ["desert", "sand"]
    // Hydra has Venom Spit ability
    // (same as Poison, but medium range)
  };
  npc.cyclop = {
    name: 'Cyclop',
    strength: 130,
    hp: 200,
    mp: 0,
    range: 'short, medium, long',
    evasion: 2, 
    terrain: ["desert", "sand", "barren", "mountains"]
  };

  npc.dragon = {
    name: 'Dragon',
    strength: 80,
    hp: 500,
    mp: 50,
    range: 'short, medium, long',
    evasion: 25, 
    terrain: ["mountains"]
  };// Dragon has Flame Breath abilty
  // (medium+long range attack)
  npc.theRoc = {
    name: 'The Roc',
    strength: 150,
    hp: 500,
    mp: 0,
    range: 'short, medium',
    evasion: 20, 
    terrain: ["mountains"]
  };
  
  
  // All spells cost 10 mp per cast
  // dmg=strength+wpn dmg divided by 4(?) 
  return npc;
});