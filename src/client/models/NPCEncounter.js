define([
	'lib/util',
	'models/Encounter',
	'resources/npc'
], function(util, Encounter, npc){

  var range = function(lbound, ubound){
    var num = Math.round(lbound + Math.random() * (ubound-lbound));
    return num;
  };

  function getNpcTypesForTerrain(terrain, constraints) {
		var npcs = util.values(npc).filter(function(npc){
			return (
				npc.terrain && npc.terrain.indexOf(terrain) > -1
			);
		});
		if(constraints) {
			npcs = npcs.filter(constraints);
		}
		return npcs;
  }

  var NPCEncounter = Encounter.extend({
    group: null,
    type: 'npc-encounter',
    // Spawn a number of npcs
    enter: function(player, game){
      // console.log("added creatures: ", hereCreatures);
      if(!this.group) {
        this.group = this.generateGroup(game.tile, player);
      }
      if(this.group.length){
      	var here = game.tile.here;
      	this.group.forEach(function(npc){
      		here.push(npc);
      	}); 
        game.emit('encounterstart', { target: this });
      }
    },
    generateGroup: function(tile, player){
      var howMany = range(1, 2), 
          hereCreatures = [];
      // add them to the location

      var hereCreatures = [];
      // console.log("NPCEncounter entering terrain: " +  tile.terrain);
      // get the subset of NPCs that exist in this terrain
      // which are close to the players level (hp/health is proxy for level)
      var npcs = getNpcTypesForTerrain(tile.terrain, function(npc){
        return npc.hp < (player.stats.health * 1.5);
      });

      for(var i=0, idx; i<howMany; i++){
        idx = range(0,npcs.length-1);
        // console.log("creature index: ", idx, npcs[idx]);
        hereCreatures.push( npcs[idx] );
      }
      // console.log("available NPCs", npcs);
      // a random number of npcs
      return hereCreatures;
    },
    exit: function(player, game){
      game.emit('encounterend', { target: this });
    }
  });

	return NPCEncounter;
});