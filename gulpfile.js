var gulp = require('gulp'),  
  $ = require('gulp-load-plugins')(),  
  path = require('path')
  ;

gulp.task('connect', function() {
  $.connect.server({
    root: 'dist',
    livereload: true,
    port: 1337
  });
});

gulp.task('less', function() {
  gulp.src('./src/stylesheets/main.less')
    .pipe($.less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(gulp.dest('dist/stylesheets'))
    .pipe($.connect.reload())
    ;

});

gulp.task('coffee', function() {
  return gulp.src('src/scripts/main.coffee', {
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
    .pipe(gulp.dest('dist/scripts'))
    .pipe($.connect.reload())
    ;
});

gulp.task('images', function() {
  return gulp.src('./src/images/*')
    .pipe(gulp.dest('./dist/images'))
})

gulp.task('templates', function() {
  gulp.src('src/*.ejs')
    .pipe($.ejs({
        msg: 'Hello Gulp!'
    }).on('error', $.util.log))
    .pipe(gulp.dest('./dist'))
    .pipe($.connect.reload())
    ;
});


gulp.task('watch', function() {
  gulp.watch('src/stylesheets/**/*.less',['less']);

  gulp.watch('src/scripts/*.coffee', ['coffee']);

  gulp.watch('src/*.ejs', ['templates']);  
});

// Default Task
gulp.task('default', ['coffee', 'less', 'templates', 'images', 'connect', 'watch']);