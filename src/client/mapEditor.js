define(['$', 'resources/util', 'resources/Promise', 'resources/map', 'resources/terrain'], function($, util, Promise, map, terrainTypes){

  var pluck = util.pluck, 
      values = util.values, 
      keys = util.keys, 
      mixin = util.mixin,
      when = Promise.when;

  var currentTool = 'barren';
  var mapNode = null;
  var tileSize = 50, 
      worldSize = { width: 25, height: 25},
      tilesByCoords = {};
  
  //     
  function toolbarInit(){
    $('#saveBtn').click(function(evt){
      var locations = values(tilesByCoords).map(function(tile){
        var locn = mixin({}, tile);
        delete locn.img;
        return locn;
      });

      console.log("saving this: ", locations);
      $.ajax({
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        url: '/location/world.json',
        data: JSON.stringify(locations),
        success: function(resp){
          console.log("save response: ", resp);
          alert("update to world map was: "+ resp.status);
        }, 
        error: function(xhr){ 
          console.log("error saving map: ", xhr.status);
          alert("Unable to save map right now"); 
        }
      });
      
    });
    $('#resetBtn').click(function(evt){
      // re-fetch the map data and re-render
      populateMap();
    })
  }

  function paletteInit(){
    var $toollist = $('#toollist');
    Object.keys(terrainTypes).forEach(function(type){
      $('<li class="panel tool '+type+'"><span>'+type+'</span></li>').appendTo($toollist);
    });

    $toollist
      .delegate('.tool', 'mouseup', function(event){ 
        $('#toollist .tool.active').removeClass('active');
        $(event.currentTarget).addClass('active');
        var type = trim( $(event.currentTarget).text() );
        currentTool = type.toLowerCase();
        console.log("change currentTool: ", currentTool);
      });

  }
  
  function editorInit(){
    $('#gridOverlay, #map').css({
      width: worldSize.width*tileSize,
      height: worldSize.height*tileSize
    });
    mapNode = $('#grid')[0];
    mapNode.width = worldSize.width*tileSize;
    mapNode.height = worldSize.height*tileSize;
    
    var scrollContainerNode = $('#main')[0],
        mapOffsets = $('#map').offset();
        
    $('#gridOverlay').mousedown(function(event){
      var scrollOffsets = {
        left: scrollContainerNode.scrollLeft,
        top: scrollContainerNode.scrollTop
      };
      console.log("scrollContainerNode offsets: ", mapOffsets);
      console.log("scrollOffsets: ", scrollOffsets);
      console.log("event.pageX,Y: ", event.pageX, event.pageY);
      var clickX = event.pageX - mapOffsets.left + scrollOffsets.left,
          clickY = event.pageY - mapOffsets.top + scrollOffsets.top,
          x = Math.floor(clickX / tileSize),
          y = Math.floor(clickY / tileSize);
      console.log("place at: ", x, y);
      if(!currentTool) return;

      placeTile(x, y, currentTool);
    });
  }

  function populateMap(){
    map.init().then(function(){
      require(['json!data/location/world.json'], function(mapData){
        // console.log("loaded mapData: ", mapData);
        mapData.forEach(function(tile){
          var tileId = [tile.x, tile.y].join(',');
          tilesByCoords[tileId] = tile;
        });
        map.renderMap( mapData, {
          tileSize: tileSize,
          canvasNode: mapNode
        });
      });
    });
    
  }
  function init(){
    toolbarInit();
    paletteInit();
    editorInit();
    populateMap();
  }


  function trim(text){
    return text.replace(/^\s+/, '').replace(/\s+$/, '');
  }

  function placeTile(x, y, type){
    var tileId = [x,y].join(','), 
        tile = tilesByCoords[tileId];
    if(!tile){
      // create the tile object
      tile = tilesByCoords[tileId] = {
        x: x, y: y, type: type
      };
    }
    var img = tile.img = terrainTypes[type].img, 
        ctx = mapNode.getContext('2d');

    if(!img) {
      console.log("no image?", tile, img);
    }
    ctx.clearRect(
        tileSize*tile.x,        // dest-x
        tileSize*tile.y,        // dest-y
        tileSize,               // dest-width
        tileSize                // dest-height
    );
    
    if(img && type !== 'clear'){
      ctx.drawImage(
          img,                    // image
          0,                      // source-x
          0,                      // source-y
          tileSize,              // source-width
          tileSize,             // source-height
          tileSize*tile.x,        // dest-x
          tileSize*tile.y,        // dest-y
          tileSize,               // dest-width
          tileSize                // dest-height
      );
    }
  }

  init();
});