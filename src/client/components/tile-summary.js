define([
    'resources/terrain',
    ], function(Terrain) {
  'use strict';
  var TileSummary = {
    template: '#tileTemplate',
    props: { tile: Object, regionId: String },
    data: function() {
      return {};
    },
    beforeCreate: function() {
      console.log("tile instance beforeCreate: ", this);
    },
    created: function() {
      console.log("tile instance created: ", this);
    },
    watch: {
      "tile": function(val, oldVal) {
        console.log("tile instance had its tile property changed: ", val, oldVal);
      }
    },
    methods: {
      update: function() {
        this.parentId = "Updated parentId";
        this.id = "Updated id";
      }
    },
    computed: {
      id: function() {
        return this.tile && this.tile.id;
      },
      terrain: function() {
        return this.tile ? this.tile.terrain : '';
      },
      tileStyle: function() {
        let terrain = this.terrain;
        if (!terrain) {
          return {
            background: 'transparent'
          };
        }
        console.log("tileTyle computed, terrain:",this.terrain, this.tile);
        let imgSrc = Terrain[this.terrain].backdrop.replace(/^image\!/, '');
        let tile = this.tile;
        console.log(`tileStyle, terrain: ${tile.terrain}, backdrop: ${Terrain[tile.terrain].backdrop}`);
        return {
          backgroundImage: `url("${imgSrc}")`,
          backgroundRepeat: 'no-repeat'
        };
      },
      description: function() {
        return this.tile.description || "no description";
      },
      tileHref: function() {
        return `location.html?location=${this.regionId}/${this.id}`;
      },
      jumpId: function() {
        return 'jump_' + this.id;
      },
    },
    created: function() {
      console.log("tile created, this: ", this);
    }
  };

  return TileSummary;
});
