define([
    'compose', 'lib/event'
], function(Compose, Evented){

  var Collection = Compose(Array, Evented, {
    declaredClass: "Collection",
    add: function(item, options){
      this.push(item);
      item.inCollection = this;
      this.emit("afteradd", {
        target: item,
        cancel: function(){ proceed = false; }
      });
    },
    addAt: function(item, index){
      this[index] = item;
      item.inCollection = this;
      this.emit("afteradd", {
        target: item,
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
        console.log("Removing item: ", item);
        this.emit("afterremove", {
          target: item,
          cancel: function(){ proceed = false; }
        });
      }
      return this;
    }
  });

  return Collection;
});
