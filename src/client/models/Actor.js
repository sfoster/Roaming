define([
  'compose', 'lib/util', 'models/Inventory', 'models/Item', 'resources/weapons'
], function(Compose, util, Inventory, Item, weapons){

  var StatsProto = {
    health: 5,
    strength: 5,
    mana: 0,
    level: 1,
    agility: 5
  };

  var Actor = Compose(function(args) {
    util.prepareModel(this, args || {});
    console.log("Actor: ", this.name, this.type, this._id);

    // create the player's inventory
    var inventory = this.inventory = Inventory.resolve(args.inventory || []);
    inventory.forEach(function(item){
      item.inCollection = inventory;
    });
    delete args.inventory;

    var equipped = args.equipped || {};
    delete args.equipped;

    // setup stats
    var stats = this.stats = Object.create(StatsProto);
    // look for a .stats property first, then look on the parameter object
    if(args.stats) {
    	this.stats = util.mixin(stats, args.stats)
    	delete args.stats;
    } else {
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
    }

    // capture baseline stats
    this.baseStats = JSON.parse(JSON.stringify(this.stats));

    // calculate a level if there is none
    if(!this.level) {
      this.level  = Math.max(1, this.stats.strength * this.stats.agility / 50);
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
  }, {
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
    }
  }, Compose);

  return Actor;
 });