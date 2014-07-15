define(["models/Actor"], function(Actor) {
  console.log("ActorSpec loaded Actor: ", Actor);

  window.Actor = Actor;

  var goblin = {
    name: 'Test Goblin',
    icon: 'resources/graphics/GoblinIcon.png',
    strength: 4,
    hp: 10,
    mp: 0,
    range: 'short',
    evasion: 5,
    terrain: ["marsh", "mountains", "plains", "forest"]
  };

  var grue = new Actor({
    name: "Grue",
    health: 10
  });

  describe("Actors", function() {
    it("are instanceof Actor", function() {
      expect(grue instanceof Actor).toBeTruthy();
    });
    it("always have a type", function() {
      expect(grue.type).toBeTruthy();
    });
    it("have evented stats property", function() {
      expect(grue.stats).toBeTruthy();
      expect(typeof grue.stats.on).toBe('function');
      expect(typeof grue.stats.emit).toBe('function');
    });
    it("have an inventory", function() {
      expect(typeof grue.inventory).toBe('object');
    });

    it("picks up stats in constructor args", function() {
      expect(grue.stats.health).toBe(10);
    });

    it("broadcasts stats changes", function() {
      var wasChanged = false;
      grue.on('stats.health:change', function(){
        wasChanged = true;
      });
      grue.stats.update('health', 9);
      expect(grue.stats.health).toBe(9);
      expect(wasChanged).toBeTruthy();
    });

    it("snapshots baseStats", function() {
      grue.stats.update('health', 8);
      expect(grue.stats.health).toBe(8);
      expect(grue.baseStats.health).toBe(10);
    });
  });

});