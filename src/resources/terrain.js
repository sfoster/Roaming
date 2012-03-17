define([
  "image!resources/graphics/clear.gif",
  "image!resources/graphics/dryground.jpg",
  "image!resources/graphics/desertground.jpg",
  "image!resources/graphics/marshyground.png",
  "image!resources/graphics/mountianground.png",
  "image!resources/graphics/grassground.jpg",
  "image!resources/graphics/water.jpg",
  "image!resources/graphics/abyss.jpg",
  "image!resources/graphics/sandground.jpg"
], function(
  clearImg,
  dryGroundImg, 
  desertImg, 
  marshImg, 
  mountainsImg, 
  plainsImg,
  waterImg,
  abyssImg,
  sandImg
){

  return {
    "clear":      { img: clearImg },
    "barren":     { img: desertImg  },
    "desert":     { img: dryGroundImg }, 
    "marsh":      { img: marshImg },
    "mountains":  { img: mountainsImg },
    "plains":     { img: plainsImg },
    "water":     { img: waterImg },
    "abyss":     { img: abyssImg },
    "sand":     { img: sandImg }
  };
});