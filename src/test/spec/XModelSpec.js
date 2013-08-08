define(["models/XModel"], function(XModel) {
	console.log("XModelSpec loaded XModel: ", XModel);

  describe("XModels", function() {
  	var data = {
  		foo: "Foo",
  		bar: "Bar",
  		hats: ["too fancy", "just right"],
  		stats: { age: 2, health: "great" }
  	};

    it('should be a constructor', function() {
      expect(typeof XModel).toBe("function");
      expect((new XModel) instanceof XModel).toBeTruthy();
    });

    it('should make observables of all properties', function() {
    	var model = new XModel(data);
    	Object.keys(data).forEach(function(key){
	    	console.log("test for key: ", key, model[key]);
	      expect(typeof model[key]).toBe("function");
    	});
    });

    it('should create sub-models for object properties', function() {
    	var model = new XModel(data);
      expect(model.stats.peek).toBeTruthy();
      expect(model.stats.peek() instanceof XModel).toBeTruthy();
    });


    it('should notify when we update a property', function() {
    	var model = new XModel(data);
    	var notified = false;
    	model.foo.subscribe(function(newValue){
    		notified = true;
    	});
    	model.foo("New fu");
      expect(model.foo.peek()).toBe("New fu");
      expect(notified).toBeTruthy();
    });
  });

  return {
    name: "XModelSpec"
  };
});