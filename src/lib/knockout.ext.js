define([
  'lib/util',
  'knockout'
], function(util, ko) {
  var mixin = util.mixin;
  
  ko.bindingHandlers['strtemplate'] = {
    'init': function(element, valueAccessor) {
        // Support anonymous templates
        var bindingValue = ko.utils.unwrapObservable(valueAccessor());
        console.log("strtemplate: ", bindingValue);
        if ((typeof bindingValue != "string") && (!bindingValue['name'])) {
            // It's an anonymous template - store the element contents, then clear the element
            var templateNodes = element.nodeType == 1 ? element.childNodes : ko.virtualElements.childNodes(element),
                container = ko.utils.moveCleanedNodesToContainerElement(templateNodes); // This also removes the nodes from their current parent
            new ko.templateSources.anonymousTemplate(element)['nodes'](container);
        }
        return { 'controlsDescendantBindings': true };
    },
    'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
      return ko.bindingHandlers['template'].update.apply(ko.bindingHandlers, arguments);
    }
  };
  
  // Anonymous templates can't be rewritten. Give a nice error message if you try to do it.
  ko.jsonExpressionRewriting.bindingRewriteValidators['strtemplate'] = function(bindingValue) {
      return ko.jsonExpressionRewriting.bindingRewriteValidators['template'](bindingValue);
  };

  ko.virtualElements.allowedBindings['strtemplate'] = true;
  
  ko.bindingHandlers['forin'] = {
      makeTemplateValueAccessor: function(valueAccessor) {
          return function() {
              var dictBindingValue = ko.utils.unwrapObservable(valueAccessor());

              // If falsy bindingValue, just pass it on its own
              if (!dictBindingValue){
                return { 'foreach': [], 'templateEngine': ko.nativeTemplateEngine.instance };
              }

              // turn it into an array of objects, using 'name' property to hold the object key value
              var bindingValue = Object.keys(dictBindingValue).map(function(key){
                // TODO: get the property name to use for the key from the binding?
                return mixin({ name: key }, dictBindingValue[key]);
              });

              return {
                  'foreach': bindingValue,
                  'includeDestroyed': dictBindingValue['includeDestroyed'],
                  'afterAdd': dictBindingValue['afterAdd'],
                  'beforeRemove': dictBindingValue['beforeRemove'],
                  'afterRender': dictBindingValue['afterRender'],
                  'templateEngine': ko.nativeTemplateEngine.instance
              };
          };
      },
      'init': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
          return ko.bindingHandlers['template']['init'](element, ko.bindingHandlers['forin'].makeTemplateValueAccessor(valueAccessor));
      },
      'update': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
          return ko.bindingHandlers['template']['update'](element, ko.bindingHandlers['forin'].makeTemplateValueAccessor(valueAccessor), allBindingsAccessor, viewModel, bindingContext);
      }
  };
  ko.jsonExpressionRewriting.bindingRewriteValidators['forin'] = false; // Can't rewrite control flow bindings
  // ko.virtualElements.allowedBindings['foreach'] = true;
  
  return ko;
});