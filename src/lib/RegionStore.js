define(['compose', 'vendor/store/JsonRest'], function(Compose, JsonRest){

  function dataToViewModel(data){
    // util.defaults(data, proto);
    // FIXME: ko.mapping is not defined? 
    // var viewModel = ko.mapping.fromJS(data);
    var viewModel = data;
    return viewModel;
  }

  function successHandler(rows) {
    return function(results){
      if('string' == typeof results) {
        results = JSON.parse(results); // json.resolveJson? 
      }
      var len = ('function' == typeof rows) ? rows().length : rows.length;
      // rows is observable, so splice triggers updates in any bindings
      rows.splice.apply(
        rows, 
        [0, len].concat( results.d.map( dataToViewModel ) )
      );
    };
  }
  
  return Compose(JsonRest, {
    target: '',
    save: function(id, options) {
      console.log("Save id: ", id);
    },
    locations: function(query, options){
      // API to query for locations in the store instance and populate a provided 'rows' array
      console.log("RegionStore.locations");
      var rows = options.rows || [];
      var results = this.query(query || null, options || {});
      var onSuccess = successHandler( rows );
      results.then(onSuccess);
      // results.observe(function(item, removedFrom, insertedInto){
      //   console.log("results observed: ", item, removedFrom, insertedInto);
      // });
      return rows;
    }
  });
  
});