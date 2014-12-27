(function() {
  var EXPRESS_PORT, LIVERELOAD_PORT, PUBLIC_ROOT, app, express, i, loadRoutes, path;

  express = require('express');

  path = require("path");

  i = require('eyes').inspector({
    styles: {
      all: 'magenta'
    }
  });

  EXPRESS_PORT = 4000;

  PUBLIC_ROOT = './app/public/';

  LIVERELOAD_PORT = 35729;

  console.log("starting app server on localhost:" + EXPRESS_PORT);

  app = express();

  app.set('EXPRESS_PORT', EXPRESS_PORT);

  app.set('PUBLIC_ROOT', PUBLIC_ROOT);

  app.set('LIVERELOAD_PORT', LIVERELOAD_PORT);

  require('./config')(app);

  loadRoutes = function() {
    var routesPath;
    routesPath = path.join(__dirname, 'routes');
    return require("fs").readdirSync(routesPath).forEach(function(file) {
      var f;
      f = path.join(routesPath, file);
      return require(f)({
        app: app
      });
    });
  };

  loadRoutes();

  app.get('/', function(req, res) {
    return res.render('index', {
      title: 'Index!',
      someValue: 'some value here'
    });
  });

  app.get('/blah', function(req, res) {
    return res.send('blah! 2');
  });

  app.get('/hello', function(req, res) {
    return res.render('hello', {
      title: 'title hi'
    });
  });

  app.listen(EXPRESS_PORT);

}).call(this);
