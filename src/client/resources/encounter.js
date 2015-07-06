define([
  'lib/util'
], function(util){

  function lastLocationVisit(playerData, tileId) {
    var visits = playerData.visits || [];
    for(var idx = visits.length -1; idx >= 0; idx--) {
      if (visits[idx].id === tileId) {
        return visits[idx];
      }
    }
    return null;
  }

  var encounter = {
    fillDefaults: function(data) {
      if (!data.name) {
        data.name = data.id;
      }
      data.type = 'encounter';
    },
    startEncounter: function(encounter, player, tile, game) {
      if (encounter.startScript) {
        this.scripts[encounter.startScript](encounter, player, tile, game);
      }
    },
    scripts: {
      beginningStart: function(encounter, player, tile, game) {
        console.log(encounter.name, 'player: %o', player);
        var lastVisit = lastLocationVisit(player, tile.id);
        if (lastVisit) {
          alert(player.name + ': ' + encounter.reVisit);
        } else {
          alert(player.name + ': ' + encounter.firstVisit);
        }
      },
      npcStart: function(encounter, player, tile, game) {
        var npcs = tile.npcs;
        console.log('npc encounter start, this: ', encounter);
        alert(npcs.length + ' ' + encounter.grouptype + ' are present');
      },
      npcEnd: function(encounter, player, tile, game) {
        var npcs = tile.npcs;
        console.log('npc encounter end, this: ', encounter);
        alert(npcs.length + ' ' + encounter.grouptype + ' are present');
      }
    }
  };
  return encounter;
});