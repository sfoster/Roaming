define(['$'], function($){
  var panel = $('main');
  var currentTool = null;
  var tileSize = 50, 
      tilesByCoords = {};
  
  panel
    .delegate('.tile', 'touchstart', function(event){ 
      console.log(event.currentTarget.className + " touched");
    });
  //     

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
        alert("update to world map was: ", resp.status);
      }, 
      error: function(err){ alert(err.message); }
    });
  });

  $('#toollist')
    .delegate('.tool', 'mouseup', function(event){ 
      var type = trim(event.currentTarget.innerText);
      currentTool = type.toLowerCase();
      console.log("change currentTool: ", currentTool);
    });

  var offsets = $('#gridOverlay').offset();
  console.log("offsets: ", offsets);
  $('#gridOverlay').mousedown(function(event){
      var x = Math.floor((event.x - offsets.left) / tileSize), 
          y = Math.floor((event.y - offsets.top) / tileSize);
      console.log("place at: ", x, y);
      if(!currentTool) return;
      
      placeTile(x, y, currentTool);
  });
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
        .appendTo('#gridOverlay')[0];
      console.log("created tile at: ", tile, tileId);
    }
    $(tile).removeClass().addClass('tile '+type);
    console.log("tile has class %s, coords: %s: ", tile.className, tile.getAttribute('data-coords'));
  }
  function fetchMap(){
    $.ajax({
      url: '/location/world.json', 
      dataType: 'json',
      success: function(resp){
        console.log("drawing map data: ", resp);
        resp.tiles.forEach(function(data){
          console.log("drawing map data: ", resp);
          placeTile(data.x, data.y, data.type);
        });
      }, 
      error: function(err){
        alert('Error fetching world data: ' + err.message);
      }
    })
  }
  
  fetchMap();
})