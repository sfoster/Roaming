define([
  'compose',
  'lib/util',
  'lib/event'
], function(Compose, util, Evented){

  var DEBUG = false;
  var debug = {
    log: DEBUG ? console.log.bind(console, 'switchboard') : function() {}
  };

  function emptyObject(obj) {
    if (!obj) return;
    for (var i in obj) {
      obj[i] = null;
      delete obj[i];
    }
  }
  function emptyArray(arr) {
    while (arr && arr.length) {
      arr.pop();
    }
  }
/*
  TODO:
2-way alias:
alias 'bar' to 'foo'
events on 'foo' notify 'foo', 'bar' listeners
events on 'bar' notify 'bar', 'foo' listeners

2-way one-many alias
alias 'nonsense words' to 'foo';
alias 'nonsense words' to 'bar';
events on 'foo' notify 'foo', 'nonsense words' listeners
events on 'nonsense words' notify 'nonsense words', 'foo', 'bar' listeners

alias('currentTile', 'tile_0');
groupAlias('nearby', 'tile_0');
events on 'tile_0' notify 'tile_0', 'currentTile', 'nearby' listeners
events on 'currentTile' notify 'currentTile', 'tile_0', 'nearby' listeners

2-way alias:
alias(aliasName, targetId):
  register alias in id => alias table
  register alias in alias => id table
emit('alias', payload)
  lookup id for alias
  emit for 'alias' listeners
  emit for 'id' listeners

2-way group (one-many) alias:
groupAlias(aliasName, targetId):
  register alias in id => alias table
  register alias in alias => id table
emit('alias', payload)
  lookup id for alias
  emit for 'alias' listeners
  emit for 'id' listeners
*/

  /* switchboard keeps track of stuff like:
     ui needs to know when game.tile changes
     game has tile property, which descends from EventedModel
     ui says switchboard.on('game.currentTile.x:change', ui.onTileChange.bind(ui));
     previously we've said:
      switchboard.alias('game.currentTile', function resolver(topic) {
        return game.location[0]; // or whatever
      });
     switchboard finds it knows what 'game' is
     and tells game to watching its tile property; mutators update and remove will call
      // do the change, then...
      game.emit('tile:change', { topic: tile, value: game.tile });
      ui's onTileChange method is called with the payload

     ui needs to know when game.combatants[0].weapon.damage changes
     combatants[0] doesn't normally exist
     but the switchboard can be notified when it does
    */

  var switchboard = Compose.create(Evented, {
    // alias('Mark Twain', 'Samuel Clemens')
    // i.e. Mark Twain is an alias of Samuel Clemens
    _aliases: {},
    _reverseAliases: {},
    alias: function(aka, id) {
      if (!id) {
        return this._aliases[aka];
      }
      if (!aka) {
        return this._getAliasesForId(id);
      }

      var aliases = this._aliases;
      var alias = this._aliases[aka];

      if (alias && alias.target === id) {
        // dupe, return quietly
        return alias;
      } else if(alias) {
        // new value: clean up previous alias then proceed
        alias.remove();
      }

      var remover = function() {
        delete this._aliases[aka];
        var reverses = this._reverseAliases[id];
        if (reverses && (aka in reverses)) {
          delete reverses[aka];
        }
        for(var i in reverses) {
          break;
        }
        if (i === undefined) {
          this._reverseAliases[id] = null;
          delete this._reverseAliases[id];
        }
      }.bind(this);

      // e.g.: alias('game.currentTile', 'tile_0');
      // such that emit('tile_0:change') fires listeners for 'game.currentTile:change'
      alias = this._aliases[aka] = { target: id, key: aka, remove: remover };

      var reverseAliases = this._reverseAliases[id] || (this._reverseAliases[id] = {});
      reverseAliases[aka] = id;
      debug.log('aliased %s to %s', id, aka);

      return alias;
    },
    // one aka references 1-many ids
    // e.g. collection changes, model keys, model values
    // when an event affects any of the ids which fall under and alias
    // listeners to events on that alias should be notified
    _aliasMany: function(aka, id) {
      var aliases = this._aliases;
      var aliasIds = this._aliases[aka]; // store ids for this alias

      if (!aliasIds) {
        this._aliases[aka] = aliasIds = [];
        aliasIds.key = aka;
      }
      var matchIndex = -1;
      if (aliasIds.some(function(alias, idx) {
        matchIndex = idx;
        return alias.target === id;
      })) {
        // dupe, return quietly
        return aliasIds[matchIndex];
      }

      var remover = function() {
        var manyIds = this._aliases[aka];
        var matchIndex = -1;
        if (manyIds.some(function(alias, idx) {
          matchIndex = idx;
          return alias.target === id;
        })) {
          // pull it out of the array
          manyIds.splice(1, 1);
        }

        var reverses = this._reverseAliases[id];
        if (reverses && (aka in reverses)) {
          delete reverses[aka];
        }
        for(var i in reverses) {
          break;
        }
        if (i === undefined) {
          this._reverseAliases[id] = null;
          delete this._reverseAliases[id];
        }
      }.bind(this);

      // e.g.: alias('game.players', 'rita', true);
      // return { target: 'rita', key: 'game.players', remove: remover, multiple: true }
      // such that emit('rita:change') fires listeners for 'game.players:change'
      var alias = { target: id, key: aka, remove: remover };
      aliasIds.push(alias);

      var reverseAliases = this._reverseAliases[id] || (this._reverseAliases[id] = {});
      reverseAliases[aka] = id;
      debug.log('aliased %s to %s', id, aka);

      return alias;
    },

    _getAliasesForId: function(id) {
      var aliases = [];
      var suffix, prefix, word, aliasKey;
      // match for aliases for:
      //  foo then foo.bar then foo.bar.bazz in 'foo.bar.bazz'
      var re = /[^\.]+/g;
      var match;
      while((match = re.exec(id)) !== null) {
        word = match[0];
        prefix = id.substring(0, re.lastIndex - word.length);
        suffix = id.substring(re.lastIndex);
        aliasKey = prefix + word;
        if (aliasKey in this._reverseAliases) {
          aliases.push.apply(
            aliases,
            Object.keys(this._reverseAliases[aliasKey]).map(function(alias) {
              return alias + suffix;
            })
          );
        }
      }
      return aliases;
    },
    emit: Compose.after(function(topic, payload) {
      // and go looking for aliases
      var suffixIdx = topic.lastIndexOf(':');
      var name = topic;
      var suffix = '';
      if (suffixIdx > -1) {
        name = topic.substring(0, suffixIdx);
        suffix = topic.substring(suffixIdx);
      }
      var names = this.alias(null, name);
      names.forEach(function(name) {
        Evented.emit(name + suffix, payload);
      });
    }),
    reset: function() {
      emptyObject(this._aliases);
      emptyObject(this._reverseAliases);
      this.removeAllListeners();
    }
  });

  return switchboard;
});