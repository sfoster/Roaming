define(function(){
  console.log('cellgrid.js');
  function CellGrid(cells) {
    this.updateFromArray(cells);
    console.assert(this.length % this.columnCount == 0,
                  'cells appear to be uneven grid based on '+this.columnCount+' columns');
  };
  CellGrid.prototype = Object.create(Object.prototype, {
    'rows' : {
      get: function() {
        return this._rows.map((row) => {
          return row.map((cellId) => this._byId[cellId]);
        });
      }
    },
    'rowCount': {
      get: function() { return this._rows.length; }
    },
    'columnCount': {
      get: function() {
        return this._rows.length ? this._rows[0].length : -1;
      }
    },
    'length': {
      get: function() {
        return this._rows.reduce(function(result, cols) {
          return result + cols.length;
        }, 0);
      }
    },
    ids: {
      get: function() {
        return Object.keys(this._byId);
      }
    }
  });
  CellGrid.prototype.constructor = CellGrid;
  CellGrid.prototype.empty = function() {
    Object.keys(this).forEach(function(pname) {
      this[pname] = null;
      delete this[pname];
    }, this);
    return this;
  };
  CellGrid.prototype.update = function(id, cellValue) {
    return (this._byId[id] = cellValue);
  };
  CellGrid.prototype.updateFromArray = function(cells) {
    var self = this;
    var rows = this._rows = [];
    var byId = this._byId = {};
    var currRow, currY;
    var offsetX = cells.length;
    var offsetY = offsetX;

    cells.forEach(function(cell) {
      if (cell.x < offsetX) {
        offsetX = cell.x;
      }
      if (cell.y < offsetY) {
        offsetY = cell.y;
      }
    });
    this.offsetX = offsetX;
    this.offsetY = offsetY;

    cells.forEach(function(cell) {
      if (cell.y !== currY) {
        currY = cell.y;
        currRow = rows[currY-offsetY] = [];
      }
      // for by-id lookup
      self._byId[cell.id] = cell;
      // just stash the id in the row/column address
      currRow[cell.x-offsetX] = cell.id;
    });
  };
  CellGrid.prototype.flatten = function() {
    var cells = [];
    var byId = this._byId;
    this._rows.forEach(row => {
      cells.push.apply(cells, row.map((cellId) => byId[cellId]));
    });
    return cells;
  };
  CellGrid.prototype.byId = function(id) {
    return this._byId[id];
  };
  CellGrid.prototype.atXY = function(x,y) {
    var cellId = this._rows[y] && this._rows[y][x];
    return cellId && this._byId[cellId];
  };

  return CellGrid;
});