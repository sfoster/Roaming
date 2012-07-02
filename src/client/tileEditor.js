define([
  'lib/dollar',
  'resources/encounters',
  'resources/terrain',
  'resources/npc'
], function($, encounterTypes, terrainTypes, npcTypes){
  $.views.allowCode = false;
  // edit a location: 
  //  description, 
  //  terrain,  
  //  encounterType: [none, npc, etc.] (contents of resources/encounters)
  //   

  var editor = {
    location: null,
    setLocation: function(coord){
      if(typeof coord == 'string') {
        require(['plugins/location!'+coord + '!refresh'], function(locationModel){
          editor.setLocation(locationModel);
        });
        return;
      } else {
        this.location = coord;
      }
      this.init();
    },
    refresh: function(coord){
      coord = coord || this.location.id;
      require(['plugins/location!'+coord + '!refresh'], function(locationModel){
        console.log('reloaded location!'+coord, locationModel.get('description'));
        editor.setLocation(locationModel);
      });
    }
  };
  
  // set up the edit/preview tabs
  $('.tab-label').click(function(){
    var targ = this.getAttribute("data-target"), 
        parent = $(this).closest('.tab-container')[0];
        
    $('.tab-panel', parent).hide();
    $('.tab-label', parent).removeClass('selected');
    $(this).addClass('selected');
    $('#'+targ).show();
  });

  $('#detailSaveBtn').click(function(evt){
    var savePromise = editor.location.save();
    savePromise.then(function(){
      editor.refresh();
    });
  });
  
  $('#detailResetBtn').click(function(){
    editor.refresh();
  });

  editor.init = function init(){
    $( "#editLocationTemplate" )
            // data,      parentNode,       context,        prevNode, nextNode, index
      .link( editor.location, "#locationEdit", contextHelpers );

    $( "#previewLocationTemplate" )
            // data,      parentNode,       context,        prevNode, nextNode, index
      .link( editor.location, "#locationPreview", contextHelpers );
  };

  var contextHelpers = editor.context = {
      app: {
        selectedEncounterType: 'none'
      },
      terrainTypes: terrainTypes,
      npcTypes: npcTypes,
      encounterTypes: encounterTypes,
      afterChange: function(evt){
        console.log("onAfterChange: ", evt);
      },
      beforeChange: function(evt){
        var locn, etype, edata;
        if(evt.type == 'propertyChange'){
          if(evt.data == 'encounterType'){
            etype = evt.target.encounterType;
            locn = evt.target;
            edata =  locn.encounter[etype] || (locn.encounter[etype] = []);
            console.log("target.encounter: ", etype, edata);
          }
        }
      },
      swatchClass: function(type){
        return 'swatch ' + type;
      },
      testContext: function(label, obj){
        console.log("testContext: "+label, obj);
      },
      matches: function(value, pname, obj) {
        // this is the item in the array
        // this.parent.data is the array
        // this.parent.parent.data is the location
        obj = obj || this;
        // console.log("matches value: %s, pname: %s, obj: %o, obj[pname]: %o", value, pname, obj, obj[pname], value == obj[pname]);
        return value == obj[pname];
      },
      asArray: function(obj){
        return Object.keys(obj).map(function(name){
          return { name: name, value: obj[name] };
        });
      },
      isEncounterSelected: function(type){
        console.log("isEncounterSelected: ", type, editor.location.encounterType);
       return type == editor.location.encounterType; 
      },
      selectedEncounter: function(selectedEncounterType) {
        return (selectedEncounterType!=="none") ? encounterTypes[selectedEncounterType].title : "";
      },
      and: function(a, b) {
        return !!a && !!b;
      }
    };

    $.templates({
      editTmpl: "#editLocationTemplate",
      previewTmpl: "#previewLocationTemplate"
    });     
    
    return editor;
});
