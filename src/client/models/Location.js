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
      this.backdrop = terrain[this.terrain].backdrop.replace(/^.*image!/, '');
    }
    if(!this.description){
      this.description = "You enter an area of " + this.terrain
    }
  }

  util.mixin(Location.prototype, Evented, {
    propertiesWithReferences: ['here', 'encounters', 'npcs'],
    description: "",
    regionId: "",
    backdrop: "",
    get: function(name){
      return this[name];
    },
    enter: function(player, game){
      var proceed = true;
      this._onexits = [];
      // load the backdrop

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
          return (false !== encounter.enter(player, game));
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
      game.emit("locationexit", {
        target: this,
        player: player,
        cancel: function(){ proceed = false; }
      });
      var fn;
      while((fn = this._onexits.shift())){
        fn(player, game);
      }
    },
    export: function(){
      var id = this.id;
      var cleanData = {};
      // export out any child objects
      this.propertiesWithReferences.forEach(function(prop){
        cleanData[prop] = ('function' == this[prop].export) ?
            this[prop].export() : this[prop];
      }, this);
      // exclude id, coords, type from location file data
      // as this is
      cleanData = sanitizedClone(cleanData, {}, {
        propertiesWithReferences: true,
        coords: true,
        type: true,
        regionId: true
      });

      return cleanData;
    }
  });

  return Location;
});
