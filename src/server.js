require("amd-loader");
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var express = require('express'); 
var passport = require('passport'), 
    BrowserIDStrategy = require('passport-browserid').Strategy;

var users = require('./server/lib/users');

var root = __dirname;
var port = process.env.ROAMINGAPP_PORT || 3000;
var hostname = process.env.ROAMINGAPP_HOSTNAME || 'localhost';
var isDev = hostname === 'localhost';
var host = port == 80 ? hostname : hostname+':'+port;
var datadir = process.env.ROAMINGAPP_DATADIR || path.resolve(root, '../data');

var handlebars = require('hbs');
handlebars.registerHelper('keys', function(context) {
  var keys = [];
  for(var i in context){
    keys.push(i);
  }
  return keys.join(', ');
});

// app is global
var app = express.createServer();
    app.rootdir = root;
    app.datadir = datadir;

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (isDev || req.isAuthenticated()) { 
    console.log('ensureAuthenticated, ok, calling next');
    return next();
  }
  res.redirect('/');
}

function ensureAdmin(req, res, next){
  var user = req.user, 
      roles = user && user.roles;
  if(roles && roles.admin){
    return next();
  }
  res.send(403);
}

// Passport session setup.`
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the BrowserID verified email address
//   is serialized and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user.email);
});

passport.deserializeUser(function(email, done) {
  users.get(email, function(err, user){
    // if(err)
    done(null, user);
  });
});

// Use the BrowserIDStrategy within Passport.
//   Strategies in passport require a `validate` function, which accept
//   credentials (in this case, a BrowserID verified email address), and invoke
//   a callback with a user object.
console.log('configuring BrowserIDStrategy to use audience: http://'+host);
passport.use(new BrowserIDStrategy({
    audience: 'http://'+host
  },
  function(email, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's email address is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the email address with a user record in your database, and
      // return that user instead.
      console.log('user verified: ', email);
      return done(null, { email: email });
    });
  }
));
 
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set("view engine", "hbs");
  app.use(express.logger({ format: ':method :url' }));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard00cat' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express['static'](__dirname + '/client'));
});

function createObject(proto, mixin){
  var obj = Object.create(proto);
  if(mixin){
    for(var i in mixin) obj[i] = mixin[i];
  }
  return obj;
}
var viewModelProto = {
  head: '', 
  title: 'Roaming',
  version: '0.0'
};


app.get('/', function(req, res, next){
  res.render('index.html', createObject(viewModelProto, {
    layout: false,
    user: req.user
    // context data for the landing page
  }));
});

app.get('/main', ensureAuthenticated, function(req, res, next){
  res.render('main.html', createObject(viewModelProto, {
    // context data for the landing page
    user: req.user
  }));
});

handlebars.registerPartial('globalhead', fs.readFileSync(root + '/views/globalhead.html').toString());
app.register('.html', handlebars);

app.get(/^(\/map|\/map\.html)$/, ensureAuthenticated, ensureAdmin, function(req, res, next){
  res.render('map.html', createObject(viewModelProto, {
    // context data for the landing page
    title: 'Roaming: Editor',
    head: '<link rel="stylesheet" href="./css/map.css" type="text/css">',
    user: req.user
  }));
});

app.get('/location/:region?download&ts=:ts', function(req, res){
  var resourcePath = fs.realpathSync(datadir + '/location/' + req.params.region + '.json');
  res.download( resourcePath, region+'.json' );
});

function locationRequest(resourceId, req, res) {
  console.log("locationRequest for " + resourceId);
  var resourcePath = path.join(datadir, '/location/', resourceId + '.json');
  if(path.existsSync(resourcePath)){
    fs.readFile(resourcePath, function(err, contents){
      var data = JSON.parse(contents), 
          respData = { status: 'ok', d: data };
      res.send( JSON.stringify(respData), { 'Content-Type': 'application/json' }, 200);
    });
  } else {
    console.log('sending 404 for ' + resourceId + '.json');
    res.send(404);
  }
}

function writeLocationResource(resourcePath, fileData, callback) {
  // sort if possible, so we minimize the diff when saving changes
  if('function' === typeof fileData.sort){
    fileData.sort(function(a,b){
      if(a.y == b.y) {
        return a.x > b.x ? 1 : -1;
      } else {
        return a.y > b.y ? 1 : -1;
      }
    });
  }
  fs.writeFile(resourcePath, JSON.stringify(fileData, null, 2), callback);
}

function locationPutRequest(regionId, req, resp) {
  var resourcePath = fs.realpathSync(datadir + '/location/' + regionId + '.json');
  var fileData = req.body;
  writeLocationResource(resourcePath, fileData, function(err) {
    if(err) {
        console.log(err);
        resp.send(500);
    } else {
        resp.send({ status: 'ok', 'message': 'updated '+resourcePath });
        console.log(resourcePath + " saved");
    }
  });
}

function safeish(path){
  return path.replace(/^[\W]*/, '');
}

// accept with or without the trailing slash
app.get('/location/:region/', function(req, res){
  locationRequest( safeish(req.params.region) + '/index', req, res);
});
app.get('/location/:region', function(req, res){
  locationRequest( safeish(req.params.region) + '/index', req, res);
});
app.get('/location/:region/:coord', function(req, res){
  locationRequest( safeish(req.params.region) +'/' + safeish(req.params.coord), req, res);
});

app.put('/location/:region', function(req, resp){
  // replace entire document at /location/regionname/index
  locationPutRequest(req.params.region + '/index', req, res);
});

app.put('/location/:region/:coord', function(req, res){
  // create or wholly replace the contents of the tile at region/coord.json
  var coord = req.params.coord;
  var fileData = req.body;

  assert(2 == coord.split(',').length);
  assert("string" == typeof fileData.description);

  var regionDir = fs.realpathSync(datadir + '/location/' + req.params.region);
  var resourcePath = regionDir +'/' + coord + '.json';

  writeLocationResource(resourcePath, fileData, function(err){
    if(err) {
        console.log(err);
        res.send(500);
    } else {
        res.send({ status: 'ok', 'message': 'updated '+resourcePath });
        console.log(resourcePath + " saved");
    }
  });
});

app.get(/^\/(resources|models|plugins|test)\/(.+)$/, function(req, res){
  var resourcePath;
  console.log("matched: ", req.params[0], req.params[1]);
  // console.log("prefix with root: ", root);
  switch(req.params[0]){
    case 'resources': 
    case 'plugins': 
    case 'models': 
    case 'test':
      resourcePath = root + '/' +req.params[0]+ '/' + req.params[1];
      break;
    // case 'css': 
    //   resourcePath = root + '/client/css/' + req.params[1];
    //   break;
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


app.get('/data/*', function(req, res){
  // handle data as static files for now
  var relPath = req.params[0].replace(/^\.\//, '');
  var resourcePath = fs.realpathSync(datadir + '/' + relPath);
  res.sendfile( resourcePath );
});

// POST /auth/browserid
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  BrowserID authentication will verify the assertion obtained from
//   the browser via the JavaScript API.
app.post('/auth/browserid', 
  passport.authenticate('browserid', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


function playerRequest(playerId, req, res) {
  console.log("playerRequest for " + playerId);
  var resourcePath = path.join(datadir, '/player/', playerId + '.json');
  if(path.existsSync(resourcePath)){
    fs.readFile(resourcePath, function(err, contents){
      var data = JSON.parse(contents), 
          respData = { status: 'ok', d: data };
      res.send( JSON.stringify(respData), { 'Content-Type': 'application/json' }, 200);
    });
  } else {
    console.log('sending 404 for ' + playerId + '.json');
    res.send(404);
  }
}

app.get('/player/:id', ensureAuthenticated, function(req, res, next){
  // TODO: access control to ensure only correct user or admin can request player details
  // so final resource might be /data/username@foo.com/playername
  playerRequest( safeish(req.params.id), req, res);
});


app.listen(port, hostname);
console.log("listening on "+ hostname + ":" + port);
