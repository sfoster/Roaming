define(function() {
  'use strict';

  function waitForEvent(target, name,   timeout) {
    target = target || window;
    return new Promise(function(resolve, reject) {
      function done(evt) {
        // Both "transitionend" and "animationend" events bubble by default;
        // ignore them here if they're not targeted on the element we care about.
        if (evt && evt.target !== target &&
            (evt.type === 'transitionend' || evt.type === 'animationend')) {
          return;
        }
        clearTimeout(timer);
        target.removeEventListener(name, done);
        resolve(evt);
      }
      target.addEventListener(name, done);
      var timer = setTimeout(done, timeout || 4000);
    });
  }

  return {
    waitForEvent: waitForEvent
  };
});