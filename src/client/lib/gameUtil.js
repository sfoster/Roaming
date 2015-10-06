define([
  'lib/util',
  'promise'
], function(util, Promise){

    function lastLocationVisit(playerData, tileId) {
      var visits = playerData.visits || [];
      for(var idx = visits.length -1; idx >= 0; idx--) {
        if (visits[idx].id === tileId) {
          return visits[idx];
        }
      }
      return null;
    }

    return {
      lastLocationVisit: lastLocationVisit
    };
});