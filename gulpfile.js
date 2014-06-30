var gulp = require('gulp'),  
  $ = require('gulp-load-plugins')(),  
  path = require('path')
  express = require('express')
  // livereload = require('gulp-livereload')
  ;

var embedlr = require('gulp-embedlr');
var lrserver = require('tiny-lr')();
var livereload = require('connect-livereload');
var refresh = require('gulp-livereload');

var distRoot = './app/public/';

var EXPRESS_PORT = 4000;
var EXPRESS_ROOT = distRoot;
var LIVERELOAD_PORT = 35729;


gulp.task('appServer', function() {
  var server = express();
  server.use(livereload({port: LIVERELOAD_PORT}));
  server.use(express.static(EXPRESS_ROOT));
  server.get('/blah', function(req, res){
    res.send('blah!!!');
  });

  server.listen(EXPRESS_PORT);
  lrserver.listen(LIVERELOAD_PORT);
});




gulp.task('less', function() {
  gulp.src('./src/client/stylesheets/main.less')
    .pipe($.less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(gulp.dest(distRoot + 'stylesheets'))
    .pipe(refresh(lrserver))
    ;

});

gulp.task('coffee', function() {
  return gulp.src('./src/client/scripts/main.coffee', {
      read: false
    })
    .pipe($.plumber())
    .pipe($.browserify({
      debug: true,
      insertGlobals: false,
      transform: ['coffeeify'],
      extensions: ['.coffee']
    }))
    .pipe($.rename('app.js'))
    .pipe(gulp.dest(distRoot + 'scripts'))
    .pipe(refresh(lrserver))    
    ;
});

gulp.task('images', function() {
  return gulp.src('./src/client/images/*')
    .pipe(gulp.dest(distRoot + 'images'))
})

gulp.task('templates', function() {
  gulp.src('./src/client/*.ejs')
    .pipe($.ejs({
        msg: 'Hello Gulp!'
    }).on('error', $.util.log))
    .pipe(gulp.dest(distRoot))
    .pipe(refresh(lrserver))
    ;
});




gulp.task('watch', function() {
  gulp.watch('src/client/stylesheets/**/*.less',['less']);

  gulp.watch('src/client/scripts/*.coffee', ['coffee']);

  gulp.watch('src/client/*.ejs', ['templates']);
});

// Default Task
gulp.task('default', ['appServer', 'coffee', 'less', 'templates', 'images', 'watch']);