// fixtiles.js

var fs = require('fs');
var path = require('path');

var indir = path.join(__dirname, '..', 'data', 'location', 'world');
var filesToProcess = [];
var pool = "12345678".split('').map(function(num){
	var job = function(name){
		handleFile(name, function(){
			pool.push(job);
			nextInPool();
		});
	};
	return job;
});
var nextInPool = function(){
	if(!filesToProcess.length)
		return;
	if(pool.length) {
		pool.shift()(filesToProcess.shift());
	} else {
		setTimeout(nextInPool, 25);
	}
}

fs.readdir( indir, function(err, names){
	filesToProcess = names.map(function(name) { 
		return path.join(indir, name); 
	})
	.filter(function(name) { 
		return (
			name.indexOf('index.json') === -1 && 
			(/\.json$/).test(name)
		);
	});
	// start the workers
	nextInPool();
});

function onEmptyFile(name) {
	var m = (/(\d+),(\d+)\.json$/).exec(name);
	if(!m) {
		console.log("Skipping populating empty file: ", name);
		return;
	}
	var x = m[1], y = m[2];
	fs.writeFile(name, JSON.stringify({
		"x": x, 
		"y": y,
	    "type": "abyss",
	    "description": ""
	}, null, 2), function(err){
		if(err) console.log("Failed to populate empty file: ", name, err);
	});

	console.log("Populating empty file: ", x, y);
}
function handleFile(name, callback) {
	console.log("Visiting file: ", name);
	fs.readFile(name, function(err, buf){
		console.log("Visiting file: ", name);
		if(err) {
			console.log("Error reading in file: " + name , err);
			callback();
			return;
		}
		var str = buf.toString();
		if(! str.match(/\S+/)) {
			console.log("Empty string from file: " + name, str);
			onEmptyFile(name);
			callback();
			return;
		}
		var data, 
			dirty = false;
		try {
			data = JSON.parse(str);
		} catch(e) {
			console.log("Couldn't parse json: ", str);
			throw e.message;
		}
		if(('x' in data) && ('y' in data)) {
			if(!('id' in data)){
				data.id = data.x + ',' + data.y;
				dirty = true;
			}
			if(data.coords) {
				delete data.coords;
				dirty = true;
			}
		}
		if(data.type) {
			data.terrain = data.type;
			delete data.type;
			dirty = true;
		}
		if(data.terrainType) {
			data.terrain = data.terrainType;
			delete data.terrainType;
			dirty = true;
		}
		if(data.coords) {
			// needs fixing
			var coords = data.coords || data.id.split(',');
			data.x = coords[0];
			data.y = coords[1];
			delete data.coords;
			dirty = true;
		}
		if(!dirty){
			callback();
			return;

		}
		
		fs.writeFile(name, JSON.stringify(data, null, 2), function(err){
			if(err) throw "Error writing back file: " + err;
			callback();
		});
	});

}
		