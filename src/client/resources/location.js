define([
  'lib/util',
  'resources/terrain'
], function(util, terrain){

  return {
    fillDefaults: function(data) {
      var filled = data;
      console.assert('x' in filled, "Missing x property");
      console.assert('y' in filled, "Missing y property");
      console.assert('terrain' in filled, "Missing terrain property in " + data.x+','+data.y);
      console.assert('id' in filled, "Missing id property in " + data.x+','+data.y);

      filled.type = 'location';
      if (!filled.here) {
        filled.here = [];
      }
      if (!filled.encounters) {
        filled.encounters = [];
      }
      if (!filled.npcs) {
        filled.npcs = [];
      }
      if(!filled.backdrop) {
        // use the default for the terrain type
        filled.backdrop = terrain[filled.terrain].backdrop.replace(/^.*image!/, '');
        // console.log("Setting default backdrop: "+filled.backdrop);
      }
      if(!filled.description){
        filled.description = "You enter an area of " + filled.terrain
      }
      return filled;
    },
    // freeze/thaw
  };

});
