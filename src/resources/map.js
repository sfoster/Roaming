define(function(){
  
  var canvas, 
      ctx;
      
  function getImageData(img){
    ctx = canvas.getContext("2d");
    var x = 0, y = 0, width = img.width, height = img.height;
    canvas.height = height; 
    canvas.width = width;
    ctx.drawImage(img, x, y);
    var imgd = ctx.getImageData(x, y, width, height);
    var imxpxl = imgd.data;
    return imxpxl;
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
    init: function(){
      canvas = this.canvasNode = document.createElement("canvas");
      canvas.style.cssText = "display:block;margin:4px auto";
      canvas.id = "map_offscreen";
      document.body.appendChild(canvas);
    },
    loadMap: function(img, cb){
      var map = new Image(img.width, img.height)
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
  }
})