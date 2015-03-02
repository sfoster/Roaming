define(['lib/util'], function(util) {

  var playerDefaults = {
    declaredClass: "Player",
    type: "player",
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
      return util.create(playerDefaults, playerData);
    },
    getInventory: function(playerData) {
      // TODO: resolve any references in the inventory slot
      // to return the data they represent
      return [];
    }
  };
  Player.defaults = playerDefaults;
  return Player;
});