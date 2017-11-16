define(function() {
  'use strict';

  var screenHeader = {
    beforeCreate: function() {
      console.log("beforeCreate, this: ", this);
    },
    template: '<h2>{{regionId}} / <span id="tile-coord">{{coord}}</span></h2>',
    props: {},
    computed: {
      regionId: function() {
        return this.$parent.currentRegionId;
      },
      coord: function() {
        return this.$parent.currentCoord;
      },
      description: function() {
        return this.$parent.description;
      }
    },
    created: function() {
      Evented && Evented.on("tilechange", this.tileChange);
      console.log("pageheader created, $parent: ", this.$parent);
    },
    mounted: function() {
      console.log("pageheader mounted, $parent: ", this.$parent);
    },
    methods: {
      tileChange: function(event) {
        let tile = event.data;
        console.log("header regionChange handler:", event);
        for (let key in this._data) {
          if (tile.hasOwnProperty(key)) {
            this[key] = tile[key];
            console.log("updated " + key, this[key]);
          }
        }
      }
    }
  };
  return screenHeader;
});
