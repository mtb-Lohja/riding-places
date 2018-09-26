"use strict";

// TODO: Add cache buster like gulp-rev
const gulp = require("gulp"),
    { series, parallel } = require("gulp"),
    gulpif = require("gulp-if"),
    autoprefixer = require("gulp-autoprefixer"),
    minifycss = require("gulp-minify-css"),
    jshint = require("gulp-jshint"),
    uglify = require("gulp-uglifyes"),
    rename = require("gulp-rename"),
    concat = require("gulp-concat"),
    htmlreplace = require("gulp-html-replace"),
    del = require("del"),
    webserver = require("gulp-webserver");

const paths = {
    scripts: {
        dest: "dist/scripts",
        src: ["app/scripts/*.js"]
    },
    libs: {
        dest: "dist/lib",
        src: ["app/lib/leaflet/leaflet.js"]
    },
    styles: {
        dest: "dist/styles",
        src: ["app/styles/main.css", "app/lib/leaflet/leaflet.css"]
    },
    images: {
        dest: "dist/styles/images",
        src: ["app/images/*", "app/lib/leaflet/images/*"]
    },
    html: {
        dest: "dist",
        src: ["app/*.html", "app/robots.txt", "app/CNAME"]
    },
    data: {
        dest: "dist/data",
        src: ["app/data/*.js"]
    }
};

// Task functions
function styles() {
    return gulp
        .src(paths.styles.src)
        .pipe(gulpif(/\/app\/styles\*.css$/, autoprefixer("last 2 version")))
        .pipe(concat("app.css"))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(rename({ suffix: ".min" }))
        .pipe(minifycss())
        .pipe(gulp.dest(paths.styles.dest));
}

function scripts() {
    return gulp
        .src(paths.scripts.src)
        .pipe(jshint(".jshintrc"))
        .pipe(jshint.reporter("jshint-stylish"))
        .pipe(concat("app.js"))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(rename({ suffix: ".min" }))
        .pipe(uglify())
        .pipe(gulp.dest(paths.scripts.dest));
}

function copyLibsFromNodeModules() {
    return gulp
        .src("node_modules/leaflet/dist/**/*")
        .pipe(gulp.dest("app/lib/leaflet/"));
}

function libs() {
    return gulp
        .src(paths.libs.src)
        .pipe(concat("libs.min.js"))
        .pipe(gulp.dest(paths.libs.dest));
}

function images() {
    return gulp.src(paths.images.src).pipe(gulp.dest(paths.images.dest));
}

function html() {
    return gulp
        .src(paths.html.src)
        .pipe(
            htmlreplace({
                css: "styles/app.min.css",
                libs: "lib/libs.min.js",
                js: "scripts/app.min.js"
            })
        )
        .pipe(gulp.dest(paths.html.dest));
}

function data() {
    return gulp.src(paths.data.src).pipe(gulp.dest(paths.data.dest));
}

function clean(cb) {
    del([paths.html.dest + "**/*"], cb);
}

function watch() {
    gulp.watch(paths.styles.src, series(styles));
    gulp.watch(paths.scripts.src, series(scripts));
    gulp.watch(paths.html.src, series(html));
    gulp.watch(paths.data.src, series(data));
}

// Register tasks
exports.clean = clean;
exports.libs = series(copyLibsFromNodeModules, libs);

// Rerun tasks when files change
exports.watch = watch;

exports.build = series(
    clean,
    series(
        copyLibsFromNodeModules,
        parallel(styles, scripts, libs, images, html, data)
    )
);

// The default task, called when you run `gulp` from cli.
// First clean and build once. Then start watching for file changes.
// After all that open development web server.
exports.default = series(
    series(
        copyLibsFromNodeModules,
        parallel(styles, scripts, libs, images, html, data)
    ),
    parallel(watch, function() {
        // TODO: Fix livereload
        return gulp.src("app").pipe(
            webserver({
                livereload: true,
                fallback: "index.html",
                directoryListing: false,
                open: true
            })
        );
    })
);

// Emulate production setup
exports["webserver:dist"] = series(
    series(
        copyLibsFromNodeModules,
        parallel(styles, scripts, libs, images, html, data)
    ),
    function() {
        return gulp.src("dist").pipe(webserver({ open: true, port: 8001 }));
    }
);
