define(["compose", "models/Collection", "lib/util"], function(Compose, Collection, util) {
  console.log("CollectionSpec loaded Collection: ", Collection);

  window.Collection = Collection;

  var TestEntry = Compose(Compose, {
  }, function() {
    this._id = 'entry_' + (TestEntry._count++);
  });
  TestEntry._count = 0;

  function getTestData() {
    return {
      'entry1st': new TestEntry({ name: 'first'}),
      'entry2nd': new TestEntry({ name: 'second'}),
      'entry3rd': new TestEntry({ name: 'third'})
    };
  }
  function prepareTestGroup(testData) {
    var group = new Collection([testData.entry1st,
                                testData.entry2nd,
                                testData.entry3rd]);
    return group;
  }

  describe("Collections", function() {
    beforeEach(function() {
      this.testData = getTestData();
      this.testGroup = prepareTestGroup(this.testData);
    });

    it("are instanceof Collection", function() {
      expect(this.testGroup instanceof Collection).toBeTruthy();
    });

    it("always have a type", function() {
      expect(this.testGroup.type).toBeTruthy();
    });

    it("reports size", function() {
      expect(this.testGroup.size()).toBe(3);
      expect((new Collection()).size()).toBe(0);
    });

    it("can lookup items by index", function() {
      expect(this.testGroup.get(0)).toBe(this.testData.entry1st);
      expect(this.testGroup.get(1)).toBe(this.testData.entry2nd);
      expect(this.testGroup.get(2)).toBe(this.testData.entry3rd);
      expect(this.testGroup.get(3)).toBeUndefined();
    });

    it("can get index of item", function() {
      var fourth = new TestEntry({ name: 'fourth'});
      expect(this.testGroup.indexOf(this.testData.entry1st)).toBe(0);
      expect(this.testGroup.indexOf(this.testData.entry3rd)).toBe(2);
      expect(this.testGroup.indexOf(fourth)).toBe(-1);
    });

    it("can append items", function() {
      var fourth = new TestEntry({ name: 'fourth'});
      this.testGroup.add(fourth);
      expect(this.testGroup.size()).toBe(4);
      expect(this.testGroup.get(3)).toBe(fourth);
    });

    it("can replace items", function() {
      var twoBe = new TestEntry({ name: '2n'});
      this.testGroup.update(1, twoBe);
      expect(this.testGroup.get(1)).toBe(twoBe);
      expect(this.testGroup.size()).toBe(3);
    });

    it("can iterate over items", function() {
      var names = [];
      var lastIndex;
      var iteratorGroup;
      this.testGroup.forEach(function(entry, idx, arry) {
        names[idx] = entry.name;
        lastIndex = idx;
        iteratorGroup = arry;
      });
      expect(names.join(',')).toBe("first,second,third");
      expect(lastIndex).toBe(2);
      expect(util.getType(iteratorGroup)).toBe('array');
    });

    it("can remove items", function() {
      var removedEntry = this.testGroup.remove(0);
      expect(this.testGroup.size()).toBe(2);
      expect(removedEntry).toBe(this.testData.entry1st);
      expect(this.testGroup.get(0)).toBe(this.testData.entry2nd);
    });

    it("can empty all items", function() {
      this.testGroup.removeAll();
      expect(this.testGroup.size()).toBe(0);
    });

    it("raises change event on update", function() {
      var testEvent;
      var newEntry = new TestEntry({
        name: 'newthing'
      });
      this.testGroup.on('change', function(evt){
        testEvent = evt;
      });
      this.testGroup.update(1, newEntry);
      expect(testEvent.action).toBe('update');
      expect(testEvent.value).toBe(newEntry);
      expect(testEvent.index).toBe(1);
      expect(testEvent.oldValue).toBe(this.testData.entry2nd);
    });

    it("raises change event on add", function() {
      var testEvent;
      var newEntry = new TestEntry({
        name: 'newthing'
      });
      this.testGroup.on('change', function(evt){
        testEvent = evt;
      });
      this.testGroup.add(newEntry);
      expect(testEvent.action).toBe('add');
      expect(testEvent.index).toBe(3);
      expect(testEvent.value).toBe(newEntry);
    });

    it("raises change event on remove", function() {
      var testEvent;
      this.testGroup.on('change', function(evt){
        testEvent = evt;
      });
      var result = this.testGroup.remove(0);
      expect(testEvent.action).toBe('remove');
      expect(testEvent.value).toBe(this.testData.entry1st);
      expect(result).toBe(this.testData.entry1st);
    });

    it("raises change event on remove all", function() {
      var testEvent;
      this.testGroup.on('change', function(evt){
        testEvent = evt;
      });
      var result = this.testGroup.removeAll();
      expect(testEvent.action).toBe('removeall');
      expect(testEvent.value).toBeFalsy();
    });

    // track/update contained-ness, or inCollection property?
  });

});