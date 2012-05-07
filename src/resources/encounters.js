define([], function(){
  
  var encounters = {};
  
  encounters.beginning = {
    firstVisit: [
      'Your adventure starts here',
      'You dont quite know what you need to do, but you seem to be on the right track'
    ],
    reVisit: ['Your adventure started here. You have a long way to go still']
  };

  return encounters;
});