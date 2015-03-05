define([], function(){
  console.log("Loading models/Item");

  function ItemModel(args) {
    for (var i in args || {}) {
      this[i] = args[i];
    }
  };
  ItemModel.prototype.declaredClass = "Item";
  ItemModel.prototype.type = "item";

    // examine: function(context){
    //   return this.detailedDescription || this.description;
    // },
    // transferTo: function(collection) {
    //   var current = this.inCollection;
    //   console.log("transferTo for item:"+this.name, current);
    //   if(current) {
    //     if(current.remove) {
    //       current.remove(this);
    //     } else {
    //       var idx = current.indexOf(this);
    //       console.log("index of item in current collection: ", idx);
    //       if(idx > -1) {

    //       }
    //       current.splice(current.indexOf(this), 1);
    //     }
    //   }
    //   if(collection.add) {
    //     collection.add(this);
    //   } else {
    //     collection.push(this);
    //   }
    //   this.inCollection = collection;
    // }


  // statics
  ItemModel.create = function(data){
      if("string" == typeof data){
        data = JSON.parse(data);
      }
      var item = new ItemModel(data);
      return item;
  }
  return ItemModel;
});