define([
  'dollar', 
  'lib/util', 
  'lib/event',
  'promise',
  'lib/clone',
  'resources/terrain'
], function($, util, Evented, Promise, sanitizedClone, terrain){
  var emit = Evented.emit.bind(this), // it matter what 'this' when we emit and listenr for events. Here, 'this' is the global context
      create = util.create;
  
  function Location(options){
    if(!options) return;
    this.__events = {}; // make our own event listener collection
    this._onexits = [];
    this.encounters = [];
    this.here = [];
    this.npcs = [];
    for(var i in options){
      this[i] = options[i];
    }
    if(this._resourceId) {
      this.regionId = this._resourceId.replace(/^\/?location\/([^\/]+)\/(\d+,\d+)/, '$1');
    }
    // console.log("create location with data: ", options);
    console.assert('description' in this, "Missing description property");
    console.assert('x' in this, "Missing x property");
    console.assert('y' in this, "Missing y property");
    console.assert('id' in this, "Missing id property in " + options.x+','+options.y);

    if(!this.backdrop) {
      // use the default for the terrain type
      this.backdrop = terrain[this.terrain].backdrop;
    }
    return this;
  }
  
  util.mixin(Location.prototype, Evented, {
    propertiesWithReferences: ['here', 'encounters'],
    description: "",
    regionId: "",
    backdrop: "",
    get: function(name){
      return this[name];
    }, 
    enter: function(player, game){
      var proceed = true;
      this._onexits = [];
      // load the backgrop
      
      game.emit("beforelocationenter", {
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

        game.emit("locationenter", {
          target: this,
          player: player,
          cancel: function(){ proceed = false; }
        });

        visits.push(+new Date());

        // enter each encounter, return false means stop
        var self = this;
        this.encounters.reduce(function(proceedToNext, encounter){
          console.log("encounter: ", encounter);
          return (false !== encounter.enter(self, player, game));
        }, true);

        game.emit("afterlocationenter", {
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
      this.emit("exit", {
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
