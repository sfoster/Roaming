define(['$', 'resources/util', 'resources/Promise'], function($, util, Promise){
  
  var pluck = util.pluck, 
      values = util.values, 
      keys = util.keys;
  
  var terrainTypes;

  var canvas, ctx;
    
  var initialized = false;  
  var map = {
    init: function(cb){
      // lazy-load the terrain module
      var loadedPromise = new Promise();
      if(initialized){
        // had some trouble with Promise.when.. 
        // so for now we force asnyc
        setTimeout(function(){
          loadedPromise.resolve(true);
        },0);
      } else{
        canvas = this.canvasNode = document.createElement("canvas");
        canvas.style.cssText = "display:block;margin:4px auto";
        canvas.id = "map_canvas";

        require(['resources/terrain'], function(terrain){
          terrainTypes = terrain;
          return loadedPromise.resolve(true);
        });
        initialized = true;
      }
      return loadedPromise;
    },
    renderMap: function(mapData, options) {
      options = options || {};
      // loop over the array of locations
      var tile = null, 
          img = null,
          terrain = null,
          tileSize = options.tileSize || 10,
          ctx = (options.canvasNode || this.canvasNode).getContext("2d");
      
      console.log("renderMap at ", tileSize);
      for(var i=0; i<mapData.length; i++){
        tile = mapData[i];
        terrain = terrainTypes[tile.type];
        
        if(terrain){
          img = terrain.img;
          if(img){
            // console.log("render image for type: ", tile.type, " with url: ", terrainTypes[tile.type].url);
            ctx.drawImage(
                img,                    // image
                0,                      // source-x
                0,                      // source-y
                tileSize,               // source-width
                tileSize,               // source-height
                tileSize*tile.x,        // dest-x
                tileSize*tile.y,        // dest-y (relative to moveTo)
                tileSize,               // dest-width
                tileSize                // dest-height
            );
            // console.log("drawImage: ", img, tileSize*tile.x, tileSize*tile.y, tileSize, tileSize);
          } else {
            console.log("no img property in: ", terrainTypes[tile.type]);
          }
          if(options.showCoords) {
            ctx.fillStyle = 'rgba(51,51,51,0.5)';
            ctx.fillRect(tileSize*tile.x, tileSize*tile.y, 24, 12);
            ctx.fillStyle = "#ffc"
            ctx.textBaseline = 'top';
            ctx.font = 'normal 9px sans-serif';
            ctx.fillText( tile.x+","+tile.y, tileSize*tile.x+1, tileSize*tile.y+1 );
          }
          
        } else {
          console.warn("unknown terrain type in: ", tile);
        }
      }
      return this.canvasNode;
    }
  };
  return map;
});