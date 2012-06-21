define(['lib/event', 'lib/util', 'resources/npc', 'resources/items'], function(Evented, util, npc, items){

  var defaultWeapon = {
    shortRangeDamage: 1,
    mediumRangeDamage: 0,
    longRangeDamage: 0
  };
  
  function Monster(props){
    // npc.hdyra = {
    //   name: 'Hydra',
    //   strength: 120,
    //   hp: 300,
    //   mp: 50,
    //   range: 'short, medium',
    //   evasion: 15, 
    //   terrain: ["desert", "sand"]
    //   // Hydra has Venom Spit ability
    //   // (same as Poison, but medium range)
    // };
    util.mixin(this, props);
  }
  
  Monster.prototype.damage = function(distance){
    distance = Number(distance || 0);
    var level = this.level;
    var weapon = this.currentWeapon || defaultWeapon; 
    var damage = 1;

    // shortRangeDamage: 3,
    // longRangeDamage: 0,
    // mediumRangeDamage: 5

    if(distance < 5) {
      damage = damage + weapon.shortRangeDamage; 
    } else if(distance < 15){
      damage = damage + weapon.mediumRangeDamage; 
    } if(distance < 200){
      damage = damage + weapon.longRangeDamage; 
    } else {
      damage = 0; // too far!
    }
    return damage;
  };
  
  Monster.create = function(type){
    type = (typeof type == 'string') ? npc[type] : type;

    var props = util.create(type);
    props.stats = {
      health: props.hp,
      level: Math.ceil(props.hp/100),
      energy: 50
    };
    props.inventory = [];
    
    var monster = new Monster(props);
  
    // FIXME: look up the current weapono fron the NPC module
    monster.currentWeapon = defaultWeapon;

    return monster;
  };
  return Monster;
});