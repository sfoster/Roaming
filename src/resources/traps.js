define([], function(){
  
  var traps = {};
  
 
   traps.bearTrap= {
    name: 'Bear Trap',
    dmg:10,
    uses: Infinity,
    difficulty: 20/100  
  };
   traps.spikeTrap= {
    name: 'Spike Trap',
    dmg:30,
    uses: 10,
    difficulty: 20/100
  };  
   traps.rockFalltrap= {
    name: 'Falling Rock Trap',
    dmg:50,
    uses: 1,
    difficulty: 50/100  
  };
   
  return traps

});