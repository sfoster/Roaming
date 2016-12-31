define(['lib/util'], function(util) {

  var playerDefaults = {
    declaredClass: "Player",
    type: "player",
    affinity: 'hero',
    name: "You", // by default
    level: 1,
    luck: 50/100,
    icon: "./resources/graphics/HeroIcon.png",
    currentWeapon: 'fishingSpear', // by default
    history: null,
    score: 0,
    // stats
    level: 1,
    health: 12,
    strength: 12,
    mana: 5,
    visits: null,
    equipped: null,
  };

  var Player = {
    fillDefaults: function(playerData) {
      for(var i in playerDefaults) {
        if(!playerData.hasOwnProperty(i)) {
          playerData[i] = playerDefaults[i];
        }
      }
      return playerData;
    },
    getInventory: function(playerData) {
      // TODO: resolve any references in the inventory slot
      // to return the data they represent
      return [];
    },
    areEnemies: function(actor0, actor1) {
      console.log('areEnemies: ', actor0.affinity, actor1.affinity);
      var idx0 = AFFINITY_TYPES.indexOf(actor0.affinity);
      var idx1 = AFFINITY_TYPES.indexOf(actor1.affinity);
      console.assert(idx0 >= 0, 'Affinity is a known type: '+actor0.affinity);
      console.assert(idx1 >= 0, 'Affinity is a known type: '+actor1.affinity);
      var isEnemy = ENEMY_TRUTH_TABLE[idx0][idx1] ||
                    ENEMY_TRUTH_TABLE[idx1][idx0];
      return isEnemy;
    }
  };

  // hostility truth tables
  var AFFINITY_TYPES = ['monster', 'wildlife', 'indigene', 'hero'];
  var ENEMY_TRUTH_TABLE = [
    [1,1,1,1],
    [1,0,0,1],
    [1,0,0,0],
    [1,0,0,0],
  ];

  Player.AFFINITY_TYPES = AFFINITY_TYPES;
  Player.ENEMY_TRUTH_TABLE = ENEMY_TRUTH_TABLE;
  Player.defaults = playerDefaults;

  return Player;
});