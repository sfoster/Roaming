define([], function(){
  
  var npc = {};
  
  npc.goblin = {
    name: 'Goblin',
    strength: 4,
    hp: 10,
    mp: 0,
    range: 'short'
  };
  npc.hugeRat = {
    name: 'Huge Rat',
    strength: 4,
    hp: 10,
    mp: 0,
    range: 'short'
  };
  npc.goblinChamp = {
    name: 'Goblin Champion',
    strength: 6,
    hp: 20,
    mp: 0,
    range: 'short'
  };
  npc.giantRat = {
    name: 'Giant Rat',
    strength: 6,
    hp: 20,
    mp: 0,
    range: 'short'
  };
npc.goblinShaman = {
    name: 'Goblin Shaman',
    strength: 2,
    hp: 5,
    mp: 10,
    range: 'short, medium'
  };// Goblin Shaman has Damage Aura spell/ability
  //(doubles the damage of accompanying fighters )
npc.mutantRat = {
    name: 'Mutant Rat',
    strength: 2,
    hp: 5,
    mp: 10,
    range: 'short, medium'
  };// Mutant Rat has Poison spell/ability
  //( does reccuring half damage for 2-3 turns after attack )
npc.goblinWarlord = {
    name: 'Goblin Warlord',
    strength: 8,
    hp: 30,
    mp: 0,
    range: 'short'
  };
npc.ratHorde = {
    name: 'Rat Horde',
    strength: 8,
    hp: 30,
    mp: 0,
    range:'short'
  };

npc.juvinileTroll = {
    name: 'Juvenile Troll',
    strength: 10,
    hp: 50,
    mp: 0,
    range: 'short'
  };
npc.python = {
    name: 'Python',
    strength: 12,
    hp: 30,
    mp: 0,
    range: 'short'
  };
npc.troll = {
    name: 'troll',
    strength: 16,
    hp: 60,
    mp: 0,
    range: 'short'
  };
npc.anaconda = {
    name: 'Anaconda',
    strength: 18,
    hp: 50,
    mp: 0,
    range: 'short'
  };
npc.trollElder = {
    name: 'Troll Elder',
    strength: 4,
    hp: 25,
    mp: 20,
    range: 'short, medium'
  };// Troll Elder has Camo spell/ability
  //(makes him much harder to hit)
npc.gaintAdder = {
    name: 'Gaint Adder',
    strength: 6,
    hp: 15,
    mp: 20,
    range: 'short,medium'
  };// Gaint Adder has Hypnotism spell/ability 
// (target loses a turn)
npc.gaintCobra= {
    name: 'Gaint Cobra',
    strength: 22,
    hp: 70,
    mp: 0,
    range: 'short'
  };
  npc.trollHulk = {
    name: 'Troll Hulk',
    strength: 20,
    hp: 80,
    mp: 0,
    range: 'short'
  };
  npc.centaur = {
    name: 'Centaur',
    strength: 16,
    hp: 50,
    mp: 0,
    weapon: 'long range'
    };
    npc.orc = {
    name: 'Orc',
    strength: 26,
    hp: 90,
    mp: 0,
    weapon: 'short range'
  };
  npc.minotaur = {
    name: 'Minotaur',
    strength: 40,
    hp: 100,
    mp: 0,
    weapon: 'medium range'
  };
  npc.humanSoldier = {
    name: 'Soldier',
    strength: 8,
    hp: 25,
    mp: 0,
    weapon: 'any range'
  };
  npc.humanKnight = {
    name: 'Knight',
    strength: 20,
    hp: 60,
    mp: 0,
    weapon: 'short range, medium range'
  };
  npc.dragon = {
    name: 'Dragon',
    strength: 80,
    hp: 500,
    mp: 50,
    range: 'short, medium, long'
  };// Dragon has Flame Breath ability
  // (ranged attack)
  
  // All spells cost 10 mp per cast
  // dmg=strength divided by 2(?) 
  return npc;
});