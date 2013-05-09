define([
	'compose', 'resources/items', 'resources/weapons'
], function(Compose, itemResources, weaponResources){

  Inventory = {};
  Inventory.resolve = function(items) {
  	if(!(items instanceof Array)) {
  		items = [items];
  	}
  	// look up named items in one of our resource-type collections
  	return items.map(function(item, idx, arr){
      if('string' == typeof item){
        if(item in itemResources){
          item = itemResources[item];
        } else if(item in weaponResources){
          item = weaponResources[item];
        } else {
          item = items[id] = { id: item, name: item, description: item };
        }
      }
      return item;
    });
  };

	return Inventory;

});