var gulp = require('gulp');
var  $ = require('gulp-load-plugins')();
var path = require('path');
var express = require('express');
var embedlr = require('gulp-embedlr');
var lrserver = require('tiny-lr')();
var refresh = require('gulp-livereload');


var APP_ROOT = 4000;
var APP_ROOT = './app/public/';
var LIVERELOAD_PORT = 35729;




// ## express app server
gulp.task('app', ['appIced', 'appServer', 'appWatch']);


gulp.task('appIced', function() {

  gulp.src('./src/app/**/*.iced')
    .pipe($.iced({runtime: 'inline'}).on('error', $.util.log))
    .pipe(gulp.dest('./app'))
});

gulp.task('appServer', function() {
  lrserver.listen(LIVERELOAD_PORT)

  $.nodemon({ 
    script: './app/app.js',     
    env: { 
      'NODE_ENV': 'development'
    },
    ignore: [
      'gulpfile.js',
      'src/client/',
      'app/public/'
    ],
  })
    .on('start', ['watch']) // start & change run watch - gets around nodemon reloading after every js update
    .on('change', ['watch'])
    .on('restart', function () {
      console.log('appServer restarted!');
    });
});


gulp.task('appWatch', function() {
  gulp.watch('./src/app/*.coffee', ['appIced'])
});



// ## client app

gulp.task('client', [
  'clientCoffee', 
  'clientLess', 
  'clientTemplates', 
  'clientImages'
]);

gulp.task('clientLess', function() {
  gulp.src('./src/client/stylesheets/main.less')
    .pipe($.less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(gulp.dest(APP_ROOT + 'stylesheets'))
    .pipe(refresh(lrserver))
    ;
});

gulp.task('clientCoffee', ['clientCoffeeMain']);

gulp.task('clientCoffeeMain', function() {
  return browserifyClientCoffee(
    './src/client/scripts/main.coffee',
    APP_ROOT + 'scripts',
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
  return gulp.src('./src/client/images/*')
    .pipe(gulp.dest(APP_ROOT + 'images'))
})

gulp.task('clientTemplates', function() {
  gulp.src('./src/client/*.ejs')
    .pipe($.ejs({
        msg: 'Hello Gulp!'
    }).on('error', $.util.log))
    .pipe(gulp.dest(APP_ROOT))
    .pipe(refresh(lrserver))
    ;
});




gulp.task('watch', function() {
  gulp.watch('./src/app/*.iced', ['appIced'])

  gulp.watch('src/client/stylesheets/**/*.less',['clientLess']);
  gulp.watch('src/client/scripts/*.coffee', ['clientCoffee']);
  gulp.watch('src/client/*.ejs', ['clientTemplates']);
});

// Default Task
gulp.task('default', [
  'app',
  'client',
  'watch'
  ]);