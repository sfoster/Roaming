define([
  'compose', 'lib/util',
  'models/EventedModel',
  'models/Inventory',
  'models/Item',
  'resources/weapons'
], function(Compose, util, EventedModel, Inventory, Item, weapons){

  var DEBUG = false;
  var debug = {
    log: DEBUG ? console.log.bind(console, 'Actor') : function() {}
  };

  function isImmutable(thing) {
    return (typeof thing === 'object');
  }

  var Actor = Compose(Compose, function() {
    debug.log("first Actor ctor");
  }, EventedModel, {
    declaredClass: "Actor",
    type: "actor",
    currentWeapon: "",
    icon: "",
    // stats
    health: 5,
    strength: 5,
    mana: 0,
    level: 1,
    agility: 5,

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
      debug.log("Actor _prepareCtorArgs, got args: ", args);
      // some temporary aliases
      if('hp' in args) {
        args.health = args.hp;
        delete args.hp;
      }
      if('mp' in args) {
        args.mana = args.mp;
        delete args.mp;
      }
      if('evasion' in args) {
        args.agility = args.evasion;
        delete args.evasion;
      }

      if (!args.inventory) {
        args.inventory = [];
      }
      if (!args.equipped) {
        args.equipped = {};
      }

      debug.log("Actor _prepareCtorArgs, made args: ", args);
      return args;
    },
    initHealthProperty: function(name, initialValue, type) {
      // capture baseline health
      this.baseHealth = initialValue;
      return initialValue;
    },
    initInventoryProperty: function(name, initialValue, type) {
      // create the player's inventory
      // var inventory = ctorArgs.inventory = Inventory.resolve(args.inventory || []);
      // inventory.forEach(function(item){
      //   item.inCollection = inventory;
      // });
      // delete args.inventory;
      console.warn("TODO: implement initInventoryProperty");
    },
    completeInit: function() {
      debug.log("Actor ctor: ", this.name, this.type, this._id);

      // calculate a level if there is none
      if(!this.level) {
        this.level  = Math.max(1,(this.strength || 1) * (this.agility || 1) / 50);
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
    debug.log("last Actor ctor");
  });

  return Actor;
 });