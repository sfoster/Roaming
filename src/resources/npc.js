define([], function(){
  
  var npc = {};
  
  npc.goblin = {
    name: 'Goblin',
    strength: 2,
    hp: 10,
    mp: 0,
    notes: ''
  };
npc.hugeRat = {
    name: 'Huge Rat',
    strength: 2,
    hp: 10,
    mp: 0,
    notes: ''
  };
 npc.goblinChamp = {
    name: 'Goblin Champion',
    strength: 4,
    hp: 20,
    notes: ''
  };
 npc.giantRat = {
    name: 'Giant Rat',
    strength: 4,
    hp: 20,
    notes: ''
  };
npc.goblinShaman = {
    name: 'Goblin Shaman',
    strength: 1,
    hp: 5,
    mp: 10,
    notes: 'Goblin Shaman has Damage Aura spell/ability. (doubles the damage of accompanying fighters )'
  };
  
npc.mutantRat = {
    name: 'Mutant Rat',
    strength: 1,
    hp: 5,
    mp: 10,
    notes: 'Mutant Rat has Poison spell/ability. (does half damage for 2-3 turns after attack)'
  };
  
npc.goblinWarlord = {
    name: 'Goblin Warlord',
    strength: 6,
    hp: 30,
    mp: 0,
    notes: ''
  };
npc.ratHorde = {
    name: 'Rat Horde',
    strength: 6,
    hp: 30,
    mp: 0, 
    notes: ''
  };
npc.juvenileTroll = {
    name: 'Juvenile Troll',
    strength: 8,
    hp: 50,
    mp: 0,
    notes: ''
  };
npc.python = {
    name: 'Python',
    strength: 10,
    hp: 30,
    mp: 0,
    notes: ''
  };
npc.troll = {
    name: 'troll',
    strength: 14,
    hp: 60,
    mp: 0,
    notes: ''
  };
npc.anaconda = {
    name: 'Anaconda',
    strength: 16,
    hp: 50,
    mp: 0,
    notes: ''
  };
npc.trollElder = {
    name: 'Troll Elder',
    strength: 4,
    hp: 25,
    mp: 20,
    notes: 'Troll Elder has Camo spell/ability (makes him much harder to hit)'
  };
npc.giantAdder = {
    name: 'Giant Adder',
    strength: 5,
    hp: 15,
    mp: 20,
    notes: 'Gaint Adder has Hypnotism spell/ability (target loses a turn)'
  };
  
  return npc;
});