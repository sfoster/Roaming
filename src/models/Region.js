define([
  'lib/dollar', 
  'lib/util', 
  'lib/event',
  'lib/Promise',
  'lib/clone'
], function($, util, Evented, Promise, sanitizedClone){
  var emit = Evented.emit.bind(this), // it matter what 'this' when we emit and listenr for events. Here, 'this' is the global context
      create = util.create;
  
  function Region(options){
    if(!options) return;
    this._onexits = [];
    if(!('id' in options)){
      throw new Error("Missing required property 'id' in Region constructor");
    }

    for(var i in options){
      this[i] = options[i];
    }
    console.log("create region with data: ", options);
  }
  
  util.mixin(Region.prototype, Evented, {
    get: function(name){
      return this[name];
    }, 
    byCoords: function(){
      var tiles = this.tiles, 
          tilesByCoords = {};
      tiles.forEach(function(tile){
        var tileId = [tile.x, tile.y].join(',');
        tilesByCoords[tileId] = tile;
      });
      return tilesByCoords;
    },
    enter: function(player, game){
      var proceed = true;
      this._onexits = [];
      emit("onbeforeregionenter", {
        target: this,
        player: player,
        cancel: function(){ proceed = false; }
      });
      if(proceed){
        console.log("region enter: ", this, player, game, player.history);

        emit("onafterregionenter", {
          target: this,
          player: player,
          cancel: function(){ proceed = false; }
        });
      }
    }, 
    onExit: function(fn){
     this._onexits.push(fn); 
    },
    exit: function(player, game){
      console.log("Region exit stub");
      emit("onregionexit", {
        target: this,
        player: player,
        cancel: function(){ proceed = false; }
      });
      var fn; 
      while((fn = this._onexits.shift())){
        fn(player, game);
      }
    },
    save: function(){
      var formData = sanitizedClone(this.tilesByCoords(), {});
      throw "need to re-reference location properties";
      
      console.log("formData: ", formData);
      var id = formData.id;

      var savePromise = new Promise();
      $.ajax({
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        url: '/location/'+id+'.json',
        data: JSON.stringify(formData),
        success: function(resp){
          console.log("save response: ", resp);
          alert("region saved: "+ resp.status);
          savePromise.resolve(resp.status);
        }, 
        error: function(xhr){ 
          console.warn("error saving region: ", xhr.status);
          alert("Unable to save region right now"); 
          savePromise.reject(xhr.status);
        }
      });
      return savePromise;
    }
  });

  return Region;
});