define(['vendor/compose', 'util', 'lib/Promise', 'lib/json/ref'], function(Compose, util, Promise, json){
  
  var Region = Compose(function(args){
    util.mixin(this, args || {});
  }, {
    load: function(){
      var loadPromise = new Promise();
      require(['text!' + this.resourceUrl], function(strData){
        var data = json.fromJson(
          strData, { 
            loader: function(){
              console.log("loading something");
              return { ok: true };
            }
        });
        loadPromise.resolve(data);
      });
      return loadPromise;
    }
  });
  return Region;
});