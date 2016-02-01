var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var less = require('gulp-less');
var path = require('path');


gulp.task('build', function() {
    browserify({
        entries: './js/main.js',
        debug: true,
    })
    .transform(babelify)
    .bundle()
    .on('error', function handleError(err) {
      console.error(err.toString());
      this.emit('end');
    })
    .pipe(source('build.js'))
    .pipe(gulp.dest('js'));
});

gulp.task('watch:js', ['build'], function() {
    gulp.watch('*.js', ['build']);
});

gulp.task('less', function () {
  return gulp.src('./less/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./public/css'));
});

 gulp.task('default', ['build','less']);
