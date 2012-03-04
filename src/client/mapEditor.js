define(['$'], function($){
  var panel = $('main');
  var currentTool = 'barren';
  var tileSize = 50, 
      worldSize = { width: 25, height: 25},
      tilesByCoords = {};
  
  //     
  function toolbarInit(){
    $('#saveBtn').click(function(evt){
      var tiles = Object.keys(tilesByCoords).map(function(id){
        var node =  tilesByCoords[id], 
            type = node.className.replace(/tile\s*/, ''), 
            xy = id.split(',').map(Number);
        return { x: xy[0], y: xy[1], type: type };
      });

      console.log("saving this: ", tiles);
      $.ajax({
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        url: '/location/world.json',
        data: JSON.stringify(tiles),
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
  }
  function init(){
    toolbarInit();
    
    fetchMap();
    
    $('#grid, #gridOverlay, #map').css({
      width: worldSize.width*tileSize,
      height: worldSize.height*tileSize
    });

    $('#toollist')
      .delegate('.tool', 'mouseup', function(event){ 
        $('#toollist .tool.active').removeClass('active');
        $(event.currentTarget).addClass('active');
        var type = trim( $(event.currentTarget).text() );
        currentTool = type.toLowerCase();
        console.log("change currentTool: ", currentTool);
      });

    // var offsets = $('#gridOverlay').offset();
    // console.log("offsets: ", offsets);
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
      var clickX = event.pageX - mapOffsets.left + scrollOffsets.left;
      var clickY = event.pageY - mapOffsets.top + scrollOffsets.top;
      x = Math.floor(clickX / tileSize), 
      y = Math.floor(clickY / tileSize);
      console.log("place at: ", x, y);
      if(!currentTool) return;

      placeTile(x, y, currentTool);
    });
  }


  function trim(text){
    return text.replace(/^\s+/, '').replace(/\s+$/, '');
  }

  function placeTile(x, y, type){
    var tileId = [x,y].join(',');
    var tile = tilesByCoords[tileId];
    if(!tile){
      tile = tilesByCoords[tileId] = $('<div class="tile" data-coords="'+tileId+'"></div>')
        .css({
          left: x*tileSize, top: y*tileSize,
          width: tileSize, height: tileSize
        })
        .appendTo('#map')[0];
      // console.log("created tile at: ", tile, tileId);
    }
    $(tile).removeClass().addClass('tile '+type);
    // console.log("tile has class %s, coords: %s: ", tile.className, tile.getAttribute('data-coords'));
  }
  function fetchMap(){
    $.ajax({
      url: '/location/world.json', 
      dataType: 'json',
      success: function(resp){
        // console.log("drawing map data: ", resp);
        resp.tiles.forEach(function(data){
          placeTile(data.x, data.y, data.type);
        });
      }, 
      error: function(err){
        alert('Error fetching world data: ' + err.message);
      }
    })
  }
  
  init();
})