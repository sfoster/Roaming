define([], function() {

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

  items.boots = {
    name: 'Boots',
    type: 'clothing'
  };

  items.cloak = {
    name: 'Thin Cloak',
    type: 'clothing'
  };

  items.hagStone = {
    name: 'Hag Stone',
    type: 'special'
  };

  return items;
});

