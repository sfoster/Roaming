// AMD-packaging of https://github.com/oyvindkinsey/UrlRouter

/**
 * UrlRouter is a simple router that can be used to provide navigation
 * in Javascript applications.
 *
 * The router lets you define the patterns for url matching, and also allows you
 * to name the variable sections so that the handler can easily access these.
 * @param {Array} rules The rules for matching.
 */
define(function(){
  
  function UrlRouter(rules){
      if (!rules || rules.length === 0) {
          throw new Error("UrlRouter: Rules missing");
      }
      this._rules = rules;
      this._compiled = [];
  }

  UrlRouter.prototype = {

      /**
       * This iterates over the literal rules, and compiles these into RegExp's,
       * replacing the variable placeholdes with capture groups for quick matching.
       * The varible placeholders are stored in the same order as the capture groups
       * they represent, enabling the `match` method to easily map captured data to properties.
       */
      compile: function(){
          for (var i = 0, len = this._rules.length; i < len; i++) {
              var keys = [];
              // create a new RegExp with matching capture groups
              var re = new RegExp(this._rules[i][0].replace(/:[^\/,]+/g, function(key){
                  keys.push(key.substring(1));
                  return "([^\/]+)";
              }));
              this._compiled.push({
                  re: re, // the RegExp for fast matching
                  keys: keys, // the keys for mapping capture groups to property names
                  handler: this._rules[i][1] // the handler for the match
              });
          }
      },

      /**
       * This iterates over the stored rules, testing each in sequence until
       * they have all been tried or a successfull match occurs.
       * When a match is found, the corresponding handler is called with a single argument,
       * an object containing properties matching the variable placeholders in the matching rule.
       * @param {String} url The string that the matching should be run against
       * @return {Object || undefined} If successfull, returns the data object after executing the handler
       */
      match: function(url){
          for (var i = 0, len = this._compiled.length; i < len; i++) {
              var match = url.match(this._compiled[i].re);
              if (match) {
                  var data = {}, keys = this._compiled[i].keys, handler = this._compiled[i].handler;
                  // map capture groups to properties
                  for (var j = 0; j < keys.length; j++) {
                      data[keys[j]] = match[j + 1];
                  }
                  // call the handler, if present
                  if (handler) {
                      handler(data);
                  }
                  return data;
              }
          }
      }
  };
  
  return UrlRouter;
});

