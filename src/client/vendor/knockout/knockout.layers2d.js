define(['./knockout'], function(ko){
  function getValue(value) {
    if(ko.isObservable(value)){
      value = ko.utils.unwrapObservable(value); 
    }
    return value;
  }
  ko.bindingHandlers['layers2d'] = {
      'update': function (element, valueAccessor) {
        var layers = getValue(valueAccessor()); 
        // TODO: optimize - we don't want to call getContext every time, 
        var ctx = element.getContext('2d');
        console.log("layers2d update, layers: ", layers);
        layers.forEach(function(layer){
          var instructions = getValue(layer); 
          console.log("layers2d instructions: ", instructions);
          instructions.forEach(function(instruct){
            if(instruct.assign) {
              ctx[instruct.assign] = instruct.value;
            } else if(instruct.call) {
              // TODO: maybe require the value to always be an array to optimize a little here
              ctx[instruct.call].apply(ctx, instruct.value instanceof Array ? instruct.value : [instruct.value]);
            }
          });
        });
      }
  };
});