var gulp = require('gulp')

//gulp - https://stackoverflow.com/questions/48865979/include-js-and-css-files-from-node-modules-into-a-static-html-page
gulp.task('default', function () {
    gulp.src('./node_modules/jquery/dist/jquery.min.js')
        .pipe(gulp.dest('./public/js/'));

    gulp.src('./node_modules/moment/min/moment.min.js')
        .pipe(gulp.dest('./public/js/'));

    gulp.src('./node_modules/fullcalendar/dist/fullcalendar.css')
        .pipe(gulp.dest('./public/css/'));
   
    gulp.src('./node_modules/fullcalendar/dist/fullcalendar.min.js')
        .pipe(gulp.dest('./public/js/'));
});

/*gulp.task('jquery', function () {
    gulp.src('/node_modules/jquery/jquery.min.js')
        .pipe(gulp.dest('./public/js'));
});

gulp.task('moment', function () {
    gulp.src('/node_modules/moment/min/moment.min.js')
        .pipe(gulp.dest('./public/js'));
});

gulp.task('fullcalendar', function () {
    gulp.src('/node_modules/fullcalendar/fullcalendar.css')
     .pipe(gulp.dest('./public/css'));

     gulp.src('/node_modules/fullcalendar/fullcalendar.min.js')
     .pipe(gulp.dest('./public/js'));
});

gulp.task('default', ['jquery', 'moment', 'fullcalendar']);*/