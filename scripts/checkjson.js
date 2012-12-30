// fixtiles.js

var fs = require('fs');
var path = require('path');

var infile = path.join(__dirname, '..', 'data', 'location', 'world', 'index.json');

console.log("Visiting file: ", infile);
fs.readFile(infile, function(err, buf){
	if(err) {
		throw "Error reading in file: " + name + ":" + err.message;
	}
	var str = buf.toString();
	if(! (/\S+/).test(str)) {
		console.log("Empty string from file: " + name);
	}
	var data;
	try {
		data = JSON.parse(str);
	} catch(e) {
		console.log("Error parsing json: ", buf.toString());
		throw e.message;
	}
	if(('x' in data) && ('y' in data))
		console.log("Is tile data");
	else {
		console.log("Not tile data", data);
	}

});
