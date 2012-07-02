define([
  'lib/dollar', 
  'lib/util', 
  'lib/event',
  'lib/Promise'
], function($, util, Evented, Promise){
  var emit = Evented.emit.bind(this), // it matter what 'this' when we emit and listenr for events. Here, 'this' is the global context
      create = util.create;
  
  var reExcludeName = /^(_)|(jQuery\d)/;
  function exclude(name, value){
    return reExcludeName.test(name) || 'function' == typeof value;
  }
  
  function sanitizedClone(obj, clone){
    var type = util.getType(obj);
    switch(type){
      case 'object' :
      case 'unknown' :
        clone = clone || {};
        Object.keys(obj).forEach(function(name){
          if(! exclude(name, obj[name]) ) {
            clone[name] = sanitizedClone(obj[name]);
          }
        });
        return clone;
      case 'array' :
        clone = clone || [];
        obj.forEach(function(val, idx){
          if(!exclude(idx, val)){
            clone.push( sanitizedClone(val) );
          }
        });
        return clone;
      case 'null'   :
      case 'number' :
      case 'string' :
      case 'date'   :
        return obj; // copy by value
    }
  }
  
  function Location(options){
    if(!options) return;
    this._onexits = [];
    this.encounter = {};
    for(var i in options){
      this[i] = options[i];
    }
    console.log("create location with data: ", options);
    var coords = this.coords;
    this.x = coords[0]; 
    this.y = coords[1];
    if(!this.id){
      this.id = coords.join(',');
    }
  }
  
  util.mixin(Location.prototype, Evented, {
    encounterType: "",
    get: function(name){
      return this[name];
    }, 
    enter: function(player, game){
      var proceed = true;
      this._onexits = [];
      emit("onbeforelocationenter", {
        target: this,
        player: player,
        cancel: function(){ proceed = false; }
      });
      if(proceed){
        console.log("location enter: ", this, player, game, player.history);
        // what is in this tile? 
        // does anything happen as I enter?
        //  run any encounters
      
        // update the player's history with details of this visit
        // have I been here before?
        //  check player.history for this location id
        var locationHistory = player.history[this.id] || (player.history[this.id] = {}), 
            visits = locationHistory.visits || (locationHistory.visits = []);

        visits.push(+new Date());
        
        if(this.encounter && this.encounter.enter){
          this.encounter.enter(this, player, game);
        }

        emit("onafterlocationenter", {
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
      console.log("Location exit stub");
      emit("onlocationexit", {
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
      var formData = sanitizedClone(this, {});
      console.log("formData: ", formData);
      var id = formData.id,
          coords = formData.coords || id.split(',');
      formData.coords = coords.map(Number);

      var savePromise = new Promise();
      $.ajax({
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        url: '/location/'+id+'.json',
        data: JSON.stringify(formData),
        success: function(resp){
          console.log("save response: ", resp);
          alert("location saved: "+ resp.status);
          savePromise.resolve(resp.status);
        }, 
        error: function(xhr){ 
          console.warn("error saving location: ", xhr.status);
          alert("Unable to save location right now"); 
          savePromise.reject(xhr.status);
        }
      });
      return savePromise;
    }
  });

  return Location;
});
