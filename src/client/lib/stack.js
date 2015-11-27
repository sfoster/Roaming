define([], function() {
  var Stack = {
    __states: [],
    get stackLength() {
      return this.__states ? this.__states.length : undefined;
    },
    pushState: function(state, transition){
      this.__states.push(state);
      if (transition) {
        return transition().then(function() {
          state.enter(this);
        }.bind(this))
      } else {
        return Promise.resolve(state.enter(this));
      }
    },
    popState: function(transition){
      var state = this.__states.pop();
      if (transition) {
        return transition().then(function() {
          state.exit(this);
        }.bind(this))
      } else {
        return Promise.resolve(state.exit(this));
      }
    },
    replaceState: function(state, transition) {
      this.popState();
      return this.push(state, transition);
    },
    getStateAtIndex: function(idx){
      return this.__states[idx];
    },
    peekState: function() {
      return this.__states[this.__states.length -1];
    }
  };
  return Stack;
});
