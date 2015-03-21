define([
  'lib/util'
], function(util){

  var encounter = {
    fillDefaults: function(data) {
      if (!data.name) {
        data.name = data.id;
      }
      data.type = 'encounter';
    }
  };
  return encounter;
});