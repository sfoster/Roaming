define([], function(){
  
  var items = {};
 
 items.edibleMushroom = {
    name: 'Mushrooms',
    type: 'food'
  };
items.apple = {
    name: 'Apples',
    type: 'food'
  };
items.pear = {
    name: 'Pears',
    type: 'food'
  };
items.rope = {
    name: 'Rope',
    type: 'special'
  };
items.lantern = {
    name: 'Lantern',
    type: 'special'
  };
items.whetstone = {
    name: 'Whetstone',
    type: 'enhancement',
    effect: '+3 dmg with sharp weapons'
  };  
  return items;
});

