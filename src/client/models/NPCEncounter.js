define([
	'lib/util',
	'models/Encounter',
  'models/npc',
	'resources/npc'
], function(util, Encounter, NpcModel, npc){

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

    // predefined NPC groups.
    // The player's level will be used to find the right count in the min-max range
   var npcGroups = {
      'goblins': [
        { id: 'goblin', min: 1, max: 4 },
        { id: 'goblinChamp', min: 0, max: 1 },
        { id: 'goblinShaman', min: 0, max: 1 },
        { id: 'goblinWarlord', min: 0, max: 1 },
        { id: 'angryDog', min: 0, max: 4 }
      ],
      'rats': [
        { id: 'hugeRat', min: 0, max: 4 },
        { id: 'giantRat', min: 1, max: 3 },
        { id: 'mutantRat', min: 1, max: 2 },
        { id: 'ratLord', min: 0, max: 1 }
      ],
      'trolls': [
        { id: 'troll', min: 1, max: 4 },
        { id: 'juvinileTroll', min: 0, max: 3 },
        { id: 'trollElder', min: 0, max: 1 },
        { id: 'trollHulk', min: 0, max: 1 }
      ],
      'dogs': [
        { id: 'angryDog', min: 1, max: 5 },
        { id: 'rabidDog', min: 0, max: 1 }
      ],
      terrainGroup: function(terrain) {
        // return a single randomly picked creature
        // that's appropriate to the terrain
        var candidates = [];
        Object.keys(npc).filter(function(id){
          // side-effect - assign an id if there's none
          var thing = npc[id];
          if(!thing.id) thing.id = id;
          if(thing.terrain && thing.terrain.indexOf(terrain) > -1) {
            candidates.push(thing);
          }
        });
        var creature = candidates[Math.round( candidates.length * Math.random() )];
        return [
          { id: creature.id, min: 1, max: 1 }
        ];

      }
    };

  var NPCEncounter = Encounter.extend({
    group: null,
    type: 'npc-encounter',
    grouptype: '',
    difficulty: 1,
    description: 'Oh oh, you run smack into trouble.',
    // Spawn a number of npcs
    enter: function(player, game){
      // expand any npc placeholders
      var tile = game.tile,
          npcs = game.tile.npcs || (game.tile.npcs = []);

      var now = game.now();
      var id = game.locationToString(game.tile),
          locationHistory = player.history[id],
          sinceLastVisit = now - (locationHistory.lastVisit || 0);
      console.log("NPCEncounter sinceLastVisit: ", sinceLastVisit);

      var NPC_ATTENTION_SPAN = 60;
      var NPC_SPAWN_INTERVAL = 180;
      // remove bored npcs
      npcs = game.tile.npcs = npcs.filter(function(npc){
        var since =  now - (npc.spawned || now);
        // only keep recent or not-spawned NPCs
        return since < NPC_ATTENTION_SPAN;
      });

      if(sinceLastVisit > NPC_SPAWN_INTERVAL) {
        console.log("Player not here recently, generate NPCs");
        this.generateGroup(game.tile, player).forEach(function(npc){
          console.log("Adding npc: ", npc);
          npc.spawned = now;
          npcs.push(npc);
        });
      } else {
        console.log("Player was just here recently, no more NPCs generated");
      }
      game.emit('encounterstart', { target: this });
    },
    generateGroup: function(tile, player){
      var hereCreatures = [];
      // assemble a group of NPCs

      var hereCreatures = [];
      var groupDefinition = this.grouptype ?
                              npcGroups[this.grouptype] : npcGroups.terrainGroup(tile.terrain);

      var quota = this.difficulty * player.level || 1,
          creatureDefn = null;
      for(var howMany, i=0; quota && i<groupDefinition.length; i++) {
        creatureDefn = groupDefinition[i];
        // determine how many within the range based on the remaining quota
        howMany = range(creatureDefn.min, Math.min(quota/2, creatureDefn.max));
        quota -= howMany;
        while(howMany--) {
          hereCreatures.push( new NpcModel(npc[creatureDefn.id]) );
        }
      }
      // a random number of npcs
      return hereCreatures;
    },
    exit: function(player, game){
      game.emit('encounterend', { target: this });
    }
  });

	return NPCEncounter;
});