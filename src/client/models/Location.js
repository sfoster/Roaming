define([
  'dollar', 
  'lib/util', 
  'lib/event',
  'promise',
  'lib/clone'
], function($, util, Evented, Promise, sanitizedClone){
  var emit = Evented.emit.bind(this), // it matter what 'this' when we emit and listenr for events. Here, 'this' is the global context
      create = util.create;
  
  function Location(options){
    if(!options) return;
    this._onexits = [];
    this.encounters = [];
    this.here = [];
    // console.log("Location ctor, with options: ", options);
    for(var i in options){
      this[i] = options[i];
    }
    // console.log("create location with data: ", options);
    console.assert('x' in this, "Missing x property");
    console.assert('y' in this, "Missing y property");
  }
  
  util.mixin(Location.prototype, Evented, {
    propertiesWithReferences: ['here', 'encounters'],
    description: "",
    regionId: "",
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

        // enter each encounter, return false means stop
        var self = this;
        this.encounters.reduce(function(proceedToNext, encounter){
          return (false !== encounter.enter(self, player, game));
        }, true);

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
      var id = this.id; 
      // exclude id, coords, type from location file data
      // as this is 
      var formData = sanitizedClone(this, {}, { id: true, coords: true, type: true });
      console.log("formData: ", formData);

      var savePromise = new Promise();
      $.ajax({
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        url: this._resourceUrl,
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
