define(function(){
  'use strict';
  function Grid(entries) {
    // entries is an array of items with .x and .y properties
    this.updateFromArray(entries || [])

    console.assert(!this.length || this.length % this.columnCount == 0,
                  'tiles appear to be uneven grid based on '+this.columnCount+' columns');
  };

  Grid.prototype = {
    get entries() {
      return this._entries;
    },
    get startX() {
      return this._startX;
    },
    get lastX() {
      return this._lastX;
    },
    get startY() {
      return this._startY;
    },
    get lastY() {
      return this._lastY;
    },
    get rows() {
      return this._rows;
    },
    get rowCount() {
      return this._rows.length;
    },
    get columnCount() {
      return 1 + this._lastX - this._startX;
    },
    get length() {
      return this._entries.length;
    },
    constructor: Grid,
    empty: function() {
      this.updateFromArray([])
    },
    updateFromArray: function(tiles) {
      this._entries = tiles;
      console.log('updateFromArray with %s tiles', tiles.length);
      var byRow = this._byRow = {};
      var byId = this._byId = {};
      var rows = this._rows = [];

      var startX = 0, lastX = 0;
      var startY = 0, lastY = 0;

      if (tiles.length) {
        tiles.sort(function(a, b) {
          if (a.y === b.y) {
            return a.x > b.x;
          }
          return a.y > b.y;
        });
        // an arbitrary start/lastX to start - we'll find the max/min in the loop
        startX = lastX = tiles[0].x;
        startY = tiles[0].y;
        lastY = tiles[tiles.length-1].y;

        for (var i=startY; i<=lastY; i++) {
          byRow[i] = [];
          this._rows.push(byRow[i]);
        }
        tiles.forEach(function(tile) {
          var row = byRow[tile.y];
          row.push(tile);
          if (tile.x < startX) {
            startX = tile.x;
          }
          if (tile.x > lastX) {
            lastX = tile.x;
          }
          byId[tile.id] = tile;
        }, this);
      }
      console.log('updateFromArray, got %s rows', this._rows.length, this._rows);
      this._startY = startY;
      this._lastY = lastY;
      this._startX = startX;
      this._lastX = lastX;
    },
    byId: function(id) {
      return this._byId[id];
    },
    atXY: function(x, y) {
      var row = this._rows[y -this.startY];
      if (row) {
        return row.find(function(entry) {
          return entry.x === x;
        });
      }
    },
    updateEntry: function(newEntry) {
      // update the entry in-place with new values.
      // return: the matched entry
      var entry = this.byId(newEntry.id);
      console.assert(entry, 'Attempt to update non-existent entry');
      console.assert(entry.id === newEntry.id, 'Attempt to update entry with mis-matching id');
      for(let key in entry) {
        if (!(key in newEntry)) {
          delete entry[key];
        }
      }
      for(let key in newEntry) {
        entry[key] = newEntry[key];
      }
      return entry;
    }
  };
  return Grid;
});
