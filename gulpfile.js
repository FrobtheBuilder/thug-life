var gulp = require('gulp')
var nodemon = require('gulp-nodemon')
var browserify = require('browserify')
var browserSync = require('browser-sync').create()
var source = require('vinyl-source-stream')

gulp.task('nodemon', ['browserify'], function() {
    return nodemon({
        script: "index.coffee",
        ext: "coffee",
        ignore: "assets/*",
        env: {'NODE_ENV': 'development'}
    })
})

gulp.task('browserify', function() {
    return browserify({
        baseDir: './assets/js/',
        entries: ['./assets/js/main.coffee'],
        transform: ['coffeeify'],
        debug: true
    })
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./public/'))
})

gulp.task('reload', ['browserify'], function() {
    browserSync.reload()
})

gulp.task('serve', ['nodemon'], function() {

    browserSync.init({
        proxy: "localhost:3000",
        browser: "google chrome",
        port: '3001'
    })

    var reload = function () {
        gulp.run('reload')
    }

    gulp.watch('./views/**/*.jade').on('change', browserSync.reload)
    gulp.watch('./assets/**/*.coffee').on('change', reload)
    gulp.watch('./assets/**/*.styl').on('change', browserSync.reload)
})