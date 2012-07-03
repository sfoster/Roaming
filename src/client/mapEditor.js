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
  var editor = util.mixin({
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
  function saveDetail() {
    var $detail = $('#detailContent'); 
    var formData = Object.create(locationModel);
    var savePromise = locationModel.save();
    
    savePromise.then(function(){
      console.log("Location " + locationModel.id + " saved");
    });
    
    // var fields = $('input[type="text"], input[type="hidden"], textarea', $detail).each(function(idx, el){
    //   formData[ el.name ] = $(el).val();
    // });
    // 
    // console.log("formData: ", formData);
    // var id = formData.id,
    //     coords = formData.coords || id.split(',');
    // formData.coords = coords.map(Number);
    return savePromise;
  }

  function showDetail(){
    $("#map").addClass("hidden");
    $("#maptoolbar").addClass("hidden");
    $("#detail").removeClass("hidden");
    $("#detailtoolbar").removeClass("hidden");
  }
  
  function hideDetail(){
    $("#detail").addClass("hidden");
    $("#detailtoolbar").addClass("hidden");
    $("#map").removeClass("hidden");
    $("#maptoolbar").removeClass("hidden");
  }

  function cancelDetailEdit(){
    hideDetail();
    $('#detailContent').html("");
    locationModel = null;
  }
  
  function detailEditInit(){
    $('#detailSaveBtn').click(
      function(evt){
        saveDetail(locationModel).then(function(){
          hideDetail();
          
        });
      }, 
      function(){}
    );
    $('#detailResetBtn').click(cancelDetailEdit);
  }
     
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

  var locationModel = null;
  
  function loadDetail(id) {
    var locationModel = locationsByCoords[id];
    var detailPromise = new Promise();
    if(locationModel) {
      setTimeout(function(){
        detailPromise.resolve(locationModel);
      }, 10);
    } else {
      require(['json!/location/'+id+'.json'], function(location){
        if(!location.coords){
          console.error("No location at: ", id);
          location = {
            coords: id.split(',')
          };
        } else {
          location.id = location.coords.join(',');
        }
        detailPromise.resolve(location);
      });
    }
    return detailPromise;
  }
  
  function populateForm(form, data){
    
  }
  
  function editDetail(id, tile){
    console.log("editDetail: ", id);

    showDetail();
    
    var tmpl= template( $('#detail-template')[0].innerHTML );
    var $detailContainer = $('#detail'), 
        $detail = $('#detailContent');
    
    var defaults = terrainTypes[tile.type] || {};
    console.log("defaults: ", defaults);
    
    loadDetail(id).then(function(location){
      if(location.description.match(/^--/)){
        delete location.description;
      }
      if(location.afar && location.afar.match(/^--/)){
        delete location.afar;
      }
      location = util.mixin(defaults, location);
      console.log("got back location: ", location);
      locationModel = location;
      $detail.html( tmpl( util.mixin(location, { type: tile.type }) ) );

      var encounterPicker = $('#encounter_type')[0];
      if(encounterPicker){
        for(var encounterType in encounterTypes){
          encounterPicker.options[encounterPicker.options.length] = new Option(encounterType, encounterType);
        }
      }
      var npcPickers = $('.npc_picker');
      console.log("npcPickers: ", npcPickers);
      npcPickers.each(function(idx, npcPicker){
        console.log("npcPicker: ", npcPicker);
        npcPicker.options[npcPicker.options.length] = new Option('--None--', '');
        for(var npcType in npcTypes){
          npcPicker.options[npcPicker.options.length] = new Option(npcTypes[npcType].name, npcType);
        }
      });
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

    editTemplate.link( editor.region, "#mapEdit", contextHelpers );
    
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
      console.log("scrollContainerNode offsets: ", mapOffsets);
      console.log("scrollOffsets: ", scrollOffsets);
      console.log("event.pageX,Y: ", event.pageX, event.pageY);
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
      app: {},
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