(function() {
  var configureApp, express, livereload, path;

  express = require('express');

  livereload = require('connect-livereload');

  path = require("path");

  configureApp = function(app) {
    var bodyParser, cookieParser, session;
    app.use(livereload({
      port: app.get('LIVERELOAD_PORT')
    }));
    app.use(express["static"](app.get('PUBLIC_ROOT')));
    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "views"));
    bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({
      extended: false
    }));
    app.use(bodyParser.json());
    cookieParser = require('cookie-parser');
    app.use(cookieParser("kkkjkj$J%j5k4kj4kj4kj45k5k4k4488f8fe"));
    session = require('cookie-session');
    return app.use(session({
      keys: ['key1', 'key2']
    }));
  };

  module.exports = configureApp;

}).call(this);
