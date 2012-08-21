define([
  'lib/dollar',
  'lib/event', 
  'lib/promise', 
  'vendor/path',
  'knockout',
  'vendor/knockout.mapping',
  'lib/RegionStore',
  'mapEditor',
  'tileEditor'
], function(
  $, 
  Evented,
  Promise,
  Path,
  ko, 
  koMapping, 
  RegionStore,
  mapEditor, 
  tileEditor
){
  
  var coord = location.search ? location.search.replace(/^\?(\d+,\d+)/, "$1") : '3,3';
  window.tileEditor = tileEditor; 
  window.regionEditor = mapEditor; 
  window.knockout = ko;
  
  // data-bind="css-target: {  }"
  ko.bindingHandlers['css-matches-name'] = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
      // This will be called when the binding is first applied to an element
      // Set up any initial state, event handlers, etc. here
    },
    update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
      // variation on css binding which gets its boolean value for each given className
      // from a match against the data-name attribute
      var name = element.getAttribute('data-name');
      var value = ko.utils.unwrapObservable(valueAccessor() || {});
      for (var className in value) {
        if (typeof className == "string") {
          var shouldHaveClass = (name === ko.utils.unwrapObservable(value[className]));
          ko.utils.toggleDomNodeCssClass(element, className, shouldHaveClass);
        }
      }
    }
  };
  
  var app = {
    el: document.body,
    editorMode: 'mapEdit',
    
    initialize: function(){
      var self = this;
      console.log("setup editorMode");
      this.editorMode = ko.observable('');
      this.editorMode.subscribe(function(newValue) {
        // global broadcast: 
        Evented.emit('editor:change', {
          target: newValue
        });
      });
      
      this.regionEditor = mapEditor;
      this.locationEditor = tileEditor;

      // RegionStore
      this.region = ko.observable(null);
      this.region.subscribe(function(newValue) {
        // global broadcast: 
        Evented.emit('region:change', {
          target: newValue
        });
      });
      console.log("editor.region defined: ", this.region());
      
      Evented.on('editor:change', function(evt){
        var editor; 
        switch(evt.target) {
          case "mapEdit": 
            editor = mapEditor; break;
          case "locationEdit": 
            editor = tileEditor; break;
        }
        console.log("editor:change", evt.target, editor, "in: " + '#'+evt.target);
        if(editor) {
          // pass the editor the region store when initializing
          console.log("editor:change, initializing " + evt.target + ": with region:", self.region());
          editor.initialize({ el: '#'+evt.target, region: self.region });
        }
      });
      
      return this;
    },
    routeBindings: function(){
      var self = this;

      // default
      Path.map("#/world").to(function(){
        console.log("Handling #/world (default) path");
        var id = 'world';
        self.region( new RegionStore({
          target: '/location/world.json'
        }) );
        console.log("assign editorMode");
        self.editorMode('mapEdit');
      });
      // region route
      Path.map("#/world/:region_id").to(function(){
        console.log("Handling #/world/:region_id path");
        var id = this.params.region_id;
        self.region( new RegionStore({
          target: '/location/'+id+'.json'
        }) );
        console.log("assign editorMode");
        self.editorMode('mapEdit');
      });
      
      Path.root('#/world');
      Path.listen();
      return this;
    },
    
    // setStore: function(store){
    //   var self = this;
    //   store = this.store = store;
    // 
    //   // set up the live resultsets: 
    //   var locations = this._locations = ko.observableArray([]);
    //   
    //   // the locations array is a computed value, delegating to an observable array
    //   this.locations = ko.computed(function(){
    //     console.log("computing the locations property");
    //     return self.fetchLocations(locations);
    //   });
    // 
    //   return this;
    // },
    
    // fetchLocations: function(rows){
    //   var self = this;
    //   var proto = { };
    //   function item(data){
    //     // util.defaults(data, proto);
    //     var viewModel = ko.mapping.fromJS(data);
    //     return viewModel;
    //   }
    // 
    //   // we return the observable array, but call splice on it with the results when the come back
    //   // as its observable, it should result in updates to all listeners
    //   Promise.when(this.store.query({ type: 'todo' }), function(results){
    //     console.log("query callback, got results: ", results);
    //     var len = ('function' == typeof rows) ? rows().length : rows.length;
    //     rows.splice.apply(rows, [0, len].concat(results.map(item)) );
    //   });
    // 
    //   return rows; 
    // },
    // 
    applyBindings: function(){
      var selfNode = $(this.el)[0];
      ko.applyBindings(this, selfNode);
      return this;
    },

    onTabTrayClick: function(vm, evt){
      // event-delegation for tab-label clicks
      var targ = $(evt.target).closest('.tab-label').attr('data-name'); 
      this.editorMode(targ);
    }
  };

  // TODO: wrap location GET/PUTs in JsonRest store
  // var worldStore = new Store({
  // });
  var settings = {};
  app
    .initialize({
    })
    .routeBindings()
    .applyBindings();

  mapEditor.on('tile:edit', function(evt){
    var tile = evt.target;
    Promise.when(tile, function(){
      console.log("loadTile result: ", tile);
      app.locationEditor.location(tile);
      app.editorMode('locationEdit');
    }, function(err){ console.warn("Failed to load tile:", err); });
  });
});