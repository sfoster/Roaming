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

  	it("Should use the factory exported by a type module indicated in the type anchor", function(){
		resourcePlugin.registerType('testthing2', 'test/lib/TestThing');
		var resolvedThing;

		resourcePlugin.thaw({ type: 'testthing2#OtherThing', params: {} }).then(function(value){
			resolvedThing = value;
		});

		waitsFor(function(){
			return !!resolvedThing;
		});
		runs(function(){
	  		expect(resolvedThing.declaredClass).toBe('OtherThing');
		});
  	});

  	it("Should thaw module property references", function(){
			var resolvedThing;

			resourcePlugin.thaw({
				resource: 'test/lib/somebundle#foo', params: {someprop: true}
			}).then(function(value){
				resolvedThing = value;
			}, function(){
				resolvedThing = false;
			});

			waitsFor(function(){
				return undefined !== resolvedThing;
			});

			runs(function(){
		  		expect(resolvedThing.name).toBe('Foo');
	  	});
	  });
  });

  describe("Nested resources", function() {
  	it("Should thaw propertiesWithReferences", function(){
			resourcePlugin.registerType('testthing2', 'test/lib/TestThing');
			resourcePlugin.registerType('complexthing', 'test/lib/TestComplexThing');
	  	var resourceData = {
			  subthings: [
			  	{ type: 'testthing2', params: { name: 'someobject1' } },
			  	{ type: 'testthing2', params: { name: 'someobject2' } }
			  ],
			  bundle: { resource: 'test/lib/somebundle#bar' },
			};
			console.log("complex resourceData is ", resourceData);
			var resolvedThing;

			resourcePlugin.thaw({ type: 'complexthing', params: resourceData }).then(function(thing){
				resolvedThing = thing;
			}, function(){
				resolvedThing = false;
			});

			waitsFor(function(){
				return undefined !== resolvedThing;
			});

			runs(function(){
				console.log("resolvedThing is ", resolvedThing);
	  		expect(resolvedThing).toBeTruthy();

	  		var subThing1 = resolvedThing.subthings[0];
	  		expect(subThing1).toBeTruthy();
	  		expect(subThing1.declaredClass).toBe('TestThing');
	  		expect(subThing1.name).toBe('someobject1');

	  		var subThing2 = resolvedThing.subthings[1];
	  		expect(subThing2).toBeTruthy();
	  		expect(subThing2.declaredClass).toBe('TestThing');
	  		expect(subThing2.name).toBe('someobject2');

	  		var bundle = resolvedThing.bundle;
	  		expect(bundle).toBeTruthy();
	  		expect(bundle.name).toBe('Bar');

	  	});
  	});


  });
});