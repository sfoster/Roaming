console.log('loading region-ui');
define([
  'lib/util',
  'resources/region',
  'resources/template'
], function(util, Region, template) {

  function trim(str) {
    // TODO: make sure we have a shim
    return str.trim();
  }
  function pluck(ar, p) {
    return ar.map(function(item){
      return item[p];
    });
  }

  function drawAxes(opts) {
    var layer = [
      { assign: 'fillStyle', value: 'rgba(51,51,51,0.5)' },
      // top top x axis
      { call: 'fillRect', value: [0, 0, opts.regionWidth, 12] },
      { call: 'fillRect', value: [0, 0, 12, opts.regionHeight] },
      { assign: 'fillStyle', value: "#fff" },
      { assign: 'font', value: 'normal 8px sans-serif' },
    ];
    for(var i=0; i<=opts.regionWidth/opts.TILE_SIZE; i++) {
      layer.push({ call: 'fillText', value: [ i, i*opts.TILE_SIZE, 0, opts.TILE_SIZE ] });
    }
    for(var i=1; i<=opts.regionHeight/opts.TILE_SIZE; i++) {
      layer.push({ call: 'fillText', value: [ i, 0, i*opts.TILE_SIZE, opts.TILE_SIZE ] });
    }
    return layer;
  }

  var ui = {
    opts: {
    },
    configure: function(opts) {
      for(var key in opts) {
        this.opts[key] = opts[key];
      }
    },
    init: function(region) {
      this.region = region;
      var regionId = this.id = region.id;
      document.getElementById('region-id').innerHTML = regionId;
      document.getElementById('region-id').addEventListener('click', this);

      var tileid = config.tileid || '1,1';
      console.log('init with region: ', this.region, 'tileid: ', tileid);

      // create the grid structure for the whole region,
      // using the stub data we get from the region/index.
      this.regionGrid = region.grid;
      this.setupCanvas(this.region);
      this.centerOnTile(tileid);
      this.registerEvents();
    },
    centerOnTile: function(tileid) {
      console.log('centerOnTile: %s', tileid);
      var xy = tileid.split(',').map(function(val) {
        return parseInt(val);
      });
      var currX = xy[0], currY = xy[1];
      var regionGrid = this.regionGrid;

      Region.updateSimulationAreaAtCoords(this.region, currX, currY, this.opts.APRON_SIZE);
      var simLookup = this.region.simLookup;

      var tileSize = this.opts.TILE_SIZE;
      var colors = this.opts.colors;
      var terrainMap = this.opts.terrainMap;

      // render the grid to the map canvas
      console.log('centerOnTile: regionGrid.length', regionGrid.length);
      var regionTiles = regionGrid.flatten();
      regionTiles.forEach((tile) => {
        var scale = tileSize, x = scale*tile.x, y = scale*tile.y;
        console.assert(tile.terrain && tile.terrain in colors, tile.terrain + " is a valid color");

        terrainMap.push(
          { assign: 'strokeStyle', value: '#000' },
          { assign: 'fillStyle', value: colors[tile.terrain] || colors[tile['default']] },
          { call: 'fillRect', value: [x, y, scale, scale] },
          { call: 'strokeRect', value: [x, y, scale, scale] }
          // { assign: 'fillStyle', value: "#fff" },
          // { call: 'fillText', value: [ tile.id + ': ' + tile.terrain, 3+x, 3+y ] }
        );
        // TODO: also, load the image indicated and paint that in
        if (tile.id in simLookup) {
          terrainMap.push(
            {
              assign: 'fillStyle',
              value: (currX == tile.x && currY == tile.y) ?
                     'rgba(255,51,51,1)' : 'rgba(255,204,102,1)'
            },
            { call: 'fillRect', value: [x + 0.5*tileSize, y + 0.5*tileSize, 3, 3] }
          )
        }
      });

      this.updateMapRenderLayers([ terrainMap, drawAxes(this.opts) ]);

      Region.updateSimulatedTiles(this.region).then((locations, idx) => {
        this.updateTiles();
      });
    },
    registerEvents: function() {
      document.getElementById('mapCanvas')
        .addEventListener('click', this);
    },
    handleEvent: function(evt) {
      if('click' == evt.type) {
        switch(evt.target.id) {
          case 'mapCanvas':
            return this.onMapClick(ui, evt);
          case 'region-id':
            return this.toggleRawData(ui, evt);
        }
      }
    },
    setupCanvas: function (region) {
      this.opts.regionWidth = this.opts.TILE_SIZE * (1+pluck(region.tiles, 'x').reduce(function(a, b){
        return Math.max(a, b);
      })),
      this.opts.regionHeight = this.opts.TILE_SIZE * (1+pluck(region.tiles, 'y').reduce(function(a, b){
        return Math.max(a, b);
      }));
      console.log("regionWidth: %s, regionHeight: %s", this.opts.regionWidth, this.opts.regionHeight);

      var canvasNode = document.getElementById('mapCanvas');
      canvasNode.width = this.opts.regionWidth;
      canvasNode.height = this.opts.regionHeight;
      canvasNode.style.width = this.opts.regionWidth+'px';
      canvasNode.style.height = this.opts.regionHeight+'px';
    },
    onMapClick: function(vm, evt){
      console.log("Click: ", evt);
      var mapRect = evt.target.getBoundingClientRect();
      var x = evt.pageX - mapRect.x,
          y = evt.pageY - mapRect.y;
      var tile_x = Math.floor(x / this.opts.TILE_SIZE),
          tile_y = Math.floor(y / this.opts.TILE_SIZE);
      console.log("tile size: %s, x: %s, y: %s, tile x: %s, tile y: %s", this.opts.TILE_SIZE, x, y, tile_x, tile_y);

      var tileid = tile_x+','+tile_y;
      var hn = document.getElementById('jump_' + tileid);
      if(hn){
        hn.scrollIntoView();
      }
      this.centerOnTile(tileid);

      // location.href = '?location='+region.id+'/'+tile_x+','+tile_y;
    },
    updateMapRenderLayers: function(layers) {
      var ctx = document.getElementById('mapCanvas').getContext('2d');
      layers.forEach(function(instructions){
        instructions.forEach(function(instruct){
          if(instruct.assign) {
            ctx[instruct.assign] = instruct.value;
          } else if(instruct.call) {
            // TODO: maybe require the value to always be an array to optimize a little here
            ctx[instruct.call].apply(ctx, instruct.value instanceof Array ? instruct.value : [instruct.value]);
          }
        });
      });
    },
    updateTiles: function() {
      var simLookup = this.region.simLookup;
      console.log('updateTiles: ', simLookup);
      var simTiles = Object.keys(simLookup).map(id => this.regionGrid.byId(id));
      var itemTemplate = trim(document.getElementById('itemTemplate').innerHTML);
      itemTemplate = template(itemTemplate);
      var tileTemplate = trim(document.getElementById('tileTemplate').innerHTML);
      tileTemplate = template(tileTemplate);

      var container = document.querySelector('#main > ul');
      var tilesHTMLs = simTiles.map(function(tile) {
        var hereHTMLs = (tile.here || []).map(function(item) {
          return itemTemplate(item);
        });
        var encounterHTMLs = (tile.encounters || []).map(function(item) {
          return itemTemplate(item);
        });
        var viewModel = util.create(tile, {
          parentId: this.id,
          hereListHTML: hereHTMLs.join('\n'),
          encountersListHTML: encounterHTMLs.join('\n'),
        });
        // console.log('updateTiles, create viewModel from tile: ', tile, viewModel);
        var tileHTML = tileTemplate(viewModel);
        return tileHTML;
      }, this);
      container.innerHTML = tilesHTMLs.join('\n');
    },
    toggleRawData: function(evt) {
      document.getElementById('region-raw-data').classList.toggle('showing');
      document.getElementById('region-id').classList.toggle('showing');
    }
  };

  console.log('returning region-ui');
  return ui;
});