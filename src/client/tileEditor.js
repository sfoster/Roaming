define([
  'dollar',
  'lib/util',
  'lib/Promise', 
  'knockout',
  'resources/encounters',
  'resources/terrain',
  'resources/npc',
  'plugins/vendor/text!resources/templates/tilePreview.html'
], function($, util, Promise, ko, encounterTypes, terrainTypes, npcTypes, previewTemplate){

  // edit a location: 
  //  description, 
  //  terrain,  
  //  encounterType: [none, npc, etc.] (contents of resources/encounters)

  var editor = {
    location: null,
    configure: function(options){
      util.mixin(this, options || {});
      return this;
    },
    initialize: function initialize(options){
      if(this.initialized) return this;
      this.initialized = true;
      
      util.mixin(this, options || {});

      console.log("editor initialize");
      this.location = ko.observable(this.location || {});

      // this.render(editTemplate);
    },
    render: function(html){
      console.log("mapEditor: rendering with el: ", this.el);
      var $el = $(this.el);
      $el.html( html );
    },
    applyBindings: function(){
      var selfNode = $(this.el)[0];
      ko.applyBindings(this.location(), selfNode);
      return this;
    },
    onDetailToolbarClick: function(binding, evt){
        console.log("region toolbar btn click: ", evt.target);
        var buttonNode = evt.currentTarget;
        var actionPromise = null;
        var action = buttonNode.getAttribute('data-action') || String.trim(buttonNode.innerText || buttonNode.textContent);
        $( buttonNode ).addClass('busy');

        if(action === 'save'){
          actionPromise = editor.location.save();
          actionPromise.then(function(){
            if(editor.refresh) {
              editor.refresh();
            }
          });
        } else if(action === 'reset' || action === 'cancel'){
          actionPromise = editor.refresh();
        }
        Promise.when(actionPromise, function(){
          $( buttonNode ).removeClass('busy');
        });
    },
    setLocation: function(coord){
      if(typeof coord == 'string') {
        require(['plugins/location!'+coord + '!refresh'], function(locationModel){
          editor.setLocation(locationModel);
        });
        return;
      } else {
        this.location(coord);
      }
    },
    refresh: function(coord){
      coord = coord || this.location.id;
      var promise = new Promise();
      promise.then(function(locationModel){
        editor.setLocation(locationModel);
      });
      require(['plugins/location!'+coord + '!refresh'], function(locationModel){
        console.log('reloaded location!'+coord, locationModel.get('description'));
        promise.resolve(locationModel);
      });
      return promise;
    }
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

    return editor;
});
