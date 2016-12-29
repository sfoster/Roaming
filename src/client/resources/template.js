define(function(util){
  // simple compiled templates
  // examples:
  // var tmpl = template('To: {{name}}'),
  //    str = tmpl({ name: 'Mally O'Mally <3\'s Mollie <mally@omally.com>' });
  //    str == "To: Mally O&#x27;Mally &lt;3&#x27;s Mollie &lt;mally@omally.com&gt;"

  // var tmpl = template('/{%base%}/{% author %}'),
  //    str = tmpl({ base: 'library', author:'François d'Amboise (1550–1619)' });
  //    str == "/library/Fran%C3%A7ois%20d'Amboise%20(1550%E2%80%931619)"

  var tokenRe = /\{([\{%]?)([^%\}]+)([%\}]?)\}/g,
      trimRe = /^\s*([\S\s]*?)\s*$/,
      ampersandRe = /&/g,
      ltRe = /</g,
      gtRe = />/g,
      doubleQuoteRe = /"/g,
      singleQuoteRe = /'/g,
      forwardSlashRe = /\//g;

  function entityEscape(string) {
    // TODO: this is a pretty stupid - and slow - way to do single-character replacement in a string: fix it if it becomes an issue.
    return (''+string)
      .replace(ampersandRe, '&amp;')
      .replace(ltRe, '&lt;')
      .replace(gtRe, '&gt;')
      .replace(doubleQuoteRe, '&quot;')
      .replace(singleQuoteRe, '&#x27;')
      .replace(forwardSlashRe,'&#x2F;');
  }

  function template(tmpl) {
    var fillTemplate = function(obj) {
      return tmpl.replace(tokenRe, function(m, filter, name){
        name = name.replace(trimRe, '$1');
        if(!(name in obj)){
          // TODO: here would be a good place to instrument for error logging
          console.warn("Missing template property '"+ name + "' in data: ", obj); // , " from template: ", tmpl);
        }
        switch(filter){
          case '{':
            // escape entities in the value
            return entityEscape(obj[name]);
          case '%':
            // {% %} unlike underscore, the '%' filter means URI encode
            // Note that encodeURIComponent is *not* the right thing to do for querystrings.
            // ... We may need to support {+ +} or something
            return encodeURIComponent(obj[name]);
          default:
            // e.g. template('amount: {sum}')({ sum: 12 }); as-is value insertion
            return obj[name];
        }
      });
    };
    fillTemplate.templateText = tmpl;
    return fillTemplate;
  }

  template.entityEscape = entityEscape;
  return template;
});