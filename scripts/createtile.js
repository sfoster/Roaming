// tile.js
// create new tile
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var dir = process.cwd();
var argv = require('optimist').argv;

// delegation the way I like it
var delegate = function(proto, props){
	var o = Object.create(proto);
	if(props){
	  mixin(o, props);
	}
	return o;
};

function mixin(o, props){
	for(var i in props) 
	  o[i] = props[i];
	return o;
}

function mixinLeftPrecedent(o, props){
	for(var i in props) {
	  if(!(i in o)) {
	    o[i] = props[i];
	  }
	}
	return o;
}

function defaults(target) {
  var mixins = Array.prototype.slice.call(arguments, 1);
  mixins.forEach(function(props){
    mixinLeftPrecedent(target, props);
  });
  return target;
}
var tileDefaults = {
  "description": "--No description yet--",
  "afar": "--No afar description yet--",
  "x": 3,
  "y": 2,
  "here": [],
  "id": "",
  "type": "abyss"
};

function update(obj, from) {
  for(var i in obj) {
    if(i in from) {
      obj[i] = from[i];
    }
  }
  return obj;
}
var tileData = update( Object.create(tileDefaults), argv );

exports.setDirectory = function(toPath) {
  dir = toPath;
};

exports.createTile = function createTile(params, callback) {
  
  // modify region (e.g. to create new resource)
  // handle data as static files for now
  var coords, x, y;
  if(params.id) {
    var coords = params.id.split(',');
    x = coords[0]; 
    y = coords[1]; 
  } else if(('x' in params) && ('y' in params)) {
    params.id = params.x + ',' + params.y;
  }
  var id = params.id;
  assert(id);
  
  var resourcePath = dir + '/' + id + '.json';

  var fileData;
  var updateFile = function(data) {
    var fileData = mixin(data || {}, params);
    fs.writeFile(resourcePath, JSON.stringify(fileData, null, 2), function(err){
      if(err) {
        console.log("Error writing to " + resourcePath, err);
        if(callback) callback(err);
      } else {
        console.log(resourcePath + " created/updated");
        if(callback) callback(null, fileData);
      }
    });
    
  }
  if(fs.existsSync(resourcePath)) {
    try {
      fs.readFile(resourcePath, function(err, contents){
        if(err) {
          console.log("readfile error: ", err);
          throw "read fail for " + resourcePath;
        }
        var fileData = JSON.parse(contents);
        updateFile(fileData);
      })
    } catch(e) {
      console.log("Bad data in " + resourcePath);
      fileData = {};      
    }
  } else {
    updateFile(fileData);
  }
};

if(require.main === module){
	if(("help" in argv) || (!(argv.id || argv.x || argv.y))){
		var helpStr = "Usage: node createtile.js [options]\n\n";
			helpStr += "Options:\n";
		Object.keys(tileDefaults).forEach(function(name){
			helpStr += "  --"+name+ " "+ tileDefaults[name] + "\n";
		});
		console.log(helpStr);
	}else {
		exports.createTile(tileData);
	}
}

