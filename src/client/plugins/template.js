// property.js
define([], function(){

  function importTemplate(id, tmplString){
    // add text/html type script node for each template
    var tmplNode = document.createElement('script');
    tmplNode.setAttribute('type', 'text/html');
    tmplNode.id = id;
    tmplNode.appendChild(document.createTextNode( tmplString ));
    return document.body.appendChild( tmplNode );
  }

  // usage: require(['plugins/template!some/resource'], function(someProperty){ ... })
  var templatePlugin = {
    load: function (resourceId, req, onLoad, requireConfig) {
    	var id, bangIdx = resourceId.indexOf('!');
    	if(bangIdx > 0) {
    		id = resourceId.substring(bangIdx+1);
    		resourceId = resourceId.substring(0, bangIdx);
    	} else {
    		// make a template id from the resource path
    		id = unescape(resourceId).replace(/[\W\-]+/g, '_')
    	}
	  	var node = document.getElementById(id);
	  	if(node) {
	  		onLoad(node);
	  	} else {
	      require(["plugins/vendor/text!"+resourceId], function(res){
	      	var tmplNode = importTemplate(id, res);
	      	onLoad(tmplNode);
	      });
	  	}
    }
  };
  return templatePlugin;
});
