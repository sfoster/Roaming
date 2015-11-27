define([], function() {
  var Stack = {
    __states: [],
    get stackLength() {
      return this.__states ? this.__states.length : undefined;
    },
    pushState: function(state){
      this.__states.push(state);
      state.enter(this);
    },
    popState: function(){
      var state = this.__states.pop();
      state.exit(this);
    },
    replaceState: function(state, args) {
      this.pop();
      this.push(state);
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
