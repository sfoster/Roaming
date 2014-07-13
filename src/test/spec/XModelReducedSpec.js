define(["models/EventedModel"], function(XModel) {
	console.log("XModelSpec loaded XModel: ", XModel);

  window.XModel = XModel;

  var grue = new XModel({
      type: 'grue',
      foo: "Foo",
      bar: "Bar",
      hats: ["too fancy", "just right"],
      stats: { type: 'stats', age: 2, health: "great" }
    });
  console.log("grue", grue);
  console.log("stats: ", grue.get("stats"));

  describe("XModels", function() {
  	var data = {
  		foo: "Foo",
      type: 'grue',
  		stats: { type: 'stats', age: 2, health: "great" }
  	};

    it('should notify before a property is changed', function() {
      var model = new XModel(data);
      var called = false;
      model.on('foo:willchange', function(evt) {
        console.log('willchange event: ', evt);
        called = true;
      });
      model.update('foo', 'Fool');
      expect(called).toBeTruthy();
    });

    it('sub-property subscriptions should survive updates to ancestor properties', function() {
      var model = new XModel(data);
      var changedAge;

      model.on('stats.age:change', function(event){
        changedAge = event.value;
      });
      model.get("stats").update("age", 99);
      expect(changedAge).toBe(99);

      model.update("stats", new XModel({ age: 18, race: "alien" }));
      expect(model.get('stats').get('age')).toBe(18);
      expect(model.get('stats').get('race')).toBe('alien');
      expect(model.get('stats').get('health')).toBeFalsy();
      // did the stats.age subscription get renewed when we swapped out the stats object?
      expect(changedAge).toBe(18);
      model.get("stats").update("age", 19);
      expect(changedAge).toBe(19);
    });

  });

  return {
    name: "XModelSpec"
  };
});