console.log('loading region.js');
define([
  'lib/util',
  'lib/resolve',
  'lib/cellgrid',
  'resources/location',
  'resources/item',
  'resources/encounter'
], function(util, resolve, CellGrid, Tile, Item, Encounter) {

  function isTileStub(tile) {
    return !(tile._stub || tile.hasOwnProperty('here'));
  }

  function createRegionGridFromTileStubsArray(stubs) {
    console.log('createRegionGridFromTileStubsArray: ', stubs);
    console.assert(stubs.length, 'empty tile stubs array passed to createGridFromTilesArray');
    var tiles = stubs.map(function(stub) {
      if (!stub.id) {
        stub.id = stub.x+','+stub.y;
        stub.terrain = stub.type;
        stub.regionId = regionId;
      }
      return stub;
    });
    console.log('createRegionGridFromTileStubsArray, CellGrid: ', CellGrid);
    var grid = new CellGrid(tiles);
    console.log('createRegionGridFromTileStubsArray, created grid: ', grid);
    return grid;
  }

  var Region = {
    init: function(region, startX, startY, apronSize) {
      // region.tiles is a flat array with a stub for each of the coords in this region
      if (!apronSize) { apronSize = 1; }
      if (!startX) { startX = 0; }
      if (!startY) { startY = 0; }
      region.grid = createRegionGridFromTileStubsArray(region.tiles);
      this.updateSimulationAreaAtCoords(region, startX, startY, apronSize);
      console.log('initRegion, created grid: ', region.grid);
    },
    updateSimulationAreaAtCoords: function(region, startX, startY, apronSize) {
      region.simLookup = this.getSimulatedTileIdMap(region, startX, startY, apronSize);
    },
    getSimulatedTileIdMap: function(region, centerX, centerY, apronSize) {
      var grid = region.grid;
      console.log('getSimulatedTileIdMap: centerX: %s, centerY: %s, apronSize: %s',
                  centerX, centerY, apronSize);
      var minX = Math.max(0, centerX - apronSize),
          minY = Math.max(0, centerY - apronSize);
      var maxX = Math.min(centerX + apronSize, grid.columnCount -1);
      var maxY = Math.min(centerY + apronSize, grid.rowCount -1);
      var sliceSize = 1 + (2 * apronSize);

      var simTiles = {};
      var tile;
      var tileRows = grid.rows;
      // grab the surrounding tiles
      for(var y=minY; y<=maxY; y++) {
        for(var x=minX; x<=maxX; x++) {
          tile = grid.atXY(x,y);
          console.assert(tile, 'found tile at '+x+','+y);
          simTiles[tile.id] = tile;
        }
      }
      return simTiles;
    },
    updateSimulatedTiles: function(region) {
      // load in tiles in the simulated area, and unload those outside
      var regionGrid = region.grid;
      var regionTiles = regionGrid.flatten();
      var simLookup = region.simLookup;
      var loadPromises = [];

      regionTiles.forEach((stub, idx) => {
        if (stub.id in simLookup) {
          console.log('centerOnTile: tile %s in sim area, needs loading?', stub.id, isTileStub(stub));
          if (isTileStub(stub)) {
            // resolve stub to actual location entity
            var resourceId = 'location/' + regionId + '/' + stub.id;
            var promise = resolve.resolveResource(resourceId).then(function(locn) {
              // console.log('resolve location: ', resourceId, locn);
              var tile = util.mixin({
                _stub: stub
              }, stub, locn);
              Tile.fillDefaults(tile);
              tile.here.forEach(function(item) {
                Item.fillDefaults(item);
              });
              tile.encounters.forEach(function(item) {
                Encounter.fillDefaults(item);
              });
              regionGrid.update(tile.id, tile);
              console.log('Replaced tile stub: ', tile.id, tile);
              // locn.npcs.forEach(function(item) {
              //   Item.fillDefaults(item);
              // });
              return tile;
            });
            loadPromises.push(promise);
          } else {
            // already loaded, leave it
            console.log('tile %s in sim area, but is already loaded', stub.id);
          }
        } else {
          console.log('centerOnTile: tile %s outside sim area, is stub?', isTileStub(stub.id), stub);
          if (isTileStub(stub)) {
            console.log('leave tile %s as-is', stub.id);
            // leave it
          } else {
            // freeze it
            console.log('tile %s loaded but now falls outside sim area', stub.id, stub._stub);
            this.unloadTile(region, stub.id);
          }
        }
      });
      return Promise.all(loadPromises);
    },
    unloadTile: function(region, tile) {
      var regionGrid = region.grid;
      if (typeof tile === 'string') {
        tile = regionGrid.byId(tile)
      }
      if (!isTileStub(tile)) {
        console.log('unloadTile: unloading %s', tile.id);
        // TODO: signal that we're unloading the tile?
        regionGrid.update(tile.id, tile._stub);
      }
    },
  };
  console.log('returning Region');
  return Region;
});