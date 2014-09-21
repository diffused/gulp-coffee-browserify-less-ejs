(function() {
  var EXPRESS_PORT, LIVERELOAD_PORT, PUBLIC_ROOT, app, express, livereload;

  express = require('express');

  livereload = require('connect-livereload');

  EXPRESS_PORT = 4000;

  PUBLIC_ROOT = './app/public/';

  LIVERELOAD_PORT = 35729;

  console.log('starting dev yo...');

  app = express();

  app.use(livereload({
    port: LIVERELOAD_PORT
  }));

  app.use(express["static"](PUBLIC_ROOT));

  app.get('/blah', function(req, res) {
    return res.send('blah!');
  });

  app.listen(EXPRESS_PORT);

}).call(this);
