define([
	'lib/util',
	'promise'
], function(util, Promise){

	function Combat(args){
		util.mixin(this, args || {});
	}

	Combat.prototype.roundInterval = 500;

	Combat.prototype.start = function(side1, side2) {
    var defd = Promise.defer();
		var self = this;
		var finalResult = { killed: [] };

    var itv = setInterval(function(){
      console.log("Combat! ", side2.length + " monsters");
      var result = self.round(side1, side2);
      finalResult.killed = finalResult.killed.concat( result.killed );
      side2 = result.remaining;

      if(side1.length && side2.length) {
	        defd.progress(result);
      } else {
        clearInterval(itv); 
        defd.resolve(finalResult)
        return;
      };
    }, this.roundInterval);

    return defd.promise;
	}

	Combat.prototype.round = function(side1, side2) {
		var combatants = [].concat(side1,side2);
		console.log("Round combatants: ", combatants);

		// faux battle
		side2.forEach(function(thing){
			thing.stats.health--;
		});
		// end faux battle

    var deadMonsters = side2.filter(function(monster){
      return monster.stats.health <= 0;
    });
    console.log("You killed: ", deadMonsters.map(function(monster){ return monster.name; }));

    side1 = side1.filter(function(thing){
      return thing.stats.health > 0;
    });
    side2 = side2.filter(function(thing){
      return thing.stats.health > 0;
    });
    return {
      killed: deadMonsters,
      remaining: side2
    };
	}

  function combat(player, monsters) {
    var damage = player.damage(1); // short-range attack
    var damageInflicted = 0;

    // player attach - he magically attacks them all for now 
    monsters.forEach(function(monster){
      var chanceToHit = 0.5;
      var doesHit = Math.random() >= chanceToHit; 
      if(doesHit) {
        
        console.log("You hit for " + damage + " of " + monster.stats.health);
        monster.stats.health = monster.stats.health - damage;
        damageInflicted += damage;
      } else {
        console.log("You miss the " + monster.name);
      }
    });
    var deadMonsters = monsters.filter(function(monster){
      return monster.stats.health <= 0;
    });
    console.log("You killed: ", deadMonsters.map(function(monster){ return monster.name; }));

    monsters = monsters.filter(function(monster){
      return monster.stats.health > 0;
    });
    return {
      killed: deadMonsters,
      remaining: monsters,
      damageInflicted: damageInflicted
    };
  }

  return Combat;
});
