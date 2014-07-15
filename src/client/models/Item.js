define(['compose', 'lib/util', 'models/EventedModel'], function(Compose, util, EventedModel){
  console.log("Loading models/Item");

  var ItemModel = Compose(EventedModel, {
    declaredClass: "Item",
    type: "item",
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

  ItemModel.extend = util.extend;

  // statics
  util.mixin(ItemModel, {
    create: function(data){
      if("string" == typeof data){
        data = JSON.parse(data);
      }
      var item = new ItemModel(data);
      return item;
    },
  });
  return ItemModel;
});