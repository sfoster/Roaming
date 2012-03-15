define([], function(){
  
  var traps = {};
  
 
   traps.bearTrap= {
    name: 'Bear Trap',
    dmg:10,
    uses: Infinity,
    difficulty: 80/100  
  };
   traps.spikeTrap= {
    name: 'Spike Trap',
    dmg:50,
    uses: 10,
    difficulty: 80/100
  };  
   traps.rockFalltrap= {
    name: 'Falling Rocks Trap',
    dmg:40,
    uses: 1,
    difficulty: 50/100  
  };
    traps.boulderFalltrap= {
    name: 'Falling Boulder Trap',
    dmg:60,
    uses: 1,
    difficulty: 30/100  
  };
  return traps

});