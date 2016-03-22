var gulp = require('gulp');
var config = require('../config');

gulp.task('watch', function() {
    gulp.watch(config.browserify.watch,   ['browserify-app']);
    gulp.watch(config.css.watch,          ['css']);
    gulp.watch(config.resources.watch,    ['resources']);
    gulp.watch(config.examples.watch,     ['examples']);
    gulp.watch(config.examplesJS.watch,   ['examplesJS']);
});

gulp.task('build-all', ['browserify', 'vendor', 'css', 'resources', 'examples', 'examplesJS']);

gulp.task('default', ['build-all', 'watch']);
