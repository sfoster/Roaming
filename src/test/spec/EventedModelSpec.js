define(["models/EventedModel"], function(EventedModel) {
	console.log("EventedModelSpec loaded EventedModel: ", EventedModel);

  window.EventedModel = EventedModel;

  var grue = new EventedModel({
      foo: "Foo",
      bar: "Bar",
      hats: ["too fancy", "just right"],
      stats: { age: 2, health: "great" }
    });
  console.log("grue", grue);
  console.log("stats.age: ", grue.get("stats").get("age"));
  console.log("stats: ", grue.get("stats").toJS());

  describe("EventedModels", function() {
  	var data = {
  		foo: "Foo",
  		bar: "Bar",
  		hats: ["too fancy", "just right"],
  		stats: { age: 2, health: "great" }
  	};

    it('should be a constructor', function() {
      expect(typeof EventedModel).toBe("function");
      expect((new EventedModel) instanceof EventedModel).toBeTruthy();
    });
    it('should have an on method', function() {
      var model = new EventedModel;
      expect(typeof model.on).toBe('function');
    });

    it('should create sub-models for object properties', function() {
      var model = new EventedModel(data);
      expect(EventedModel.isInstanceOf(model.stats)).toBeTruthy();
    });

    it('should provide access to sub-model properties', function() {
      var model = new EventedModel(data);
      expect(model.get('stats').get('age')).toBe(2);
    });

    it('should notify when we update a property', function() {
    	var model = new EventedModel(data);
    	var notified = false;
      console.log("test - subscribing to model.foo");
    	model.on('foo:change', function(evt){
    		notified = true;
    	});
      console.log("test - updating foo");
    	model.update("foo", "New fu");
      expect(model.get('foo')).toBe("New fu");
      expect(notified).toBeTruthy();
    });

    it('should maintain nested models', function() {
      console.log('should maintain nested models');
      var model = new EventedModel(data);
      var altStats = new EventedModel({ age: 100, hp: 12, level: 9 });
      var statsNotified = 0;
      var ageNotified = 0;
      var altAgeNotified = 0;

      model.on('stats:change', function(evt){
        statsNotified++;
      });
      model.on('stats.age:change', function(evt){
        ageNotified++;
      });
      altStats.on('age:change', function(evt){
        altAgeNotified++;
      });

      var oldStats = model.get('stats');
      model.update('stats', altStats);
      expect(statsNotified).toBe(1);
      expect(ageNotified).toBe(1);
      expect(model.get('stats').get('age')).toBe(100);

      model.get('stats').update('age', 101);
      expect(statsNotified).toBe(1);
      expect(ageNotified).toBe(2);
      expect(altAgeNotified).toBe(1);

      // put the old data back
      model.update('stats', oldStats);
      expect(statsNotified).toBe(2);
      expect(ageNotified).toBe(3);
      expect(model.get('stats').get('age')).toBe(2);

      model.get('stats').update('age', 3);
      // subscription was to age on the other model,
      // so we should be notified of stats.age changes, but not age:change on altStats
      expect(ageNotified).toBe(4);
      expect(altAgeNotified).toBe(1);
    });

    it('sub-property subscriptions should survive updates to ancestor properties', function() {
      var model = new EventedModel(data);
      console.log("sub-property subscriptions should survive updates, using data:", data);
      var changedAge;
      console.log("subscribing to model");
      model.on('stats.age:change', function(evt){
        console.log("model subscribe callback");
        changedAge = evt.value;
      });
      console.log("updating stats")
      model.get("stats").update("age", 99);
      expect(changedAge).toBe(99);

      model.update("stats", new EventedModel({ age: 18, race: "alien" }));
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
    name: "EventedModelSpec"
  };
});