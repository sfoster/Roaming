define(['lib/util'], function(util) {

  var itemDefaults = {
    name: false
  };

  return {
    fillDefaults: function(itemData) {
      if (!itemData.name) {
        itemData.name = itemData.id;
      }
      return itemData;
    }
  };

});