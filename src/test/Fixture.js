define(function(){
  function Fixture(name, runFn){
    if(!arguments.length) return;
    var fxt = (this instanceof Fixture) ? this : new Fixture;
    fxt.name = name;
    fxt.runTest = runFn;
    return fxt;
  }
  return Fixture;
});