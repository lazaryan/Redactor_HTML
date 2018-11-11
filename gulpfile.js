"use strict";
/*общие*/
const gulp          = require('gulp');
const browserSync   = require('browser-sync');
const gulpif        = require('gulp-if');
const plumber       = require('gulp-plumber');

/*html*/
const htmlmin       = require('gulp-htmlmin');
const fileinclude   = require('gulp-file-include');

/*styles*/
const sass          = require('gulp-sass');
const autoprefixer  = require('gulp-autoprefixer');
const csso          = require('gulp-csso');

/*js*/
const uglify        = require('gulp-uglify-es').default;
const babel         = require('gulp-babel');

gulp.task('livereload', () => {
    browserSync.create();

    browserSync.init({
        server: {
            baseDir: 'dist'
        },
        files: [
            'dist/**/*.*'
        ]
    });
});

gulp.task('styles', () => {
    gulp.src('src/sass/**/[^_]*.sass')
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer(['last 50 versions']))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('js', () => {
    gulp.src('src/js/**/*.*')
        .pipe(plumber())
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('html', () => {
    gulp.src('src/[^_]*.+(html|php)')
        .pipe(fileinclude())
        .pipe(gulp.dest('./dist'));
});

gulp.task('img', () => {
    gulp.src('src/img/**/*.*')
        .pipe(gulp.dest('./dist/img'));
});

gulp.task('watch', () => {
    gulp.watch('src/sass/**/*.sass', ['styles']);
    gulp.watch('src/**/*.+(html|php)', ['html']);
    gulp.watch('src/js/**/*.+(js|json)', ['js']);
    gulp.watch('src/img/**/*.*', ['img']);
});

gulp.task('default', ['styles', 'img', 'html', 'js', 'livereload', 'watch']);