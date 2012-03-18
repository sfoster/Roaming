define([
  '$', 'resources/util', 'resources/template',
  'resources/Promise', 
  'resources/map', 'resources/terrain'
], function(
  $, util, template,
  Promise, 
  map, terrainTypes
){

  var pluck = util.pluck, 
      values = util.values, 
      keys = util.keys, 
      mixin = util.mixin,
      when = Promise.when;

  var currentTool = 'barren';
  var mapNode = null;
  var tileSize = 50, 
      worldSize = { width: 25, height: 25},
      tilesByCoords = {};
  
  //  
  function saveDetail() {
    var $detail = $('#detailContent'); 
    var formData = locationModel;
    var fields = $('input[type="text"], input[type="hidden"], textarea', $detail).each(function(idx, el){
      formData[ el.name ] = $(el).val();
    });
    console.log("formData: ", formData);
    var id = formData.id = formData.coords;
    formData.coords = formData.coords.split(',').map(Number);
      
    var savePromise = new Promise();
    $.ajax({
      type: 'PUT',
      dataType: 'json',
      contentType: 'application/json',
      url: '/location/'+id+'.json',
      data: JSON.stringify(formData),
      success: function(resp){
        console.log("save response: ", resp);
        alert("location saved: "+ resp.status);
        savePromise.resolve(resp.status);
      }, 
      error: function(xhr){ 
        console.warn("error saving location: ", xhr.status);
        alert("Unable to save location right now"); 
        savePromise.reject(xhr.status);
      }
    });
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
        saveDetail(locationModel).then(hideDetail);
      }, 
      function(){}
    );
    $('#detailResetBtn').click(cancelDetailEdit);
  }
     
  function toolbarInit(){
    $('#saveBtn').click(function(evt){
      var locations = values(tilesByCoords).map(function(tile){
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
  }

  var locationModel = null;
  
  function editDetail(id, tile){
    console.log("editDetail: ", id);

    showDetail();
    
    var tmpl= template( $('#detail-template')[0].innerHTML );
    var $detailContainer = $('#detail'), 
        $detail = $('#detailContent');
    
    var defaults = terrainTypes[tile.type] || {};
    console.log("defaults: ", defaults);
    require(['json!/location/'+id+'.json'], function(location){
      if(!location.coords){
        console.error("No location at: ", id);
        location = {
          coords: id.split(',')
        };
      } else {
        location.id = location.coords.join(',');
      }
      if(location.description.match(/^--/)){
        delete location.description;
      }
      if(location.afar.match(/^--/)){
        delete location.afar;
      }
      location = util.mixin(defaults, location);
      console.log("got back location: ", location);
      locationModel = location;
      $detail.html( tmpl( util.mixin(location, { type: tile.type }) ) );
    });

    // $detail.empty();
    // 
    // Object.keys(npc).forEach(function(id){
    //   var data  = Object.create(tilesByCoords[id]);
    //   data.id = id;
    //   var str = tmpl.replace(pattern, function(m, name){
    //     return (name in data) ? data[name] : "";
    //   });
    //   $(str).appendTo($detail);
    // });
    
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
        currentTool = type.replace(/\s+/g, '').toLowerCase();
        console.log("change currentTool: ", currentTool);
      });
  }
  
  function editorInit(){
    $('#gridOverlay, #map').css({
      width: worldSize.width*tileSize,
      height: worldSize.height*tileSize
    });
    mapNode = $('#grid')[0];
    mapNode.width = worldSize.width*tileSize;
    mapNode.height = worldSize.height*tileSize;
    
    var scrollContainerNode = $('#main')[0],
        mapOffsets = $('#map').offset();
        
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
      if(!currentTool) return;

      toolAction(x, y, currentTool);
    });
  }

  function populateMap(){
    map.init().then(function(){
      require(['json!/location/world.json'], function(mapData){
        var tiles = mapData.tiles;
        // console.log("loaded mapData: ", mapData);
        tiles.forEach(function(tile){
          var tileId = [tile.x, tile.y].join(',');
          tilesByCoords[tileId] = tile;
        });
        map.renderMap( tiles, {
          tileSize: tileSize,
          canvasNode: mapNode
        });
      });
    });
    
  }
  function init(){
    toolbarInit();
    paletteInit();
    detailEditInit();
    editorInit();
    populateMap();
  }


  function trim(text){
    return text.replace(/^\s+/, '').replace(/\s+$/, '');
  }

  function toolAction(x,y, type){
    var id = [x,y].join(',');
    if(terrainTypes[type]){
      placeTile(x,y,type);
    } else if(type=='edittile'){
      editDetail(id, tilesByCoords[id]);
    } else {
      console.log("tool not implemented: ", type);
    }
  }
  function placeTile(x, y, type){
    var tileId = [x,y].join(','), 
        tile = tilesByCoords[tileId];
    if(!tile){
      // create the tile object
      tile = tilesByCoords[tileId] = {
        x: x, y: y
      };
    }
    tile.type = type;
    
    var img = tile.img = terrainTypes[type].img, 
        ctx = mapNode.getContext('2d');

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
  }

  init();
});