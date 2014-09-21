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

var appViewPipe = lazypipe()
  .pipe($.debug)
  .pipe(gulp.dest, APP_ROOT + 'views')

gulp.task('appWatch', function() {
  $.watch(APP_SRC_ROOT + '**/*.coffee')
    .pipe(appCoffeePipe())
    .pipe(refresh(lrserver))
    ;

  $.watch(APP_SRC_ROOT + 'views/**/*.ejs')
    .pipe(appViewPipe())
    .pipe(refresh(lrserver))
    ;

});




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

gulp.task('clientCoffee', ['clientCoffeeMain']);

gulp.task('clientCoffeeMain', function() {
  return browserifyClientCoffee(
    CLIENT_SRC_ROOT + 'scripts/main.coffee',
    CLIENT_APP_ROOT + 'scripts',
    'app.js'
    );
});

function browserifyClientCoffee(src, dest, destFilename) {
  return gulp.src(src, {
      read: false
    })
    .pipe($.plumber())
    .pipe($.browserify({
      debug: true,
      insertGlobals: false,
      transform: ['coffeeify'],
      extensions: ['.coffee']
    }))
    .pipe($.rename(destFilename))
    .pipe(gulp.dest(dest))
    .pipe(refresh(lrserver))    
    ;
}

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