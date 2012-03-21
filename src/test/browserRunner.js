define(['lib/Promise'], function(Promise){
  var config = {};
  function assert(expr){
    var result = (typeof expr == 'function') ? expr.call(null) : expr;
    return Boolean(result);
  }
  
  function logResult(msg, result){
    var liNode = document.createElement("li");
    liNode.appendChild( document.createTextNode( msg + ":\t") );
    liNode.appendChild( document.createTextNode( result ) );
    config.logNode.appendChild( liNode );
    liNode.className = result ? "ok" : "fail";
  }

  return {
    config: function(pbag){
      for(var i in pbag){
        config[i] = pbag[i];
      }
    },
    run: function(){
      var modules = [].concat(config.modules);
      function next(){
        var m = modules.shift();
        if(m) {
          each(m);
        }
      }
      function each(id){
        require([id], function(fixtures){
          var result;
          if(fixtures instanceof Array){
            console.log("fixtures: ", fixtures);
            fixtures.forEach(function(fixture){
              console.log("fixture: ", fixture);
              handleFixture(fixture.name, fixture);
            });
          } else {
            for(var name in fixtures) {
              handleFixture(name, fixtures[name]);
            }
          }
        });
       next();
      }
      function handleFixture(name, fixture){
        Promise.when( 
          fixture.runTest(), 
          function(result) {
            logResult( name,  result );
          }, 
          function(result) {
            logResult( name,  result );
          }
        );
      }
      next();
    }
  };
});