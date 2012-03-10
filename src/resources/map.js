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
       if(0 === total){
         cb(loadedImages);
       }
      });
    });
  }
   
  var canvas, ctx;
      
  function getImageData(img, options){
    options = options || {};
    ctx = canvas.getContext("2d");
    var x = 0, y = 0, width = options.width || img.width, height = options.height || img.height;
    canvas.height = height; 
    canvas.width = width;
    ctx.drawImage(img, x, y);
    var imgd = ctx.getImageData(x, y, width, height);
    var imxpxl = imgd.data;
    return imxpxl;
  }
  function getImageUrlData(img, options){
    options = options || {};
    ctx = canvas.getContext("2d");
    var x = 0, y = 0, width = options.width || img.width, height = options.height || img.height;
    canvas.height = height; 
    canvas.width = width;
    ctx.drawImage(img, x, y);
    return canvas.toDataURL();
  }
  
  function rgbToHex(r,g,b){
    // 0 = 48, 9 = 57
    var str = "", n;
    for(var i=0, len=arguments.length; i<len; i++){
      n = Math.floor(arguments[i]/16);
      str += (n > 9) ?  String.fromCharCode(64+n-9) : n;
    }
    return str;
  }
  
  return {
    init: function(cb){
      canvas = this.canvasNode = document.createElement("canvas");
      canvas.style.cssText = "display:block;margin:4px auto";
      canvas.id = "map_offscreen";
      ctx = canvas.getContext("2d");
      
      document.body.appendChild(canvas);
      
      loadImages(
        Object.keys(terrainTypes).map(function(name){ 
          return terrainTypes[name].url; 
        }), 
        function(urlsImageMap){
          // populate the .img property of our terrains, now that those images are loaded
          Object.keys(terrainTypes).forEach(function(name){
            terrainTypes[name].img = urlsImageMap[ terrainTypes[name].url ];
          });
          cb && cb();
        }
      );
    },
    renderMap: function(mapData, options) {
      console.log("renderMap with ", mapData.length);
      options = options || {};
      // loop over the array of locations
      // we *assume* the images are all loaded by now
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
    },
    loadMap: function(img, cb){
      var map = new Image(img.width, img.height);
      var loaded = function () {
        var data = getImageData(this),
            width = map.height, 
            height = map.width, 
            col = 0, row = 0, 
            rows = [],
            value, 
            str="";
        // console.log("image data for width: %s, height: %s", width, height)

        // create variables 'i' with an intial value of 0
        // and n with a value that is the length of the image data collection
        
        // for as long as
        //    i is less than the length of the image data collection
        //    do this stuff
        //    then add 4 to il
        for (var i = 0, n = data.length; i < n; i += 4) {
          // i+3 is alpha
          col = i/4 % width;
          row = (i/4 - col) / width;
          // treat colors with less than 0.5 opacity as white
          value = (data[i+3] >= 128) ? rgbToHex(data[i], data[i+1], data[i+2]) : rgbToHex(255,255,255);
          // console.log("col: %s, row: %s, value: %s", col, row, value);
          if(col){
            rows[row].push(value); 
          } else {
            rows[row] = [value]; 
          }
        }
        map.removeEventListener("load", loaded, false);
        cb(rows);
      };
      map.addEventListener("load", loaded, false);
      map.src = img.src;
    }
  };
});