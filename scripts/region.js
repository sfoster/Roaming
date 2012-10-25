var createTile = require('./createtile').createTile;
var argv = require('optimist').argv;
var fs = require('fs');
var path = require('path');
var commandOptions = {
  stubs: 'regionname'
}

function createStubs(region) {
  var dir = path.join(__dirname, '..', 'data', 'location', region);
  var tile = require('./createtile');
      tile.setDirectory(dir);
      
  var indexFile = path.join(dir, 'index.json');
  if(fs.existsSync(indexFile)) {
    fs.readFile(indexFile, function(err, contents){
      if(err) throw err;
      var tiles = JSON.parse(contents).tiles;
      tiles.forEach(function(stub){
        delete stub['$ref'];
        console.log("create tile: ", stub);
        tile.createTile(stub);
      });
      // console.log("tiles: ", tiles);
    });
  } else {
    console.log("No region index file at: ", indexFile);
  }
  
  // var dir = path.join(_)
}
if(require.main === module){
	if(("help" in argv) || (!argv.stubs)){
		var helpStr = "Usage: node region.js [options]\n\n";
			helpStr += "Options:\n";
		Object.keys(commandOptions).forEach(function(name){
			helpStr += "  --"+name+ " "+ commandOptions[name] + "\n";
		});
		console.log(helpStr);
	}else {
		// exports.createTile(tileData);
		console.log("create stubs for region: ", argv.stubs);
		createStubs(argv.stubs);
	}
}

