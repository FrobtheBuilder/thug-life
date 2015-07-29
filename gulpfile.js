var gulp = require('gulp')
var nodemon = require('gulp-nodemon')
var browserSync = require('browser-sync').create()

var srcDir = "./src/"
var buildDir = "./app/"

gulp.task('nodemon', function() {
    return nodemon({
        script: "index.coffee",
        ext: "coffee",
        ignore: "assets/*",
        env: {'NODE_ENV': 'development'}
    })
})

gulp.task('serve', ['nodemon'], function() {

    browserSync.init({
        proxy: "localhost:3000",
        browser: "google chrome",
        port: '3001'
    })

    gulp.watch('./views/**/*.jade').on('change', browserSync.reload)
    gulp.watch('./assets/**/*.coffee').on('change', browserSync.reload)
    gulp.watch('./assets/**/*.styl').on('change', browserSync.reload)
})