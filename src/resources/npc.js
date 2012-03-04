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
  };// Goblin Shaman has Damage Aura spell/ability
  //(doubles the damage of accompanying fighters )
npc.mutantRat = {
    name: 'Mutant Rat',
    strength: 1,
    hp: 5,
    mp: 10
  };// Mutant Rat has Poison spell/ability
  //( does half damage for 2-3 turns after attack )
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
npc.juvinileTroll = {
    name: 'Juvenile Troll',
    strength: 8,
    hp: 50,
    mp: 0
  };
npc.python = {
    name: 'Python',
    strength: 10,
    hp: 30,
    mp: 0
  };
npc.troll = {
    name: 'Troll',
    strength: 10,
    hp: 75,
    mp: 0
  };
npc.anaconda = {
    name: 'Anaconda',
    strength: 14,
    hp: 50,
    mp: 0
  };
npc.trollElder = {
    name: 'Troll Elder',
    strength: 4,
    hp: 25,
    mp: 20
  };// Troll Elder has camo spell/ability
  //(makes him much harder to hit)


  return npc;
});