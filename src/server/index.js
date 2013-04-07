var fs = require('fs');
var path = require('path');
var assert = require('assert');
var express = require('express');
var dirlisting = require('./lib/directory');
var passport = require('passport'),
    BrowserIDStrategy = require('passport-browserid').Strategy;

var users = require('./lib/users');

var root = path.resolve(__dirname, '../..');
var port = process.env.ROAMINGAPP_PORT || 3000;
var hostname = process.env.ROAMINGAPP_HOSTNAME || 'localhost';
var isDev = (hostname === 'localhost' || hostname.indexOf('192.168.0') > -1);
var host = port == 80 ? hostname : hostname+':'+port;

// app is global
var app = express.createServer();
    app.rootdir = root;

// Simple route middleware to ensure user is authenticated.
// Use this route middleware on any resource that needs to be protected. If
// the request is authenticated (typically via a persistent login session),
// the request will proceed. Otherwise, the user will be redirected to the
// login page.
function ensureAuthenticated(req, res, next) {
  if (isDev || req.isAuthenticated()) {
    console.log('ensureAuthenticated, ok, calling next');
    return next();
  }
  res.redirect('/');
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
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(dirlisting(app.rootdir));
  app.use(express['static'](app.rootdir));
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

// app.get('/', function(req, res, next){
//   res.render('index.html', createObject(viewModelProto, {
//     layout: false,
//     user: req.user
//     // context data for the landing page
//   }));
// });

app.get('/main', ensureAuthenticated, function(req, res, next){
  res.render('main.html', createObject(viewModelProto, {
    // context data for the landing page
    user: req.user
  }));
});

function safeish(path){
  return path.replace(/^[\W]*/, '');
}

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
