'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');


const imagemin = require('gulp-imagemin');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
var watch = require('gulp-watch');
var browserSync = require('browser-sync').create();




sass.compiler = require('node-sass');

gulp.task('sass', function () {
  // return gulp.src('src/sass/**/*.scss')
     return gulp.src('src/sass/styles.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream());
});

gulp.task('sass:watch', function () {
  gulp.watch('src/sass/**/*.scss', ['sass']);
});



gulp.task('imgmin', function () {
  return gulp.src('src/img/*')
      .pipe(imagemin())
      .pipe(gulp.dest('src/img_compress'))
});


gulp.task('html', function () {
  return gulp.src('src/*.html')
      .pipe(gulp.dest('build'))
      .pipe(browserSync.stream());

});
gulp.task('copyimg', function () {
  return gulp.src('src/img/*.*')
      .pipe(gulp.dest('build/img'))
      .pipe(browserSync.stream());

});

gulp.task('copyfonts', function () {
  return gulp.src('src/fonts/*.*')
      .pipe(gulp.dest('build/fonts'))
      .pipe(browserSync.stream());

});


exports.styles = () => (
    gulp.src('src/css/*.css')
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCSS({debug: true}, (details) => {
          console.log(`${details.name}: ${details.stats.originalSize}`);
          console.log(`${details.name}: ${details.stats.minifiedSize}`);
        }))
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.stream())


);

gulp.task('mini', () =>   {
  return gulp.src('src/CSSwithPrefix/*.css')
    .pipe(cleanCSS({debug: true}, (details) => {
      console.log(`${details.name}: ${details.stats.originalSize}`);
      console.log(`${details.name}: ${details.stats.minifiedSize}`);
    }))
  .pipe(gulp.dest('build/css'))
  .pipe(browserSync.stream())
});

exports.stream = () => (
  gulp.watch('src/*.html', gulp.series('html')),
  gulp.watch('src/css/*.css', gulp.series('styles')),
  gulp.watch('src/sass/**/*.scss', gulp.series('sass')),
  gulp.watch('src/fonts/*.*', gulp.series('copyfonts')),
  gulp.watch('src/img/*.*', gulp.series('copyimg'))
  );

exports.start = () => (
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    }),
    browserSync.reload(),
    this.stream()
);
