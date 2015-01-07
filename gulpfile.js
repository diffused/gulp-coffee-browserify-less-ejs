var gulp = require('gulp');
var  $ = require('gulp-load-plugins')();
var path = require('path');
var express = require('express');
var embedlr = require('gulp-embedlr');
var lrserver = require('tiny-lr')();
var refresh = require('gulp-livereload');

var lazypipe = require('lazypipe');

// var APP_PORT = 4000;
var APP_ROOT = 'app/';
var CLIENT_APP_ROOT = 'app/public/';

var APP_SRC_ROOT = 'src/app/';
var CLIENT_SRC_ROOT = 'src/client/';

var LIVERELOAD_PORT = 35729;


// ## express app server
gulp.task('app', ['appCoffee', 'appViews', 'appServer']);

var appCoffeePipe = lazypipe()
  .pipe($.debug)
  .pipe($.coffeelint)
  .pipe($.coffeelint.reporter)
  .pipe($.coffee, {
    runtime: 'inline'
  })  
  .pipe(gulp.dest, APP_ROOT)  
  ;

// saved for js only apps  
// var appJsPipe = lazypipe()
//   .pipe($.debug)
//   .pipe($.jshint)
//   .pipe($.jshint.reporter)
//   ;

var appViewPipe = lazypipe()
  .pipe($.debug)
  .pipe(gulp.dest, APP_ROOT + 'views')

gulp.task('appWatch', function() {
  $.watch(APP_SRC_ROOT + '**/*.js')
    .pipe(appCoffeePipe())
    // .pipe(appJsPipe())
    .pipe(refresh(lrserver))
    ;

  $.watch(APP_SRC_ROOT + 'views/**/*.ejs')
    .pipe(appViewPipe())
    .pipe(refresh(lrserver))
    ;

});



// saved for js only apps  
// gulp.task('appJs', function () {
//   return gulp.src(APP_SRC_ROOT + '**/*.js')
//     .pipe(appJsPipe())
//     ;
// });


gulp.task('appCoffee', function() {
  return gulp.src(APP_SRC_ROOT + '**/*.coffee')
    .pipe(appCoffeePipe());    
});

gulp.task('appViews', function() {
  return gulp.src(APP_SRC_ROOT + 'views/**/*')
    .pipe(appViewPipe());    
});


gulp.task('appServer', function() {
  lrserver.listen(LIVERELOAD_PORT)

  $.nodemon({ 
    script: APP_ROOT + 'app.js',
    ext: 'js',
    // "verbose": true,
    env: { 
      'NODE_ENV': 'development'
    },    
    ignore: [
      'gulpfile.js',
      'src',
      'dist',
      'app/views/**/*',
      CLIENT_SRC_ROOT,
      CLIENT_APP_ROOT
    ]
  })
    // .on('start', ['watch']) // start & change run watch - gets around nodemon reloading after every js update
    // .on('change', ['watch'])
    .on('restart', function () {
      console.log('appServer restarted!');
    });
});


// ## client app

gulp.task('client', [
  'clientCoffee', 
  'bw',
  'clientLess', 
  'clientTemplates', 
  'clientImages'
]);

gulp.task('clientCoffeeLint', function () {
    gulp.src(CLIENT_SRC_ROOT + '**/*.coffee')
      .pipe($.coffeelint())
      .pipe($.coffeelint.reporter())
    ;
});

gulp.task('clientLess', function() {
  gulp.src(CLIENT_SRC_ROOT + 'stylesheets/main.less')
    .pipe($.less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(gulp.dest(CLIENT_APP_ROOT + 'stylesheets'))
    .pipe(refresh(lrserver))
    ;
});


var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');
var browserify = require('browserify');
var fs = require('fs');

gulp.task('bw', function(){
  watch = true;
  browserifyShare();
});

function browserifyShare(){
  var b = browserify({
    cache: {},
    packageCache: {},
    fullPaths: true
  });
  
  if(watch) {
    // if watch is enable, wrap this bundle inside watchify
    b = watchify(b);
    b.on('update', function(){
      bundleShare(b);
    });
  }
  
  b.add('./' + CLIENT_SRC_ROOT + 'scripts/main.js');
  bundleShare(b);
}

function bundleShare(b) {
  b.bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./' + CLIENT_APP_ROOT + 'scripts'))
    .pipe(refresh(lrserver))
    ;
}


// saved for js only apps
// gulp.task('clientJs', ['clientJsMain']);

// gulp.task('clientJsMain', function() {
//   gulp.src(CLIENT_SRC_ROOT + 'scripts/**/*.js')
//   .pipe($.jshint())
//   .pipe($.jshint.reporter('default'))
//   ;
// });

gulp.task('clientCoffee', ['clientCoffeeMain']);

gulp.task('clientCoffeeMain', function() {
  gulp.src(CLIENT_SRC_ROOT + 'scripts/**/*.coffee')
    .pipe($.coffee()).on('error', $.util.log)
    .pipe(gulp.dest(CLIENT_SRC_ROOT + 'scripts'))
    ;
});


gulp.task('clientImages', function() {
  return gulp.src(CLIENT_SRC_ROOT + 'images/*')
    .pipe(gulp.dest(CLIENT_APP_ROOT + 'images'))
})

gulp.task('clientTemplates', function() {
  gulp.src(CLIENT_SRC_ROOT + '*.ejs')
    .pipe($.ejs()
      .on('error', $.util.log))
    .pipe(gulp.dest(CLIENT_APP_ROOT))
    .pipe(refresh(lrserver))
    ;
});




gulp.task('clientWatch', function() {
  gulp.watch(CLIENT_SRC_ROOT + 'stylesheets/**/*.less',['clientLess']);
  gulp.watch(CLIENT_SRC_ROOT + 'scripts/*.coffee', ['clientCoffee']);
  gulp.watch(CLIENT_SRC_ROOT + '**/*.coffee', ['clientCoffeeLint']);
  gulp.watch(CLIENT_SRC_ROOT + '**/*.ejs', ['clientTemplates']);
});

// Default Task
gulp.task('default', [
  'app',
  'appWatch',
  'client',
  'clientWatch'
  ]);