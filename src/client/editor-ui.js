define([
  'dollar',
  'lib/event', 
  'promise', 
  'vendor/path',
  'knockout',
  'vendor/knockout.mapping',
  'lib/knockout.ext',
  'lib/RegionStore',
  'mapEditor',
  'tileEditor',
  // preload templates
  'plugins/vendor/text!resources/templates/regionEditor.html',
  'plugins/vendor/text!resources/templates/regionEditor.html'
], function(
  $, 
  Evented,
  Promise,
  Path,
  ko, 
  koMapping, 
  koExt, 
  RegionStore,
  mapEditor, 
  tileEditor,
  regionEditorTemplate, 
  tileEditorTemplate
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
      
      var editorOptions = {};

      // RegionStore
      this.region = editorOptions.region = ko.observable(null);
      this.region.subscribe(function(newValue) {
        // global broadcast: 
        Evented.emit('region:change', {
          target: newValue
        });
      });
      this.location = editorOptions.location = ko.observable(null);
      this.location.subscribe(function(newValue) {
        // global broadcast: 
        Evented.emit('location:change', {
          target: newValue
        });
      });
      
      this.regionEditor.configure(editorOptions);
      this.locationEditor.configure(editorOptions);
      
      Evented.on('editor:change', function(evt){
        var editor, region, location;
        switch(evt.target) {
          case "mapEdit": 
            editor = mapEditor; break;
          case "locationEdit": 
            editor = tileEditor; 
            location = evt.location;
            break;
        }
        console.log("editor:change", evt.target, editor, "in: " + '#'+evt.target);
        if(editor) {
          // pass the editor the region store when initializing
          console.log("editor:change, initializing " + evt.target + ": with region:", self.region());
          editor.initialize({ 
            el: '#'+evt.target, 
            region: self.region, 
            location: self.location,
            go: function(path /*, path2, path3 */){
              // join up part parts. Easier to do it here and normalize slashes etc
              // than have the same logic spread across the app
              path = Array.prototype.map.call(arguments, function(token){
                return token.replace(/^[#\/]+/, '').replace(/\/$/, '');
              }).join('/');
              console.log("go:", path);
              path = path.replace(/^[#\/]+/, '');
              window.location.hash = "#/"+path;
            }
          });
        }
      });
      
      return this;
    },
    routeBindings: function(){
      var self = this;

      function worldRoute() {
        console.log("Handling #/location/:region_id path");
        var id = this.params.region_id || 'world';
        self.region( new RegionStore({
          target: '/location/'+id +'/'
        }) );
        console.log("assign editorMode");
        self.editorMode('mapEdit');
      }

      function locationRoute() {
        console.log("Handling #/location/:region_id/:location_id path");
        var regionId = this.params.region_id || 'world';
        var locationId = this.params.location_id || '1,1';
        if(! self.region() ) {
          self.region( new RegionStore({
            target: '/location/'+regionId +'/'
          }) );
        }
        if(! self.location() ) {
          self.location(locationId);
        }
        console.log("assign editorMode");
        self.editorMode('locationEdit');
      }
      function notFound() {
        console.log("Path not matched, this: ", this);
      }
      Path.map("#/location").to(worldRoute);
      Path.map("#/location/:region_id").to(worldRoute);
      
      // fixed in https://github.com/sfoster/pathjs/commit/df681065915f02949408888994a375e7ff2958bb
      Path.map("#/location/:region_id/:location_id").to(locationRoute);
      
      Path.root('#/location/world');

      Path.rescue(notFound);

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
    loadTemplates: function(){
      var pending = 0;
      var defd = new Promise();
      $('[type="text/x-template"]').forEach(function(elm){
        // Also, could just insert the text from a resource loaded as a dependency here where knockout can find it
        var resource = 'plugins/vendor/text!'+elm.src;
        console.log("template resource: ", resource);
        pending++;
        require([resource], function(tmpl){
          elm.text = tmpl;
          pending--;
          if(!pending) {
            defd.resolve(true);
          }
        });
      });
      return defd;
    },
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
    .loadTemplates().then(function(){
      app.applyBindings();
    });

  mapEditor.on('tile:edit', function(evt){
    var tile = evt.target;
    Promise.when(tile, function(){
      console.log("loadTile result: ", tile);
      app.locationEditor.location(tile);
      app.editorMode('locationEdit');
    }, function(err){ console.warn("Failed to load tile:", err); });
  });
});