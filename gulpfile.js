
'use strict';

// -------------------------------------
//   devDependencies
// -------------------------------------

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const browserSync = require('browser-sync').create();
const notify = require('gulp-notify');
const cssnano = require('gulp-cssnano');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
var reload       = browserSync.reload;
var projectPHPWatchFiles    = './*.php';

// --------------------------------------------
//  Error message
// --------------------------------------------

const onError = function(err) {
	notify.onError({
		title: "Gulp",
		subtitle: "FAIL!!!",
		message: "Error: <%= error.message %>",
		sound: "Beep"
	})(err);
	this.emit('end');
};



// --------------------------------------------
//  Task: compile, minify, autoprefix sass/scss
// --------------------------------------------
gulp.task('styles', function() {
	return gulp.src('./sass/*.{sass,scss}')
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(autoprefixer({
			browsers: ['last 5 versions', 'ie 8', 'ie 9', '> 1%'],
			cascade: false
		}))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(cssnano())
		.pipe(sourcemaps.write('/maps'))
		.pipe(gulp.dest('./css/'))
});



gulp.task( 'server', function() {
  browserSync.init( {
    proxy: 'http://localhost/fgmarket/',
    open: true,
    injectChanges: true,
  } );
});

gulp.task('clean', function() {
	return del('public');
});


gulp.task('build', gulp.series(
	'clean',
	gulp.parallel('styles')));


gulp.task('watch', function () {
    gulp.watch('./sass/*.{sass,scss}', gulp.series('styles'));
    gulp.watch(projectPHPWatchFiles, gulp.series(reload));
});

gulp.task('dev',
	gulp.series('build', gulp.parallel('watch', 'server'))
);
