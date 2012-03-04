define([], function(){
  
  var npc = {};
  
  npc.goblin = {
    name: 'Goblin',
    strength: 2,
    hp: 10,
    mp: 0
  };
npc.hugeRat = {
    name: 'Huge Rat',
    strength: 2,
    hp: 10,
    mp: 0
  };
 npc.goblinChamp = {
    name: 'Goblin Champion',
    strength: 4,
    hp: 20,
    mp: 0
  };
 npc.giantRat = {
    name: 'Giant Rat',
    strength: 4,
    hp: 20,
    mp: 0
  };
npc.goblinShaman = {
    name: 'Goblin Shaman',
    strength: 1,
    hp: 5,
    mp: 10
  };
npc.mutantRat = {
    name: 'Mutant Rat',
    strength: 1,
    hp: 5,
    mp: 10
  };
npc.goblinWarlord = {
    name: 'Goblin Warlord',
    strength: 6,
    hp: 30,
    mp: 0
  };
npc.ratHorde = {
    name: 'Rat Horde',
    strength: 6,
    hp: 30,
    mp: 0
  };


  return npc;
});