define([
  'compose', 'lib/util', 'models/Inventory'
], function(Compose, util, Inventory){
  
  var StatsProto = {
  	health: 5,
    strength: 5,
    mana: 0
  };

  var Actor = Compose(function(args) {
  	args = args || {};
    console.log("Actor ctor, got args", args);

    // create the player's inventory
    var inventory = this.inventory = Inventory.resolve(args.inventory || []);
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
    }

    var weaponId = this.currentWeapon ? 
    		this.currentWeapon.id || this.currentWeapon : null;

    inventory.forEach(function(item){
      if(weaponId && weaponId == item.id) {
        this.currentWeapon = item;
        equipped[item.id] = true;
      }
      item.isEquipped = !!equipped[item.id];
    }, this);

    // if(this.currentWeapon && typeof this.currentWeapon === "string") {
    //   this.currentWeapon = weapons[this.currentWeapon];
    // }
  }, {
  	declaredClass: "Actor",
	currentWeapon: "",
	propertiesWithReferences: ['inventory', 'currentWeapon'],

  }, Compose);

  return Actor; 
 });