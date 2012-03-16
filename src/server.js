var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express.createServer();
var root = __dirname;
var port = process.env.ROAMINGAPP_PORT || 80;

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
  fileData.sort(function(a,b){
    if(a.y == b.y) {
      return a.x > b.x ? 1 : -1;
    } else {
      return a.y > b.y ? 1 : -1;
    }
  });
  fs.writeFile(resourcePath, JSON.stringify(fileData, null, 2), function(err) {
    if(err) {
        console.log(err);
        res.send(500);
    } else {
        res.send({ status: 'ok', 'message': 'updated '+resourcePath });
        console.log(resourcePath + " saved");
    }
  });
});

app.get(/^\/(resources|models|vendor|css|plugins)\/(.*)$/, function(req, res){
  var resourcePath;
  // console.log("matched: ", req.params[0], req.params[1]);
  switch(req.params[0]){
    case 'resources': 
      resourcePath = root + '/resources/' + req.params[1];
      break;
    case 'plugins': 
      resourcePath = root + '/plugins/' + req.params[1];
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
    res.sendfile(resourcePath);
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


app.listen(port);
console.log("listening on localhost:" + port);
