define([
  'dollar',
  'knockout',
  'lib/util',
  'promise'
], function($, ko, util, Promise){

  function classTransition(elm, options) {
    var className = options.className;
    var defd = Promise.defer();
    var resolved = false;
    var verb = options.add ? 'add' : 'remove';
    $elm = $(elm);

    $elm.one('transitionend webkitTransitionEnd oTransitionEnd otransitionend', function() {
      if(!resolved)
        defd.resolve((resolved = true));
    });
    setTimeout(function(){
      $elm[verb+'Class'](className);
    }, 0);
    return defd.promise;
  }

  return {
  	classTransition: classTransition,
    setDisplayDefault: function(elm) {
      elm.style.removeProperty("display");
    },
    setDisplayNone: function(elm) {
      elm.style.display = "none";
    }
  };

});