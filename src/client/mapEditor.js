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
})