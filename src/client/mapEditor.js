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

  function editDetail(id){
    console.log("editDetail: ", id);
    var tmpl= $('#detail-template')[0].innerHTML;
    var pattern = /\{\{([^}]+)\}\}/g;
    var $detail = $('#detail');
    $detail.css({
      zIndex: 10,
      display: 'block'
    });
    return;
    // $detail.empty();
    // 
    // Object.keys(npc).forEach(function(id){
    //   var data  = Object.create(tilesByCoords[id]);
    //   data.id = id;
    //   var str = tmpl.replace(pattern, function(m, name){
    //     return (name in data) ? data[name] : "";
    //   });
    //   $(str).appendTo($detail);
    // });
    
  }
  
  function paletteInit(){
    var $terrainList = $('#terrainlist');
    Object.keys(terrainTypes).forEach(function(type){
      $('<li class="panel tool '+type+'"><span>'+type+'</span></li>').appendTo($terrainList);
    });
    var $palette = $('#palette');
    $palette
      .delegate('.tool', 'mouseup', function(event){ 
        $('#palette .tool.active').removeClass('active');
        $(event.currentTarget).addClass('active');
        var type = trim( $(event.currentTarget).text() );
        currentTool = type.replace(/\s+/g, '').toLowerCase();
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

      toolAction(x, y, currentTool);
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

  function toolAction(x,y, type){
    if(terrainTypes[type]){
      placeTile(x,y,type);
    } else if(type=='edittile'){
      editDetail([x,y].join(','));
    } else {
      console.log("tool not implemented: ", type);
    }
  }
  function placeTile(x, y, type){
    var tileId = [x,y].join(','), 
        tile = tilesByCoords[tileId];
    if(!tile){
      // create the tile object
      tile = tilesByCoords[tileId] = {
        x: x, y: y
      };
    }
    tile.type = type;
    
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