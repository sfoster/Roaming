define(function (){

	// summary:
	//    a mixin/trait that provides basic event management capabilities

  function emptyObject(obj) {
    if (!obj) return;
    for (var i in obj) {
      obj[i] = null;
      delete obj[i];
    }
  }
  function emptyArray(arr) {
  }

	var Evented = {
		// dictionary of all event-names => listener arrays
		__events: {},
		on: function(name, fn) {
			// pubsub thing
			var events = this.__events,
				listeners = events[name] || (events[name] = []);
			listeners.push(fn);
			return {
				type: name,
				remove: function(){
					var idx = listeners.indexOf(fn);
					if(idx >= 0) {
						listeners.splice(idx, 1);
					}
				}
			};
		},
		removeAllListeners: function(name) {
		  // remove all listeners of a particular type
			// pubsub thing

      var coln;
      if (name) {
        // ditch all listeners associated w. that nam
        coln = this.__events[name];
        while (coln && coln.length) {
          coln.pop();
        }
      } else {
        // clear out all listeners
        coln = this.__events;
        for (var i in coln) {
          coln[i] = null;
          delete coln[i];
        }
      }
		},
		emit: function(name, payload){
			var listeners = this.__events[name] || [];
			payload = payload || {};
			payload.type = name;
			for(var i=0; i<listeners.length; i++){
				listeners[i](payload);
			}
		}
	};
	return Evented;

});