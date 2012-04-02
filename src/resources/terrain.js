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
  sandImg,
  forestImg
){

  // each terrain includes an image and
  // a default description and afar text value for the tile/location
  // 
  return {
    "clear": { 
      img: clearImg,
      description: "",
      afar: ""
    },
    "barren":     { 
      img: desertImg,
      description: "This is barren land, with only a scattering of rocks to break the monotony.",
      afar: "a flat and featureless landscape"
    },
    "desert":     {
      img: dryGroundImg,
      description: "You are in a sandy desert",
      afar: "desert"
    }, 
    "marsh": {
      img: marshImg,
      description: "You are knee deep in a swampy marsh",
      afar: "marshy landscape"
    },
    "mountains":  {
      img: mountainsImg,
      description: "You are in the mountains",
      afar: "rugged mountains"
    },
    "plains":     {
      img: plainsImg,
      description: "You see flat grassland all around you.",
      afar: "it looks like grass and more grass"
    },
    "water":     {
      img: waterImg,
      description: "You are submerged in deep water",
      afar: "A deep blue pool"
    },
    "abyss":     {
      img: abyssImg,
      description: "The yawning abyss swallows you up. You fall for a night and a day.",
      afar: "the edge of the world. No man may pass here."
    },
    "sand":     {
      img: sandImg,
      description: "Sand",
      afar: "sand"
    }, 
    "forest":    {
      img: forestImg,
      description: "You are surrounded by huge trees of many types",
      afar: "a vast forest"     
     
    }
  };
});