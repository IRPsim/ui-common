var gulp = require('gulp');
var concat = require('gulp-concat');
var templateCache = require('gulp-angular-templatecache');

gulp.task('template', function() {
   return gulp.src('components_common/**/*.html')
       .pipe(templateCache('templates.js', {
           module: 'uiCommon',
           transformUrl: function(url) {
               return 'components_common' + url;
           }
       }))
       .pipe(gulp.dest('dist'));
});

gulp.task('default', gulp.series('template', function() {
    return gulp.src(['app.js', 'dist/templates.js', 'components_common/**/*.js']) // read all of the files that are in script/lib with a .js extension
        .pipe(concat('common-concated.js')) // concatenate all of the file contents into a file
        .pipe(gulp.dest('dist/')); // write that file to the dist/js directory);
}));
