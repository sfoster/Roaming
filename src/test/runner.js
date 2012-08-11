var requirejs = require('requirejs');
var jsdom = require("jsdom");
var fs = require('fs');
var path = require('path');

var basedir = path.join(__dirname, '..');
var testdir = __dirname;
// change to base directory
process.chdir(basedir);

console.log("pwd: " + process.cwd());

var config = JSON.parse(fs.readFileSync("./test/config.json"));
// console.log("requirejs paths config: ",config.paths);
requirejs.config({
	nodeRequire: require,
	paths: config.paths,
  // paths: {
	//     'underscore': './vendor/underscore', 
	//     'backbone': './vendor/backbone', 
	//     '$': './lib/mock-dollar'
	//   }
  baseUrl: '.'
});

// var jsdom = require('jsdom');
// var doc =        jsdom.jsdom('<html><head></head><body></body></html>');
// var window =     global.window = doc.parentWindow;

function expose(thing, name){
  // console.log("exposing " + name);
  global[name] = thing;
  return thing;
}

// var navigator =  expose(global.window.navigator, 'navigator');
// var document =  expose(doc, 'document');

//make define available globally like it is in the browser
var define = expose(require('requirejs'), 'define');

//make jasmine available globally like it is in the browser
var describe =   expose( require('./lib/jasmine-1.1.0.rc1/jasmine').describe, 'describe');
var it =         expose( require('./lib/jasmine-1.1.0.rc1/jasmine').it, 'it');
var expect =     expose( require('./lib/jasmine-1.1.0.rc1/jasmine').expect, 'expect');
var beforeEach = expose( require('./lib/jasmine-1.1.0.rc1/jasmine').beforeEach, 'beforeEach');
var afterEach =  expose( require('./lib/jasmine-1.1.0.rc1/jasmine').afterEach, 'afterEach');


fs.readdir('test/spec', function(err, files){
  if(err) throw err;
  files = files
    .filter(function(name){ return (/Spec\.js$/).test(name); })
    .map(function(name){ return './test/spec/' + name; });

  // load all the spec files, 
  // they should register themselves as specs with jasmine, as a side-effect of their loading
  requirejs(files, function() {
    var jasmine = require('./lib/jasmine-1.1.0.rc1/jasmine').jasmine;
    var ConsoleJasmineReporter2 = require('./lib/consoleJasmineReporter2').ConsoleJasmineReporter;
    jasmine.getEnv().addReporter(new ConsoleJasmineReporter2());
    
    jasmine.getEnv().execute();
  });  

});
