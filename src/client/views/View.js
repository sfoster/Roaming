define([
  'compose', 'lib/util', 'resources/template'
], function(Compose, util, createTemplate) {

  var DEBUG = false;
  var debug = {
    log: DEBUG ? console.log.bind(console, 'View') : function() {}
  };
  function assert(thing, message) {
    if (!thing) throw message || "assertion failure";
  }

  var ArraySlice = function () {
    Array.prototype.slice
  function ElementView(config) {
    /* represent stuff
     * and receive input
     * attach - to document/element. implies render
     * detach - keep state but unrender
     */
    debug.log('new ' + this.declaredClass, config);
    console.assert(this.constructor.events instanceof Array);
    console.assert(this.constructor.attachedEvents instanceof Array);

    this.events = this.constructor.events.slice(0);
    this.attachedEvents = this.constructor.attachedEvents.slice(0);
    this.context = {};
    this.subviews = [];
    this.id = this.declaredClass + '_' + (this.constructor._nextId++);

    for(var key in (config || {})) {
      this[key] = config[key];
    }
    this._attachedSubscriptions = [];
  }
  ElementView.prototype.declaredClass = 'ElementView';

  ElementView.prototype.registerSubView = function(view) {
    this.subviews.push(view);
    view.parent = this;
  };
  ElementView.prototype.unregisterSubView = function(view) {
    var idx = this.subviews.indexOf(view);
    if (idx > -1) {
      delete view.parent;
      this.subviews.splice(idx, 1);
    }
  };

  ElementView._nextId = 0;
  ElementView.events = [];
  ElementView.attachedEvents = [];

  ElementView.prototype.attach = function(element, isTop) {
    if ('string' === typeof element) {
      element = document.getElementById(element);
    }
    if (!element) {
      element = document.querySelector('[data-viewid="' + this.id + '"]');
    }
    debug.log('attach to element: ', element);
    this.element = element;
    element.dataset.viewid = this.id;

    // process any bindings on the element
    if (isTop && element.hasAttribute('data-bind')) {
      this._applyElementBindings(element);
    }
    if (this.template) {
      var content = this._render();
      element.appendChild(content);
    } else {
      // use the markup given
      Array.forEach(element.querySelectorAll('*[data-bind]'),
                    this._applyElementBindings.bind(this));
    }
    this._fetchElements();
    this._registerEvents();
    this._attached = true;
  };

  ElementView.prototype._getTemplate = function(template) {
    if(typeof template === 'string') {
      if ('#' == template.charAt(0)) {
        return document.querySelector(template).text;
      }
      return template;
    } else {
      return template.text || template.templateText;
    }
  };
  ElementView.prototype._render = function() {
    var template = this._getTemplate(this.template);
    var templateString = (typeof template == 'string') ?
                          template : template.text || template.templateText;

    var frag = this._fragment;
    if (!frag) {
      frag = this._fragment = document.createDocumentFragment();
      // out-of-document node we'll build the output on
      frag.appendChild(document.createElement('div'));
    }
    var element = frag.firstChild;
    if (templateString.contains('data-bind')) {
      element.innerHTML = templateString;
      Array.forEach(element.querySelectorAll('*[data-bind]'),
                    this._applyElementBindings.bind(this));
    } else {
      element.innerHTML = createTemplate(templateString)(this.context);
    }
    return frag.firstElementChild;
  };

  function nameValue(str, delim) {
    delim = delim || ':';
    var idx = str.indexOf(delim);
    if (idx > -1) {
      return [
        str.substring(0, idx).trim(),
        str.substring(idx + delim.length).trim()
      ];
    } else {
      return [str];
    }
  }

  ElementView.prototype._applyElementBindings = function(elem) {
    var context = this.context;
    var isModel = (typeof context.get == 'function');

    var getValue = function(key, fallback) {
      if(!(key in this)) {
        if (key.indexOf('$root') === 0) {
          return util.getObject(key.substring('$root'.length));
        }
        console.warn('getValue: ' + key + ' no in context');
        return fallback;
      }
      return isModel ? this.get(key) : this[key];
    }.bind(context);

    var bindings = elem.getAttribute('data-bind').split(/;\s*/);
    var pair, type, key;
    var setRe = /(\w+:\s*[a-z0-9_.\-]+),?/g;
    var submatches, valuestr;
    for(var i=0; i<bindings.length; i++) {
      pair = nameValue(bindings[i]);
      debug.log('bindings pair: ', pair);
      type = pair[0];
      key = pair[1];
      switch (type) {
        case 'text':
          elem.textContent = getValue(key);
          this._bindTextContentToModelProperty(key, elem);
          break;
        case 'attr':
          valuestr = key;
          while ((submatches = setRe.exec(valuestr))) {
            pair = nameValue(submatches[1]);
            name = pair[0]; key = pair[1];
            elem.setAttribute(name, getValue(key));
            this._bindAttributeToModelProperty(name, key, elem);
          }
          break;
        case 'model':
        case 'context':
          if (elem === this.element) {
            this.context = util.getObject(key);
            debug.log('assigned view context: ', this.context);
          } else {
            // spin off a sub-view
            var subview = new ElementView({
              context: util.getObject(key) || {}
            });
            debug.log('created subview: ', subview);
            this.registerSubView(subview);
            subview.attach(elem);
          }
          break;
        case 'template':
          // spin off a sub-view
          var subview = new ElementView({
            // TODO: need to look-ahead to see if the bindings array
            // includes a context for this subview
            context: this.context || {},
            template: key
          });
          debug.log('created subview: ', subview,
                    'with template: ', subview.template);
          this.registerSubView(subview);
          subview.attach(elem);
          break;
        case 'foreach':
          // spin off a sub-view
          var subview = new ListView({
            // TODO: need to look-ahead to see if the bindings array
            // includes a context for this subview
            context: getValue(key) || [],
            template: elem.innerHTML.trim()
          });
          debug.log('created subview: ', subview);
          this.registerSubView(subview);
          subview.attach(elem);
          break;
      }
    }
  };
  ElementView.prototype.detach = function() {
    var subview;
    while ((subview = this.subviews.shift())) {
      subview.detach();
    }

    var subscription;
    while((subscription = this._attachedSubscriptions.shift())) {
      subscription.remove();
    }
    if (this.element) {
      delete this.element.dataset.viewid;
    }
    this._unregisterAttachedEvents();
    this._attached = false;
  };

  ElementView.prototype._handleModelPropertyChange = function() {

  };

  ElementView.prototype._bindAttributeToModelProperty = function(name, prop, elm) {
    var model = this.context;
    var subscription = model.on(prop + ':change', function(evt) {
      elm.setAttribute(name, evt.value);
    });
    this._attachedSubscriptions.push(subscription);
  };
  ElementView.prototype._bindTextContentToModelProperty = function(prop, elm) {
    var model = this.context;
    var subscription = model.on(prop + ':change', function(evt) {
      elm.textContent = evt.value;
    });
    this._attachedSubscriptions.push(subscription);
  };

  ElementView.prototype._registerEvents = function() {
    var target = window;
    this.events.forEach(function(eventName) {
      target.addEventListener(eventName, this);
    }, this);
  };
  ElementView.prototype._registerAttachedEvents = function() {
    var target = this.element;
    this.attachedEvents.forEach(function(eventName) {
      target.addEventListener(eventName, this);
    }, this);
  };
  ElementView.prototype._unregisterEvents = function() {
    var target = window;
    this.events.forEach(function(eventName) {
      target.removeEventListener(eventName, this);
    }, this);
  };
  ElementView.prototype._unregisterAttachedEvents = function() {
    var target = this.element;
    this.attachedEvents.forEach(function(eventName) {
      target.removeEventListener(eventName, this);
    }, this);
  };
  ElementView.prototype._fetchElements = function() {
    if (!this.element) {
      this.element = document.getElementById(this.id);
    }
  };

  ElementView.prototype.destroy = function(goQuietly) {
    if (this._attached) {
      this.detach();
    }
    this._unregisterEvents();
    var subview;
    while ((subview = this.subviews.shift())) {
      subview.destroy(true);
    }
    if (this.parent && !goQuietly) {
      this.parent.unregisterSubView(this);
    }
  };

  var ListView = Compose(ElementView, {
    declaredClass: 'ListView',
    _render: function(elem) {
      debug.log('ListView _render');
      var template = this._getTemplate(this.template);
      var templateString = (typeof template == 'string') ?
                            template : template.text || template.templateText;

      var frag = this._fragment;
      if (!frag) {
        frag = this._fragment = document.createDocumentFragment();
      }
      var container = (frag.firstChild ||
                       frag.appendChild(document.createElement('div')));
      // make template node
      // TODO: support template() too?
      container.innerHTML = templateString.trim();
      var itemNodeTemplate = container.removeChild(container.firstElementChild);
      // empty out the fragment, we'll accumulate the output there
      while (frag.hasChildNodes()) {
        frag.removeChild(frag.firstChild);
      }
      var listContext = this.context;
      listContext.forEach(function(itemContext) {
        var element = itemNodeTemplate.cloneNode();
        frag.appendChild(element);
        // replace with item context temporarily
        this.context = itemContext;

        if (templateString.contains('data-bind')) {
          // apply bindings on the item node itself
          this._applyElementBindings(element);
          Array.forEach(element.querySelectorAll('*[data-bind]'),
                        this._applyElementBindings.bind(this));
        }
      }, this);
      this.context = listContext;
      return frag;
    }
  });
  ListView._nextId = 0;
  ListView.events = [];
  ListView.attachedEvents = [];

  return {
    ElementView: ElementView,
    ListView: ListView
  };

});
