define([], function(){
  function ResourceQueue(){
    this._ids = {}; 
    this.pendingCount = 0;
  }
  ResourceQueue.create = function(args){
    return new ResourceQueue(args);
  };
  
  lang.mixin(ResourceQueue.prototype, event.Evented, {
    add: function(resourceId, obj, pname, loadNow){
      var self = this, 
          pairs = this._ids[resourceId];
      if(pairs) {
        pairs.push(obj, pname);
      } else {
        pairs = this._ids[resourceId] = [obj, pname]; // tuple of obj, name keyed by resource id
        this.pendingCount++;
        if(loadNow){
          this._loadResource(resourceId);
        }
      }
    },
    loadAll: function(cb){
      var options = { silent: true }, 
          self = this;
      var loadHandle = this.listen('load', function(evt){
        if(!evt.pending){
          if(cb) cb();
          self.emit('loadAll', { pending: 0 });
        }
      });
      for(var resourceId in this._ids){
        this._loadResource(resourceId, options);
      }
    },
    _loadResource: function(resourceId, options){
      console.log("_loadResource, loading ", resourceId);
      options = options || {};
      var idMap = this._ids, self = this;
      var promise = require([resourceId], function(res){
        self.pendingCount--;
        var obj, pname, pair = idMap[resourceId];
        while((obj=pair.shift()) && (pname=pair.shift())){
          obj[pname] = res;
        }
        delete idMap[resourceId];
        self.emit('load', { resource: res, id: resourceId, pending: self.pendingCount });
      });
    }
  
})