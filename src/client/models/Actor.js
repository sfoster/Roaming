define([
  'compose', 'lib/util',
  'models/EventedModel',
  'models/Inventory',
  'models/Item',
  'resources/weapons'
], function(Compose, util, EventedModel, Inventory, Item, weapons){

  function isImmutable(thing) {
    return (typeof thing === 'object');
  }

  var StatsProto = {
    health: 5,
    strength: 5,
    mana: 0,
    level: 1,
    agility: 5
  };

  var Actor = Compose(Compose, function() {
    console.log("first Actor ctor");
  }, EventedModel, {
    declaredClass: "Actor",
    type: "actor",
    currentWeapon: "",
    icon: "",
    propertiesWithReferences: ['inventory', 'currentWeapon'],

    equipWeapon: function(weapon) {
      if(!weapon) {
        // No weapon, going with an attached body part
        if(this.type == "player" || this.type == "humanoid") {
          weapon = weapons.fist;
        } else {
          weapon = weapons.claws;
        }
      }
      if(!(weapon instanceof Item)) {
        weapon = new Item(weapon);
      }
      weapon.isEquipped = true;
      this.currentWeapon = weapon;
      return this;
    },
    _prepareCtorArgs: function(args) {
      args = EventedModel.prototype._prepareCtorArgs.call(this, args);
      console.log("Actor _prepareCtorArgs, got args: ", args);
      var stats = args.stats || Object.create(StatsProto);
      // move stats properties into stats object
      for(key in StatsProto) {
        if(key in args) {
          stats[key] = args[key];
          delete args[key];
        }
      }
      // some temporary aliases
      if('hp' in args) {
        stats.health = args.hp;
        delete args.hp;
      }
      if('mp' in args) {
        stats.mana = args.mp;
        delete args.mp;
      }
      if('evasion' in args) {
        stats.agility = args.evasion;
        delete args.evasion;
      }

      if (!args.inventory) {
        args.inventory = [];
      }
      if (!args.equipped) {
        args.equipped = {};
      }

      args.stats = stats;
      console.log("Actor _prepareCtorArgs, made args: ", args);
      return args;
    },
    initStatsProperty: function(name, initialValue, type) {
      // capture baseline stats
      initialValue.type = 'stats';
      var stats = this.initObjectProperty('stats', initialValue, type);
      console.log('initStatsProperty, this.stats: ', this.stats);
      this.baseStats = util.flatten(typeof initialValue.toJS  == 'function' ?
                        initialValue.toJS() : initialValue);
      return stats;
    },
    initInventoryProperty: function(name, initialValue, type) {
      // create the player's inventory
      // var inventory = ctorArgs.inventory = Inventory.resolve(args.inventory || []);
      // inventory.forEach(function(item){
      //   item.inCollection = inventory;
      // });
      // delete args.inventory;
      console.warn("TODO");
    },
    completeInit: function() {
      console.log("Actor ctor: ", this.name, this.type, this._id);

      // calculate a level if there is none
      var stats = this.stats;
      if(!this.level) {
        this.level  = Math.max(1,(stats.strength || 1) * (stats.agility || 1) / 50);
      }

      if(args.currentWeapon) {
        this.currentWeapon = args.currentWeapon;
      }
      var weaponId = this.currentWeapon && this.currentWeapon.id;

      inventory.forEach(function(item){
        if(weaponId && weaponId == item.id) {
          // Found weapon in inventory
          this.currentWeapon = item;
        }
        // flag equipped items
        item.isEquipped = !!equipped[item.id];
      }, this);
      // setup the currentWeapon property
      this.equipWeapon( this.currentWeapon );
    }
  },function() {
    console.log("last Actor ctor");
  });

  return Actor;
 });