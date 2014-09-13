define([
  'compose',
  'lib/util',
  'lib/event'
], function(Compose, util, Evented){

  var DEBUG = false;
  var debug = {
    log: DEBUG ? console.log.bind(console, 'switchboard') : function() {}
  };

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
    })
  });

  switchboard.Evented = {
    emit: function(topic, payload) {
      switchboard.emit(this._id + '.' + topic, payload);
    },
    on: function(topic, callback) {
      var topicFlags = this._topicFlags || (this._topicFlags = {});
      if ("*" === topic) {
        console.warn('catch-all listeners not implemented');
      }
      if (topic in topicFlags) {
        topicFlags[topic] += 1;
      } else {
        topicFlags[topic] = 1;
      }
      debug.log('on: add callback for topic ' + this._id + '.' + topic);
      return switchboard.on(this._id + '.' + topic, callback);
    },
    removeAllListeners: function(topic) {
      if((topic in this._topicFlags) && this._topicFlags[topic]) {
        this._topicFlags[topic]--;
      }
      return switchboard.removeAllListeners(this._id + '.' + topic);
    }
  };

  return switchboard;
});