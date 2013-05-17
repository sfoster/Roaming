define(['compose', 'lib/util'], function(Compose, util){
  var create = util.create;

  var proto = {
  };

  console.log("Loading models/Item");

  var mixin = util.mixin;
  var Item = Compose(function(args){
    mixin(this, args || {});
    console.log("Item constructor: ", this);
  }, {
    examine: function(context){
      return this.detailedDescription || this.description;
    },
    transferTo: function(collection) {
      var current = this.inCollection;
      console.log("transferTo for item:"+this.name, current);
      if(current) {
        if(current.remove) {
          current.remove(this);
        } else {
          var idx = current.indexOf(this);
          console.log("index of item in current collection: ", idx);
          if(idx > -1) {

          }
          current.splice(current.indexOf(this), 1);
        }
      }
      if(collection.add) {
        collection.add(this);
      } else {
        collection.push(this);
      }
      this.inCollection = collection;
    }
  });

  Item.extend = util.extend;

  // statics
  util.mixin(Item, {
    create: function(data){
      if("string" == typeof data){
        data = JSON.parse(data);
      }
      var item = new Item(data);
      return item;
    },
  });
  return Item;
});