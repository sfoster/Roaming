define(["lib/switchboard", "lib/util"], function(switchboard, util) {
  window.switchboard = switchboard;

  describe("switchboard", function() {
    it('implements the Evented interface', function() {
      expect(typeof switchboard.on).toBe('function');
      expect(typeof switchboard.removeAllListeners).toBe('function');
      expect(typeof switchboard.emit).toBe('function');
    });
    it('notifies subscribers on event topics', function() {
      var events0 = [];
      var events1 = [];
      var subscriber0 = switchboard.on('apple:ripens', function(evt) {
        events0.push(evt);
      });
      var subscriber1 = switchboard.on('apple:ripens', function(evt) {
        events1.push(evt);
      });
      switchboard.emit('apple:ripens', { taste: 'good' });
      expect(events0.length).toBe(1);
      expect(events1.length).toBe(1);
      expect(events0[0].taste).toBe('good');
    });
    it('can alias another name to an id', function() {
      switchboard.alias('bar', 'foo');
      var callCount = 0;
      switchboard.on('bar:change', function(){
        callCount++;
      });
      switchboard.on('foo:change', function(){
        callCount++;
      });
      switchboard.emit('foo:change', "payload");
      expect(callCount).toBe(2);
      callCount = 0;
      switchboard.emit('bar:change', "payload");
      expect(callCount).toBe(2);

    });
    it('can be reset cleanly', function() {
      expect(typeof switchboard.reset).toBe('function');
      var events = [];
      switchboard.alias('start', 'begin');
      switchboard.on('begin', function(evt){
        console.log('begin listener');
        events.push(evt);
      });
      switchboard.on('start', function(evt){
        console.log('start listener');
        events.push(evt);
      });
      switchboard.reset();
      switchboard.emit('begin', {});
      expect(events.length).toBe(0);
    });

    // track/update contained-ness, or inCollection property?
  });

});