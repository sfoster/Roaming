define([
], function() {

  var scene = {
    getState() {

    },
    attach: function() {

    },
    detach: function() {

    }
  };

  // the scene is modelled as a stack of states
  scene.stack = (function(){
    var _stack = [];
    return {
      length: 0,
      push: function(state){
        _stack.push(state);
        this.length++;
        state.enter(game.player, game);
      },
      pop: function(){
        var state = _stack.pop();
        this.length--;
        state.exit(game.player, game);
      },
      replace: function(state) {
        this.pop();
        this.push(state);
      },
      get: function(idx){
        return _stack[idx];
      }
    };
  })();

  // some actor {};
  // some components
  // actor.components = [lives, eats, dies, fights, talks]
  // lives.attach = function(entity) {
  //
  // }

  return scene;
});

