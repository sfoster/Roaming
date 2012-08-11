define(["../SampleModule", "lib/event"], function(SampleModule, Evented) {

  describe("Sample Module", function() {
    it('should have a name', function() {
      expect(SampleModule.name).toBe("sample");
    });
    
    it('should state the purpose', function() {
      expect(SampleModule.purpose).toBe("AMD testing");
    });

    it('should have its own dependencies', function() {
      expect(SampleModule.dependency).toBe("Module B");
    });
  });

  describe("Evented dependency", function(){
    it(('should be loaded'), function(){
      expect(Evented).toBeDefined();
      expect(typeof Evented.on).toBe('function');
    });
  });

  return {
    name: "modulespec"
  };
});