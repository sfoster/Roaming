define(['resources/template'], function(createTemplate) {

  function View(config) {
    /* represent stuff
     * and receive input
     * attach - to document/element. implies render
     * detach - keep state but unrender
     */
    this.events = Array.slice(this.constructor.events, 0);
    this.attachedEvents = Array.slice(this.constructor.attachedEvents, 0);
    this.context = {};
    this.id = 'view_' + (View._nextId++);

    for(var key in (config || {})) {
      this[key] = config[key];
    }
    this._attachedSubscriptions = [];
  }
  View._nextId = 0;
  View.events = [];
  View.attachedEvents = [];

  View.prototype.attach = function(container) {
    if ('string' === typeof container) {
      container = document.getElementById(container);
    }
    if (!container) {
      container = document.querySelector('[data-viewid="' + this.id + '"]');
    }
    this.container = container;
    container.dataset.viewid = this.id;

    var frag = this._renderToFragment();
    container.appendChild(frag.firstChild);
    this._fetchElements();
    this._registerEvents();
  };

  View.prototype._renderToFragment = function() {
    var template = this.template;
    var templateString = (typeof template == 'string') ?
                          template : template.text || template.templateText;
    var frag = this._fragment;
    if (!frag) {
      frag = document.createDocumentFragment();
      frag.appendChild(document.createElement('div'));
    }
    var container = frag.firstChild;
    if (templateString.contains('data-bind')) {
      container.innerHTML = templateString;
      this._applyTemplateBindings(container);
    } else {
      container.innerHTML = createTemplate(templateString)(this.context);
    }
    return frag;
  };

  View.prototype._applyTemplateBindings = function(container) {
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
    var context = this.context;
    var isModel = (typeof context.on == 'function');

    Array.forEach(
      container.querySelectorAll('*[data-bind]'),
      function(elm) {
        var bindings = elm.getAttribute('data-bind').split(/;\s*/);
        var pair, type, key;
        var setRe = /(\w+:\s*[a-z0-9_.\-]+),?/g;
        var submatches, valuestr;
        for(var i=0; i<bindings.length; i++) {
          pair = nameValue(bindings[i]);
          type = pair[0];
          key = pair[1];
          switch (type) {
            case 'text':
              elm.textContent = isModel ? context.get(key) :
                                          context[key];
              this._bindTextContentToModelProperty(key, elm);
              break;
          case 'attr':
            valuestr = key;
            while ((submatches = setRe.exec(valuestr))) {
              pair = nameValue(submatches[1]);
              name = pair[0]; key = pair[1];
              elm.setAttribute(name, isModel ? context.get(key) :
                                               context[key]);
              this._bindAttributeToModelProperty(name, key, elm);
            }
            break;
          }
        }
    }, this);
  };
  View.prototype.detach = function() {
    var subscription;
    while((subscription = this._attachedSubscriptions.shift())) {
      subscription.remove();
    }
    if (this.container) {
      delete this.container.dataset.viewid;
    }
    this._unregisterAttachedEvents();
  };

  View.prototype._handleModelPropertyChange = function() {

  };

  View.prototype._bindAttributeToModelProperty = function(name, prop, elm) {
    var model = this.context;
    var subscription = model.on(prop + ':change', function(evt) {
      elm.setAttribute(name, evt.value);
    });
    this._attachedSubscriptions.push(subscription);
  };
  View.prototype._bindTextContentToModelProperty = function(prop, elm) {
    var model = this.context;
    var subscription = model.on(prop + ':change', function(evt) {
      elm.textContent = evt.value;
    });
    this._attachedSubscriptions.push(subscription);
  };

  View.prototype._registerEvents = function() {
    var target = window;
    this.events.forEach(function(eventName) {
      target.addEventListener(eventName, this);
    }, this);
  };
  View.prototype._registerAttachedEvents = function() {
    var target = this.element;
    this.attachedEvents.forEach(function(eventName) {
      target.addEventListener(eventName, this);
    }, this);
  };
  View.prototype._unregisterEvents = function() {
    var target = window;
    this.events.forEach(function(eventName) {
      target.removeEventListener(eventName, this);
    }, this);
  };
  View.prototype._unregisterAttachedEvents = function() {
    var target = this.element;
    this.attachedEvents.forEach(function(eventName) {
      target.removeEventListener(eventName, this);
    }, this);
  };
  View.prototype._fetchElements = function() {
    if (!this.element) {
      this.element = document.getElementById(this.id);
    }
  };

  return View;
})