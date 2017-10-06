define([], function() {
    function undecorate(thing) {
      var data = {};
      for(var p in thing) {
        if (!thing.hasOwnProperty(p) ||
          "_" == p[0]
        ) {
          continue;
        }
        if (typeof thing[p] == 'object') {
          data[p] = undecorate(thing[p]);
        } else {
          data[p] = thing[p];
        }
      }
      return data;
    }
    var Entity = {
      undecorate: undecorate
    };

    return Entity;
});