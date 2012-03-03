var path = require('path');
var express = require('express');
var app = express.createServer();
var root = path.dirname(__dirname);

app.configure(function(){
    app.use(express.logger({ format: ':method :url' }));
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
    console.log("setup static middleware for " + root + '/client');
    app.use(express.static(root + '/client'));

});

app.listen(3000);
console.log("listening on localhost:3000");