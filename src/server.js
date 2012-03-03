var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express.createServer();
var root = __dirname;

app.configure(function(){
    app.use(express.logger({ format: ':method :url' }));
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
});

app.get('/', function(req, res, next){
  res.sendfile(root + '/client/index.html');
});

app.get('/location/world.json', function(req, res){
  var resourcePath = root + '/data/location/world.json';
  if(path.existsSync(resourcePath)){
    fs.readFile(resourcePath, function(err, contents){
      var data = JSON.parse(contents), 
          resp = { tiles: data, status: 'ok' };
      res.send( JSON.stringify(resp), { 'Content-Type': 'application/json' }, 200);
    });
  } else {
    console.log("sending empty tiles data for world.json");
    res.send({ tiles: [] });
  }
});
app.post('/location/world.json', function(req, res){
  var resourcePath = root + '/data/location/world.json';
  console.log("got post: ", typeof req.body, req.body);
  var fileData = req.body;
  
  fs.writeFile(resourcePath, JSON.stringify(fileData), function(err) {
    if(err) {
        console.log(err);
        res.send(500);
    } else {
        res.send({ status: 'ok' });
        console.log(resourcePath + " saved");
    }
  });
});

app.get(/^\/(resources|models|vendor|css)\/(.*)$/, function(req, res){
  var resourcePath;
  // console.log("matched: ", req.params[0], req.params[1]);
  switch(req.params[0]){
    case 'resources': 
      resourcePath = root + '/resources/' + req.params[1];
      break;
    case 'vendor': 
      resourcePath = root + '/vendor/' + req.params[1];
      break;
    case 'models': 
      resourcePath = root + '/models/' + req.params[1];
      break;
    case 'css': 
      resourcePath = root + '/client/css/' + req.params[1];
      break;
    default: 
      break;
  }
  // console.log("resolved resourcePath: " + resourcePath);
  if(resourcePath && path.existsSync(resourcePath)){
    res.sendfile(resourcePath)
  } else {
    res.send(404);
  }
});

app.get('/data/*', function(req, res){
  // handle data as static files for now
  var resourcePath = root + '/data/' + req.params[0];
  
  res.sendfile( resourcePath );
});

app.get('/:resource', function(req, res){
  res.sendfile(root + '/client/' + req.params.resource);
});


app.listen(3000);
console.log("listening on localhost:3000");