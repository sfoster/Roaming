define([
  'lib/util'
], function(util){

  var encounter = {
    fillDefaults: function(data) {
      if (!data.name) {
        data.name = data.id;
      }
      data.type = 'encounter';
    },
    startEncounter: function(encounter, player, tile, game) {
      console.log('startEncounter:', encounter.startScript);
      if (encounter.startScript) {
        this.scripts[encounter.startScript](encounter, player, tile, game);
      }
    },
    scripts: {
      beginningStart: function(encounter, player, tile, game) {
        console.log(encounter.name, 'player: %o', player);
        game.emit('startingpoint-enter', {
          target: encounter,
          tile: tile
        });
        return new Promise(function(resolve, reject) {
          require(['lib/gameUtil'], function(gameUtil) {
            var lastVisit = gameUtil.lastLocationVisit(player, tile.id);
            if (lastVisit) {
              game.pushMessage(player.name + ': ' + encounter.reVisit, { type: 'foo'});
            } else {
              game.pushMessage(player.name + ': ' + encounter.firstVisit, { type: 'foo'});
            }
            resolve();
          });
        })
      },
      npcStart: function(encounter, player, tile, game) {
        var npcs = tile.npcs;
        console.log('npc encounter start, this: ', encounter);
        if (player.enemyOf(npcs)) {
          game.beginCombat()
        }
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