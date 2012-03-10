define([
  "image!resources/graphics/clear.gif",
  "image!resources/graphics/dryground.jpg",
  "image!resources/graphics/desertground.jpg",
  "image!resources/graphics/marshyground.png",
  "image!resources/graphics/mountianground.png",
  "image!resources/graphics/grassground.jpg",
  "image!resources/graphics/water.jpg",
  "image!resources/graphics/abyss.jpg"
], function(
  clearImg,
  dryGroundImg, 
  desertImg, 
  marshImg, 
  mountainsImg, 
  plainsImg,
  waterImg,
  abyssImg
){
  var tmpContainer = document.createElement("div");
      tmpContainer.style.cssText = 'position: absolute; top: -2000px; left: -2000px; width: 1000px; height: 1000px';
  
  [
      clearImg,
      dryGroundImg, 
      desertImg, 
      marshImg, 
      mountainsImg, 
      plainsImg
  ].forEach(function(img){
    if(!(img.width && img.height)){
      tmpContainer.removeChild(tmpContainer.firstChild);
      tmpContainer.appendChild(img);
      console.log("measure image: ", img, img.offsetWidth, img.offsetHeight);
    } else {
      // console.log("image has dimensions: ", img, img.width, img.height);
    }
  });
  return {
    "clear":      { img: clearImg },
    "barren":     { img: desertImg  },
    "desert":     { img: dryGroundImg }, 
    "marsh":      { img: marshImg },
    "mountains":  { img: mountainsImg },
    "plains":     { img: plainsImg },
    "water":     { img: waterImg },
    "abyss":     { img: abyssImg }
    
  };
});