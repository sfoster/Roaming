console.log('loading region.js');
define([
  'lib/cellgrid',
], function(CellGrid) {

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
    init: function(region) {
      // region.tiles is a flat array with a stub for each of the coords in this region
      region.grid = createRegionGridFromTileStubsArray(region.tiles);
      console.log('initRegion, created grid: ', region.grid);
    }
  };
  console.log('returning Region');
  return Region;
});