define(['lib/Promise', 'models/Region', 'Fixture'], function(Promise, Region, Fixture){
  return [
    Fixture("Region is a ctor", function(){
      return (
        typeof Region == "function" &&
        (new Region) instanceof Region
      );
    }),
    Fixture("Region has a load method", function(){
      var r = new Region();
      return (
        typeof r.load == 'function'
      );
    }),
    Fixture("Region fetches JSON data", function(){
      var r = new Region({ resourceUrl: 'test/data/region.json' });
      var testPromise = new Promise();
      r.load().then(
        function(data){
          testPromise.resolve(true);
        },
        function(data){
          testPromise.reject(true);
        }
      );
      return testPromise;
    })
  ];
});
