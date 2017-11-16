define([
      'resources/location',
      'resources/item',
      'resources/encounter',
      'resources/player',
      'resources/terrain',
      'components/tile-summary',
      'components/screen-header',
      'components/player-summary',
], function(Tile, Item, Encounter, Player, Terrain,
            tileSummary, screenHeader, playerSummary) {
  'use strict';
  var Level = {
    components: {
      tileSummary,
      screenHeader,
      playerSummary,
    },
    resources: {
      Tile,
      Item,
      Encounter,
      Player,
      Terrain
    },
  };
  return Level;
});
