define([
      'resources/location',
      'resources/item',
      'resources/encounter',
      'resources/player',
      'resources/terrain',
      'components/tile-summary.js',
      'components/screen-header.js',
], function(Tile, Item, Encounter, Player, Terrain,
            tileSummary, screenHeader) {
  'use strict';
  var Level = {
    components: {
      tileSummary,
      screenHeader,
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
