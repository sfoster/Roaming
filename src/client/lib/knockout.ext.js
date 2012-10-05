define([
  'lib/util',
  'knockout',
  'store/lib/knockout.composeWith'
], function(util, ko) {
  var mixin = util.mixin;
  
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