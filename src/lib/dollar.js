define([
  'vendor/jquery.js'
  // 'order!vendor/jsrender.js',
  // 'order!vendor/jquery.observable.js',
  // 'order!vendor/jquery.views.js'
], function(){
  console.log("lib/dollar, returning jQuery as module export:", jQuery);
  return jQuery;
});