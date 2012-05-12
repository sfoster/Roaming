var fs = require('fs');
var path = require('path');
var assert = require('assert');
var express = require('express');

var app = express.createServer();
var root = __dirname;
var port = process.env.ROAMINGAPP_PORT || 3000;
var datadir = process.env.ROAMINGAPP_DATADIR || path.resolve(root, '../data');
console.log("datadir at: " + datadir);

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set("view engine", "hbs");
  app.use(express.logger({ format: ':method :url' }));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  // app.use(express.session({ secret: 'keyboard cat' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  // app.use(passport.initialize());
  // app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/client'));
});

app.get('/', function(req, res, next){
  res.render('index', {
    // context data for the landing page
  });
});

app.get('/main', function(req, res, next){
  res.render('main', {
    // context data for the main gameplay page
  });
});

app.get('/location/world.json', function(req, res){
  var resourcePath = fs.realpathSync(datadir + '/location/world.json');
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
  var resourcePath = fs.realpathSync(datadir + '/location/world.json');
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

// app.get(/^\/(resources|models|vendor|css|plugins|lib)\/(.*)$/, function(req, res){
app.get(/^\/(resources|models|vendor|plugins|lib)\/(.*)$/, function(req, res){
  var resourcePath;
  console.log("matched: ", req.params[0], req.params[1]);
  console.log("prefix with root: ", root);
  switch(req.params[0]){
    case 'resources': 
    case 'vendor': 
    case 'plugins': 
    case 'models': 
    case 'lib': 
      resourcePath = root + '/' +req.params[0]+ '/' + req.params[1];
      break;
    case 'css': 
      resourcePath = root + '/client/css/' + req.params[1];
      break;
    default: 
      break;
  }
  
  resourcePath = fs.realpathSync(resourcePath);
  
  // console.log("resolved resourcePath: " + resourcePath);
  if(resourcePath && path.existsSync(resourcePath)){
    res.sendfile(resourcePath);
  } else {
    res.send(404);
  }
});

app.get('/location/:id.json', function(req, res){
  // handle data as static files for now
  var id = req.params.id;
  console.log("request for location id: " + id);

  var relPath = 'location/' + id + '.json';
  var resourcePath = datadir + '/' + relPath;

  if( path.existsSync(resourcePath) ){
    resourcePath = fs.realpathSync(resourcePath);
    console.log(id + " exists");
    res.sendfile( resourcePath );
  } else {
    console.log(id + " does not exist");
    var emptyLocation = {
      coords: id.split(','),
      description: "--No description yet--",
      afar: "--No afar description yet--",
      here: [] 
    };
    res.send( JSON.stringify(emptyLocation) );
  }
});

app.put('/location/:id.json', function(req, res){
  var id = req.params.id;
  var fileData = req.body;
  assert(id);
  assert(2 == id.split(',').length);
  assert("string" == typeof fileData.description);

  var relPath = 'location/' + id + '.json';
  var resourcePath = datadir + '/' + relPath;

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

app.get('/data/*', function(req, res){
  // handle data as static files for now
  var relPath = req.params[0].replace(/^\.\//, '');
  var resourcePath = fs.realpathSync(datadir + '/' + relPath);
  res.sendfile( resourcePath );
});

// app.get('/:resource', function(req, res){
//   var resourcePath = fs.realpathSync(root + '/client/' + req.params.resource);
//   res.sendfile(resourcePath);
// });


app.listen(port);
console.log("listening on localhost:" + port);
