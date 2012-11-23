define([
  'dollar', 
  'lib/util', 
  'lib/event',
  'promise',
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
      this.emit("onbeforeenter", {
        target: this,
        player: player,
        cancel: function(){ proceed = false; }
      });
      if(proceed){
        console.log("region enter: ", this, player, game, player.history);

        this.emit("onafterenter", {
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
      this.emit("onexit", {
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
      throw "Not implemented";
      var formData = sanitizedClone(this.tiles, []);
      var keepers = {'$ref': 1, 'x': 1, 'y': 1, 'type': 1};
      // de-reference
      formData.forEach(function(tileData){
        for(var pname in tileData){
          if(! keepers[pname] ) {
            delete tileData[pname];
          }
        }
        // recreate the resource url for this tile as the $ref property
        if(!tileData.$ref){
          tileData.$ref = '/location/' + tileData.x+','+tileData.y+'.json';
        }
      });
      
      console.log("formData: ", formData);
      var id = this.id;

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
    },
    loadTiles: function(ids){
      // 
      var regionId = this.id;
      var slice = Array.prototype.slice;
      ids = ids.map(function(coords){
        return 'plugins/resource!location/' + regionId + '/'+coords;
      });
      
      var loadPromise = Promise.defer();
      require(ids, function(){
        var tiles = slice.call(arguments);
        loadPromise.resolve(tiles);
      });
      return loadPromise;
    },
    loadTile: function(stub){
      // 
      var url = stub.$ref, 
          coords = stub.x+','+stub.y;
      var loadPromise = Promise.defer();
      require(['plugins/resource!location/' + this.id + '/'+coords], function(tile){
        loadPromise.resolve(tile);
      });
      return loadPromise;
    },
    getEdges: function(x,y){
      var nearby = this.tiles.filter(function(tile){
        if(tile.x==x && tile.y==y) return false;
        if(
          Math.abs(tile.x - x) <= 1
        ){
          if(Math.abs(tile.y - y) <= 1){
            return true;
          }
        }
        return false;
      });
      return nearby;
    }
  });

  return Region;
});