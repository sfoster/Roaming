define([
  'lib/util',
  'promise'
], function(util, Promise){

  function sumResults(result1, result2) {
    return {
      allies: {
        inflicted: result1.allies.inflicted+result2.allies.inflicted,
        sustained: result1.allies.sustained+result2.allies.sustained
      },
      opponents: {
        inflicted: result1.opponents.inflicted+result2.opponents.inflicted,
        sustained: result1.opponents.sustained+result2.opponents.sustained
      }
    };
  }
  function not(func) {
    return function(thing){
      return !func(thing);
    }
  }
  function alive(thing) {
    return thing.stats.health >= 0;
  }

  function Combat(args){
    util.mixin(this, args || {});
  }

  Combat.prototype.roundInterval = 500;

  Combat.prototype.start = function(allies, opponents) {
    this.allies = allies;
    this.opponents = opponents;

    var defd = Promise.defer();
    var self = this;
    var finalResult = {
      allies: { inflicted: 0, sustained: 0 },
      opponents: { inflicted: 0, sustained: 0 }
    };

    var itv = setInterval(function(){
      game.emit("combatroundstart", {
        scoreboard: finalResult,
        target: self,
        allies: allies,
        opponents: opponents
      });
      var result = self.round(allies, opponents);
      finalResult = sumResults(finalResult, result);

      game.emit("combatroundend", {
        target: self,
        scoreboard: finalResult,
        result: result,
        allies: allies,
        opponents: opponents
      });

      if(allies.filter(alive).length && opponents.filter(alive).length) {
          defd.progress(finalResult);
      } else {
        clearInterval(itv);
        defd.resolve(finalResult)
        return;
      };
    }, this.roundInterval);

    return defd.promise;
  }

  Combat.prototype.round = function() {
    var allies = this.allies,
        opponents = this.opponents;
    var combatants = [].concat(allies,opponents);

    var self = this;
    var result = {
      allies: { inflicted: 0, sustained: 0 },
      opponents: { inflicted: 0, sustained: 0 }
    };

      // faux battle
    opponents.filter(alive).forEach(function(thing){
      var ally = allies[0]; // could be random or turn-based or whatever
      var chanceToHit = (2 * game.random()) * (
              (ally.stats.agility * ally.level) /
              (thing.stats.agility * thing.level)
      );
      if(chanceToHit > 1){
        var damage = calculateDamage(ally, thing);
        // update our tallies
        thing.stats.health = thing.stats.health - damage;
        result.allies.inflicted+=damage;
        result.opponents.sustained+=damage;

        console.log("Hit for "+ damage, chanceToHit);
        game.emit("combatstrike", {
          target: this,
          attacker: allies[0],
          defender: thing,
          damage: damage
        });
      } else {
        console.log("Missed! "+ chanceToHit);
        game.emit("combatmiss", {
          target: this,
          attacker: allies[0],
          defender: thing,
          damage: 0
        });
      }
    });
    // end faux battle

    // flag all our dead combatants
    [].concat(opponents, allies).filter(not(alive)).forEach(function(thing){
      thing.dead = true;
    });

    return result;
  }

  function calculateDamage(attacker, defender){
    
    var weapon = attacker.currentWeapon;
    var range = 'shortRangeDamage';
    var damage = weapon[range] * attacker.stats.strength;
    if(defender.armor){
      damage = damage - (damage * defender.armor.effect)
    }
    if (damage < 1){
      console.log("rounding up calculated hit damage: " + damage);
      damage = 1;
    }
    return damage;
  }
  // not hooked up
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
