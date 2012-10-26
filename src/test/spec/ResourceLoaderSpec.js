// ResourceLoaderSpec
define(['plugins/resource'], function(resourcePlugin){

  describe("Static methods", function() {
  	it("Should implement the load method", function(){
  		expect(typeof resourcePlugin.load).toBe('function');
  	});
  	it("Should implement a thaw method", function(){
  		expect(typeof resourcePlugin.thaw).toBe('function');
  	});
  	it("Should implement a registerType method", function(){
  		expect(typeof resourcePlugin.registerType).toBe('function');
  	});
  });


  describe("Thaw", function() {
  	it("Should return a promise", function(){
  		var ret = resourcePlugin.thaw({});
  		expect(typeof ret.then).toBe('function');
  	});
  	it("Should let me register a new type", function(){
  		var err;
  		try {
  			resourcePlugin.registerType('testthing1', 'test/lib/TestThing');
  		} catch(e) {
  			err = e;
  		}
  		expect(err).toBeFalsy();
  	});
  	it("Should pass data to the indicated factory", function(){
		resourcePlugin.registerType('testthing2', 'test/lib/TestThing');
		var resolvedThing; 
		
		resourcePlugin.thaw({ type: 'testthing2', params: {someprop: true} }).then(function(value){
			resolvedThing = value;
		});
		
		waitsFor(function(){
			return !!resolvedThing;
		});
		runs(function(){
	  		expect(resolvedThing.declaredClass).toBe('TestThing');
	  		expect(resolvedThing.someprop).toBeTruthy();
		});
  	});
  	it("Should thaw module propery references", function(){
		resourcePlugin.thaw({ type: 'testthing2', params: {someprop: true} }).then(function(value){
			resolvedThing = value;
		});
  	})
  });
});