define(["models/Item"], function(Item) {
  console.log("ItemSpec loaded Item: ", Item);

  window.Item = Item;

  var thing = new Item({
    foo: "Foo",
    bar: "Bar",
    description: 'foo-bar'
  });

  describe("Items", function() {
    it("instances have EventedModel behavior", function(){
      expect(typeof thing.emit).toBe('function');
      expect(typeof thing.get).toBe('function');
      expect(typeof thing.update).toBe('function');
      expect(typeof thing.remove).toBe('function');
    });
    it("instances have a type", function(){
      expect(thing.type).toBeTruthy();
    });
    it("instances have a name", function(){
      expect(thing.name).toBeTruthy();
    });

    it("instances can be examined", function(){
      expect(thing.examine()).toBeTruthy();
    });
  });

});