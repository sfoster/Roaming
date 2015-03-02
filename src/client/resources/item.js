define(['lib/util'], function(util) {

  var itemDefaults = {
    name: false
  };

  return {
    fillDefaults: function(itemData) {
      return util.create(itemDefaults, itemData);
    }
  };

});