// TODO: Add cache buster like gulp-rev
// TODO: Take gulp-htmlbuild or similar into use https://www.npmjs.org/package/gulp-htmlbuild
// TODO: Take gulp serve or gulp browsersync into use with two tasks: dist and dev
// TODO: Use gulp browsersync live reload capabilities
var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    stripJsonComments = require('gulp-strip-json-comments');

var paths = {
    scripts: {
        dest: 'dist/scripts',
        src: [
            'app/scripts/*.js'
        ]
    },
    libs: {
        dest: 'dist/lib',
        src: [
            'app/lib/leaflet/dist/leaflet.js'
        ]
    },
    styles: {
        dest: 'dist/styles',
        src: [
            'app/styles/main.css',
            'app/lib/leaflet/dist/leaflet.css'
        ]
    },
    images: {
        dest: 'dist/images',
        src:
        [
            'app/images/*',
            'app/lib/leaflet/dist/images/*'
        ]
    },
    html: {
        dest: 'dist',
        src: [
            'app/*.html',
            'app/robots.txt',
            'app/CNAME'
        ]
    },
    data: {
        dest: 'dist/data',
        src: [
            'app/data/*.js'
        ]
    }
};

function styles() {
    return gulp.src(paths.styles.src)
      .pipe(gulpif(/\/app\/styles\*.css$/, autoprefixer('last 2 version')))

       // Adding to pipe should work like this, but currently fails due to https://github.com/wearefractal/vinyl-fs/issues/25
       // .pipe(gulp.src(paths.styles.srcLibs))
      .pipe(concat('app.css'))
      .pipe(gulp.dest(paths.styles.dest))
      .pipe(rename({ suffix: '.min' }))
      .pipe(minifycss())
      .pipe(gulp.dest(paths.styles.dest));
}

function scripts() {
    return gulp.src(paths.scripts.src)
     .pipe(jshint('.jshintrc'))
     .pipe(jshint.reporter('jshint-stylish'))
     .pipe(concat('app.js'))
     .pipe(gulp.dest(paths.scripts.dest))
     .pipe(rename({ suffix: '.min' }))
     .pipe(uglify())
     .pipe(gulp.dest(paths.scripts.dest));
}

function libs() {
    return gulp.src(paths.libs.src)
     .pipe(concat('libs.min.js'))
     .pipe(gulp.dest(paths.libs.dest));
}

function images() {
    // Copy all static images
    return gulp.src(paths.images.src)
     .pipe(gulp.dest(paths.images.dest));
}

function html() {
    return gulp.src(paths.html.src)
	 .pipe(gulp.dest(paths.html.dest));
}

function data() {
    return gulp.src(paths.data.src)
        .pipe(stripJsonComments())
        .pipe(gulp.dest(paths.data.dest));
}

// Register tasks
gulp.task('clean', function () {
    return gulp.src([paths.html.dest], { read: false })
      .pipe(clean());
});
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('libs', libs);
gulp.task('images', images);
gulp.task('html', html);
gulp.task('data', data);

// Rerun tasks when files change
gulp.task('watch', function () {
    gulp.watch(paths.styles.src, ['styles']);
    gulp.watch(paths.scripts.src, ['scripts']);
    gulp.watch(paths.html.src, ['html']);
    gulp.watch(paths.data.src, ['data']);
});

// The default task, called when you run `gulp` from cli.
// First clean and start watching for file changes, and 
// then build everything once for starters.
gulp.task('default', ['clean', 'watch'], function () {
    styles();
    scripts();
    libs();
    images();
    html();
    data();
});
