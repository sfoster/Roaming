define([
  'lib/dollar', 'lib/util', 'resources/template',
  'lib/Promise', 
  'lib/event', 
  'resources/map', 
  'resources/terrain',
  'resources/encounters',
  'resources/npc',
  'plugins/vendor/text!resources/templates/regionEditor.html'
], function(
  $, util, template,
  Promise, Evented,
  Map, terrainTypes, encounterTypes, npcTypes,
  editTemplate
){

  var pluck = util.pluck, 
      values = util.values, 
      keys = util.keys, 
      mixin = util.mixin,
      when = Promise.when;


  // compile the editor template
  editTemplate = $.templates( editTemplate );

  // map/region editor singleton
  var editor = window.regionEditor = util.mixin({
    currentTool: 'edittile',
    mapNode: null,
    tileSize: 50,
    worldSize:  { width: 25, height: 25},
    tilesByCoords: {},
    locationsByCoords: {},
    setRegion: function(region){
      this.region = region;
      if(this.region){
        console.log("populating map for region: ", region.id);
        this.populateMap();
      }
    } 
  }, Evented);

  //  
  function toolbarInit(){
    $('#saveBtn').click(function(evt){
      var locations = values(editor.tilesByCoords).map(function(tile){
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

  function paletteInit(){
    var $terrainList = $('#terrainlist');
    Object.keys(terrainTypes).forEach(function(type){
      $('<li class="panel tool '+type+'"><span>'+type+'</span></li>').appendTo($terrainList);
    });
    var $palette = $('#palette');
    $palette
      .delegate('.tool', 'mouseup', function(event){ 
        $('#palette .tool.active').removeClass('active');
        $(event.currentTarget).addClass('active');
        var type = trim( $(event.currentTarget).text() );
        editor.currentTool = type.replace(/\s+/g, '').toLowerCase();
        console.log("change currentTool: ", editor.currentTool);
      });
  }
  
  editor.populateMap = function populateMap(){
    var region = editor.region, 
        tiles = region.tiles;
    editor.tilesByCoords = region.byCoords();  

    var map = editor.map, 
        mapOptions = {
            tileSize: editor.tileSize,
            canvasNode: editor.mapNode,
            showCoords: true
        };
    if(map){
      map.reset(mapOptions);
    } else {
      map = editor.map = Map.create(mapOptions);
    }
    map.init().render( region.tiles );
  };
  
  editor.init = function init(options){
    // toolbarInit();
    // paletteInit();
    // detailEditInit();
    // editorInit();
    util.mixin(this, options || {});
    
    // top toolbar
    console.log("setting up #regionToolbar click handlers: ", $( "#regionToolbar" ).length);
    $( document ).on("click", "#regionToolbar .btn", function(evt){
      console.log("region toolbar btn click: ", evt.target);
      var buttonNode = evt.target;
      var action = buttonNode.getAttribute('data-action');
      $( buttonNode ).addClass('busy');
      var savePromise = editor.region.save();
      savePromise.then(function(){
        $( buttonNode ).removeClass('busy');
        if(editor.refresh) {
          editor.refresh();
        }
      });
      
    });

    editTemplate.link( editor.region, "#mapEdit", contextHelpers );
    
    $( "#regionEditorDrawer" ).on( "mouseup", 'li.tool', function(evt) {
      var toolNode = evt.target;
      $('#regionEditorDrawer .tool.active').removeClass('active');
      $( toolNode ).addClass('active');
      var action = toolNode.getAttribute('data-action');
      $.observable( editor ).setProperty( "currentTool", action || toolNode.textContent || toolNode.innerText );
    });

    var mapNode = editor.mapNode = $('#grid')[0], 
        worldSize = this.worldSize, 
        tileSize = options.tileSize || this.tileSize;
        
    $('#gridOverlay').css({
      width: worldSize.width*tileSize,
      height: worldSize.height*tileSize
    });
    
    mapNode.width = worldSize.width*tileSize;
    mapNode.height = worldSize.height*tileSize;
    
    var scrollContainerNode = mapNode.parentNode,
        mapOffsets = $(scrollContainerNode).offset();
        
    $('#gridOverlay').mousedown(function(event){
      var scrollOffsets = {
        left: scrollContainerNode.scrollLeft,
        top: scrollContainerNode.scrollTop
      };
      // console.log("scrollContainerNode offsets: ", mapOffsets);
      // console.log("scrollOffsets: ", scrollOffsets);
      // console.log("event.pageX,Y: ", event.pageX, event.pageY);
      var clickX = event.pageX - mapOffsets.left + scrollOffsets.left,
          clickY = event.pageY - mapOffsets.top + scrollOffsets.top,
          x = Math.floor(clickX / tileSize),
          y = Math.floor(clickY / tileSize);
      console.log("place at: ", x, y);
      if(!editor.currentTool) return;

      editor.toolAction(x, y, editor.currentTool);
    });

    if(this.region){
      this.setRegion(this.region); 
    }

  };

  function trim(text){
    return text.replace(/^\s+/, '').replace(/\s+$/, '');
  }

  editor.toolAction = function toolAction(x,y, type){
    console.log('toolAction: ', x, y, type);
    var id = [x,y].join(',');
    if(terrainTypes[type]){
      this.placeTile(x,y,type);
    } else if(type=='edittile'){
      editor.emit('tile:edit', {
        target: this.tilesByCoords[id]
      });
    } else {
      console.log("tool not implemented: ", type);
    }
  };
  
  editor.placeTile = function placeTile(x, y, type){
    var tileId = [x,y].join(','), 
        tile = this.tilesByCoords[tileId], 
        tileSize = this.tileSize;
    if(!tile){
      // create the tile object
      tile = this.tilesByCoords[tileId] = {
        x: x, y: y
      };
    }
    tile.type = type;
    
    var img = tile.img = terrainTypes[type].img, 
        ctx = editor.mapNode.getContext('2d');

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