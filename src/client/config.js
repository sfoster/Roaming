// loader config
require.config({
  baseUrl: "./",
  paths: {
    // path mappings
    dollar: 'vendor/zepto',
    text: 'plugins/vendor/text',
    json: 'plugins/vendor/json',
    image: 'plugins/vendor/image',
    order: 'plugins/vendor/order',
    lang: 'vendor/lodash',
    compose: 'vendor/compose',
    // data resources
    player: '../../data/player',
    location: '../../data/location',
    region: '../../data/location'
  },
  packages: [
    { name: 'store',   location: './vendor/store',    main: 'main' },
    { name: 'promise',   location: './vendor/promised-io',    main: 'promise' },
    { name: 'knockout',   location: './vendor/knockout',    main: 'main' }
  ],
  waitSeconds: 15
});

// environment config
var config = {
  dataUrl: ''
};

(function(){
  // pull config from querystring
  var expectedKeys = { playerid: true, tileid: true,
                       region: true, location: true, resourceid: true };

  var queryStr = location.search.substring(1);
  var pairs, nameValue, params = {};
  if(queryStr){
    pairs = queryStr.split('&');
    for(var i=0; i<pairs.length; i++) {
      nameValue = pairs[i].split('=');
      if(nameValue[0] && (nameValue[0] in expectedKeys)){
        config[ nameValue[0] ] = nameValue[1];
      }
    }
    if(i >= pairs.length && location.hash) {
        config[ nameValue[0] ] += location.hash;
    }
  }
})();
