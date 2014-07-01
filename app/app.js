var EXPRESS_PORT, EXPRESS_ROOT, app, express, livereload;

express = require('express');

livereload = require('connect-livereload');

EXPRESS_PORT = 4000;

EXPRESS_ROOT = './app/public/';

console.log('starting dev yo...');

app = express();

app.use(express["static"](EXPRESS_ROOT));

app.get('/blah', function(req, res) {
  return res.send('blah 7!!!');
});

console.log('yoyo');

app.listen(4000);
