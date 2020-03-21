var gulp = require('gulp');;
var watch = require('gulp-watch');
var run = require('gulp-run');

gulp.task('chrome-watch', function () {
    watch(['src/**/*.*', 'public/**/*.*'], function (file) {
        console.log('change detected', file.relative);
        gulp.series("build")();
    });
});

gulp.task('build', function () {
    run('yarn build').exec();
});


