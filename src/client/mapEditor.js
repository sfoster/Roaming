define([
  'dollar',
  'lib/util',
  'promise', 
  'knockout',

  'lib/event', 
  'resources/map', 
  'resources/terrain',
  'resources/encounters',
  'resources/npc'
], function(
  $, 
  util, 
  Promise, 
  ko, 
  Evented,
  Map, terrainTypes, encounterTypes, npcTypes
){
  var pluck = util.pluck, 
      values = util.values, 
      keys = util.keys, 
      mixin = util.mixin,
      when = Promise.when;

  // compile the editor template

  // map/region editor singleton
  var editor = window.regionEditor = util.mixin({
    currentTool: ko.observable('edittile'),
    drawerMode: ko.observable('terrain'),
    mapNode: null,
    tileSize: 50,
    worldWidth:  10,  // initial, default values
    worldHeight: 10, 
    terrainList: [],
    tilesByCoords: {},
    locationsByCoords: {}
  }, Evented, {
    configure: function(options){
      util.mixin(this, options || {});
      return this;
    },
    initialize: function init(options){
      var self = this;
      if(this.initialized) return;
      this.initialized = true;

      // paletteInit();
      // detailEditInit();
      // editorInit();
      util.mixin(this, options || {});

      // slop in the template
      // this.render(editTemplate);

      if(!this.region) {
        throw "mapEditor initialized without a region property";
      }

      // set up the live list of tiles to render
      this.tiles        = ko.observableArray([]);
      
      // use prototype values as initial values of observable properties
      this.tileSize     = ko.observable(this.tileSize);
      this.worldWidth   = ko.observable(this.worldWidth);  // initial, default values
      this.worldHeight  = ko.observable(this.worldHeight);

      this.mapWidth     = ko.computed(function(){
        console.log("mapWidth: ", self.worldWidth() * self.tileSize());
        return self.worldWidth() * self.tileSize();
      });
      this.mapHeight    = ko.computed(function(){
        return self.worldHeight() * self.tileSize();
      });

      this.mapWidthPx   = ko.computed(function(){
        return self.mapWidth() + 'px';
      });
      this.mapHeightPx  = ko.computed(function(){
        return self.mapHeight() + 'px';
      });

      this.tiles.subscribe(function(tiles) {
        console.log("tiles change, calling populateMap");
        self.populateMap(tiles);
      });

      this.terrainTypes = terrainTypes;
      // this.terrainList = Object.keys(terrainTypes).map(function(name){
      //   var terrainData= terrainTypes[name];
      //   var terrain = util.mixin(Object.create(terrainData), { tname: name });
      //   return terrain;
      // });
      // console.log("prepared terrainList: ", this.terrainList.length, this.terrainList);

      this.applyBindings();
      this.region().locations(null, { rows: this.tiles });
    }, 
    getTile: function(id){
      var defd = new Promise();
      this.region().get(id).then(function(resp){
        defd.resolve(resp);
      }, function(err){
        console.warn("Got error response when getting " + id, arguments);
        defd.reject(err);
      });
      return defd;
    },
    applyBindings: function(){
      console.log("Applying bindings in mapEditor: ", this);
      var selfNode = $(this.el)[0];
      ko.applyBindings(this, selfNode);
      return this;
    },
    onTabTrayClick: function(vm, evt){
      // event-delegation for tab-label clicks
      var targ = $(evt.target).closest('.tab-label').attr('data-name'); 
      this.drawerMode(targ);
    },
    populateMap: function populateMap(tiles){
      var self = this;
      // update height/width. 
      // Will need to adjust if we ever have paged mapping where a query doesnt represent the whole region

      console.log("populateMap: setting worldWidth/Height based on incoming tiles");
      this.worldWidth( tiles.reduce(function(prev, value){ 
        return Math.max(prev || 0, value.x || 0) || 0; 
      }) );
      this.worldHeight( tiles.reduce(function(prev, value){ 
          return Math.max(prev || 0, value.y || 0) || 0; 
      }) );
      
      var mapNode = $('.grid', this.el)[0]; 
      
      var map = self.map, 
          mapOptions = {
              tileSize: self.tileSize(),
              canvasNode: mapNode,
              showCoords: true
          };
      // console.log("map options: ", mapOptions, map);
      if(map){
        map.reset(mapOptions);
      } else {
        map = editor.map = Map.create(mapOptions);
      }
      setTimeout(function(){
        // console.log("Calling init, render with tiles: ", tiles, " on node: ", mapNode);
        map.init().render( tiles, {
         canvasNode: mapNode 
        });
      }, 200);
    }, 
    render: function(html){
      console.log("mapEditor: rendering with el: ", $(this.el)[0]);
      var $el = $(this.el);
      $el.html( html );
    }, 
    onRegionToolbarClick: function(binding, evt){
      console.log("region toolbar btn click: ", evt.target);
      var buttonNode = evt.target;
      var action = buttonNode.getAttribute('data-name');
      $( buttonNode ).addClass('busy');
      if('save' == action) {
        var savePromise = editor.region().save();
        savePromise.then(function(){
          $( buttonNode ).removeClass('busy');
          if(editor.refresh) {
            editor.refresh();
          }
        });
      } else {
        if(editor.refresh) {
          editor.refresh();
        }
      }
    },
    onRegionEditorDrawerToolMouseup: function(binding, evt){
      var toolNode = evt.target;
      $('#regionEditorDrawer .tool.active').removeClass('active');
      $( toolNode ).addClass('active');
      var action = toolNode.getAttribute('data-name');
      // $.observable( editor ).setProperty( "currentTool", action || toolNode.textContent || toolNode.innerText );
    }, 
    onGridMouseDown: function(binding, evt) {
      // handle selection of a tile in the map
      var editor = this, 
          tileSize = editor.tileSize();

      var scrollContainerNode = evt.target.parentNode,
          mapOffsets = $(scrollContainerNode).offset();

      var scrollOffsets = {
        left: scrollContainerNode.scrollLeft,
        top: scrollContainerNode.scrollTop
      };
      // console.log("scrollContainerNode offsets: ", mapOffsets);
      // console.log("scrollOffsets: ", scrollOffsets);
      // console.log("event.pageX,Y: ", event.pageX, event.pageY);
      var clickX = evt.pageX - mapOffsets.left + scrollOffsets.left,
          clickY = evt.pageY - mapOffsets.top + scrollOffsets.top,
          x = Math.floor(clickX / tileSize),
          y = Math.floor(clickY / tileSize);
      console.log("place at: ", x, y);
      if(!editor.currentTool()) return;

      editor.toolAction(x, y, editor.currentTool());
    }
  });

  function toolbarInit(){
    $('#saveBtn').click(function(evt){
      var locations = values(editor.regiontilesByCoords).map(function(tile){
        var locn = mixin({}, tile);
        delete locn.img;
        return locn;
      });

      console.log("saving this: ", locations);
      $.ajax({
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        url: '/location/world.json',
        data: JSON.stringify(locations),
        success: function(resp){
          console.log("save response: ", resp);
          alert("update to world map was: "+ resp.status);
        }, 
        error: function(xhr){ 
          console.log("error saving map: ", xhr.status);
          alert("Unable to save map right now"); 
        }
      });
      
    });
    $('#resetBtn').click(function(evt){
      // re-fetch the map data and re-render
      populateMap();
    });
    $('#downloadMapBtn').click(function(evt){
      var form = evt.target.form;
      $('input[name="download"]', form).val(+new Date());
    });
    
  }

  function trim(text){
    return text.replace(/^\s+/, '').replace(/\s+$/, '');
  }

  editor.toolAction = function toolAction(x,y, type){
    console.log('toolAction: ', x, y, type);
    var id = [x,y].join(',');
    if(terrainTypes[type]){
      this.placeTile(x,y,type);
    } else if(type=='edittile'){
      editor.go( this.region().target, id );
    } else {
      console.log("tool not implemented: ", type);
    }
  };
  
  editor.placeTile = function placeTile(x, y, type){
    var tileId = [x,y].join(','), 
        tile = this.getTile(tileId), 
        tileSize = this.tileSize();
    if(!tile){
      // create the tile object
      tile = this.region().add({
        x: x, 
        y: y, 
        type: type
      });
    }
    
    var img = tile.img = terrainTypes[type].img, 
        ctx = $('canvas.grid', editor.el)[0].getContext('2d');

    if(!img) {
      console.log("no image?", tile, img);
    }
    ctx.clearRect(
        tileSize*tile.x,        // dest-x
        tileSize*tile.y,        // dest-y
        tileSize,               // dest-width
        tileSize                // dest-height
    );
    
    if(img && type !== 'clear'){
      ctx.drawImage(
          img,                    // image
          0,                      // source-x
          0,                      // source-y
          tileSize,              // source-width
          tileSize,             // source-height
          tileSize*tile.x,        // dest-x
          tileSize*tile.y,        // dest-y
          tileSize,               // dest-width
          tileSize                // dest-height
      );
    }
  };

  var contextHelpers = editor.context = {
      toolbar: {},
      editor: editor,
      terrainTypes: terrainTypes,
      npcTypes: npcTypes,
      encounterTypes: encounterTypes,
      afterChange: function(evt){
        console.log("onAfterChange: ", evt);
      },
      beforeChange: function(evt){
        console.log("onAfterChange: ", evt);
      },
      swatchClass: function(type){
        return 'swatch ' + type;
      },
      testContext: function(label, obj){
        console.log("testContext: "+label, obj);
      },
      matches: function(value, pname, obj) {
        // console.log("match value %o against property %s in %o: %o", value, pname, obj, obj[pname]);
        obj = obj || this;
        return value == obj[pname];
      },
      asArray: function(obj){
        return Object.keys(obj).map(function(name){
          return { name: name, value: obj[name] };
        });
      },
      and: function(a, b) {
        return !!a && !!b;
      }
    };

  return editor;
});