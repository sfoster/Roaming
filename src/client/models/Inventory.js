define([
	'compose', 'lib/event', 'resources/items', 'resources/weapons'
], function(Compose, Evented, itemResources, weaponResources){

  var Inventory = Compose(Array, Evented, {
    add: function(item, options){
      this.push(item);
      this.emit("afteradd", {
        target: item,
        player: player,
        cancel: function(){ proceed = false; }
      });
    },
    remove: function(item, options){
      for(var i=0; i<this.length; i++){
        if(this[i] === item){
          break;
        }
      }
      if(i < this.length) {
        this.splice(idx, 1);
        this.emit("afterremove", {
          target: item,
          player: player,
          cancel: function(){ proceed = false; }
        });
      }
      return this;
    }
  });

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