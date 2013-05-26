define([
  'lib/util',
  'lib/event',
  'lib/clone',
  'models/Encounter',
  'models/NPCEncounter',
  'resources/npc'
], function(util, Evented, sanitizedClone, Encounter, NPCEncounter, npc){

  var encounters = {};

  encounters.beginning = {
    firstVisit: [
      'Your adventure starts here',
      'You dont quite know what you need to do, but you seem to be on the right track'
    ],
    reVisit: ['Your adventure started here. You have a long way to go still']
  };

  encounters.npc = {
    firstVisit: [
      'Your adventure starts here',
      'You dont quite know what you need to do, but you seem to be on the right track'
    ],
    reVisit: ['Your adventure started here. You have a long way to go still']
  };

  return encounters;
});