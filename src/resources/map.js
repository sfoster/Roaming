define(['$', 'text!data/terrain.json'], function($, terrainTypes){
  if('string' == typeof terrainTypes) {
    terrainTypes = JSON.parse(terrainTypes);
  }
  
  function loadImages(urls, cb){
    urls = urls ? (urls instanceof Array) ? urls : [urls] : [];
    var loadedImages = {}, 
        total=urls.length;

    urls.forEach(function(url){
      require(['image!'+url], function(img){
       total--;
       loadedImages[url] = img;
       if(0 === total){ cb(loadedImages); }
      });
    });
  }
  
  function pluck(ar, pname) {
    return ar.map(function(item){
      return item[pname];
    });
  }
  function values(obj){
    return Object.keys(obj).map(function(name){
      return obj[name];
    });
  }
   
  var canvas, ctx;
      
  return {
    init: function(cb){
      canvas = this.canvasNode = document.createElement("canvas");
      canvas.style.cssText = "display:block;margin:4px auto";
      canvas.id = "map_offscreen";
      ctx = canvas.getContext("2d");
      
      document.body.appendChild(canvas);
      
      var imageUrls = pluck(values(terrainTypes), 'url');
      loadImages(
        imageUrls, function(urlsImageMap){
          // populate the .img property of our terrains, now that those images are loaded
          Object.keys(terrainTypes).forEach(function(name){
            terrainTypes[name].img = urlsImageMap[ terrainTypes[name].url ];
          });
          if(cb) cb();
        }
      );
    },
    renderMap: function(mapData, options) {
      console.log("renderMap with ", mapData.length);
      options = options || {};
      // loop over the array of locations
      var tile = null, 
          img = null,
          terrain = null,
          tileSize = 10,
          str = 'data:image/png;base64,';
          ctx = this.canvasNode.getContext("2d");
      
      for(var i=0; i<mapData.length; i++){
        tile = mapData[i];
        terrain = terrainTypes[tile.type];
        if(terrain){
          img = terrain.img;
          if(img){
            // console.log("render image for type: ", tile.type, " with url: ", terrainTypes[tile.type].url);
            ctx.drawImage(img, tileSize*tile.x, tileSize*tile.y, tileSize, tileSize);
          } else {
            console.log("no img property in: ", terrainTypes[tile.type]);
          }
        } else {
          console.warn("unknown terrain type in: ", tile);
        }
      }
      return this.canvasNode;
    }

  };
});