define([
  'lib/util',
  'resources/npc'
], function(util, npc){

  var encounters = {};

  encounters.beginning = {
    startScript: 'beginningStart',
    firstVisit: [
      'Your adventure starts here',
      'You dont quite know what you need to do, but you seem to be on the right track'
    ],
    reVisit: ['Your adventure started here. You have a long way to go still']
  };

  encounters.npc = {
    startScript: 'npcStart',
    endScript: 'npcEnd',
    firstVisit: [
      'You are not alone'
    ],
    reVisit: ['You\'ve passed this way before']
  };

  return encounters;
});