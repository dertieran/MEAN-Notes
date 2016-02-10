var gulp 	 = require('gulp'),
	babel = require('gulp-babel'),
	del = require('del'),
	sourcemaps = require('gulp-sourcemaps'),
	es = require('event-stream'),
	changed = require('gulp-changed'),
	runSequence = require('run-sequence'),
    indent = require("gulp-indent"),
    Webpack = require('webpack'),
    path = require('path'),
    insert = require('gulp-insert'),
    glob = require('glob'),
    Gutil = require('gulp-util');

var distServer = 'dist/';
var distClient = 'dist/client/';
var temp = 'dist/temp/';

gulp.task('clean', function() {
	return del(['dist']);
});

gulp.task('copyBuildStage', function(){
	return es.merge(gulp.src(['src/**/*.*', '!src/shared/**/*.js', '!src/frontend/modules/directives.js'])
						.pipe(gulp.dest(temp)),

                    gulp.src(['src/frontend/modules/directives.js'])
                        .pipe(insert.append(((pattern) => {
                            var files = glob.sync(pattern);
                            var source = files.reduce((prev, next) => {
                                console.log(next);
                                return prev + ('import \'' + path.relative('src/frontend/modules/', next)).replace(/\\/g, '/') + '\';\n';
                            }, '\n');

                            console.log(source);

                            return source;
                        })('src/frontend/directives/**/*Directive.js')))
                        .pipe(gulp.dest(temp + 'frontend/modules')),

                    gulp.src(['config.json', 'config.server.json'])
						.pipe(changed(distServer))
						.pipe(gulp.dest(distServer + 'config/'))
                        .pipe(gulp.dest(distClient + 'config/')),

					gulp.src('src/shared/**/*.*')
						.pipe(changed(distServer))
						.pipe(gulp.dest(temp + 'frontend/'))
						.pipe(gulp.dest(temp + 'backend/'))
				);
});

gulp.task('compile', ['copyBuildStage'], function(){
	return gulp.src([temp + '/**/*.js', '!**/node_modules/**', '!**/frontend/**'])
		.pipe(changed(distServer))
		.pipe(sourcemaps.init())
			.pipe(babel({
				presets : ['es2015'],
				comments : false
			}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(temp));
});

gulp.task('copyToDist', ['copyBuildStage', 'compile'],  function(){
	return es.merge(gulp.src(temp + 'backend/**')
						.pipe(gulp.dest(distServer)),
			        gulp.src([temp + 'frontend/**', '!' + temp + 'frontend/**/*.js'])
						.pipe(gulp.dest(distClient))
				    );
});

gulp.task('clean:temp', ['copyToDist', 'webpack'], function(){
	return del(['dist/temp']);
})

gulp.task('copyDependecies', function(){
	return es.merge(
		gulp.src(['node_modules/angular-material/angular-material.min.css'])
			.pipe(gulp.dest(distClient + 'stylesheets/angular')),

		gulp.src(['node_modules/angular-color-picker/angular-color-picker.css'])
			.pipe(gulp.dest(distClient + 'stylesheets')),

        gulp.src(['node_modules/octicons/octicons/*.*'])
            .pipe(gulp.dest(distClient + 'stylesheets/octicons/')),

        gulp.src(['node_modules/angular-color-picker/angular-color-picker.js'])
            .pipe(gulp.dest(temp + 'frontend/libs/')),

		gulp.src(['node_modules/angular/angular.min.js',
				  'node_modules/angular-aria/angular-aria.min.js',
				  'node_modules/angular-animate/angular-animate.min.js',
				  'node_modules/angular-material/angular-material.js',
                  'node_modules/angular-route/angular-route.min.js',
                  'node_modules/angular-sanitize/angular-sanitize.min.js',
                  'node_modules/angular-messages/angular-messages.min.js'])
			.pipe(gulp.dest(temp + 'frontend/libs/angular/'))
	);
});

gulp.task("webpack", ['copyBuildStage'], function(callback) {
    // run webpack
    Webpack({
        entry : path.join(__dirname, temp, 'frontend', 'modules', 'main.js'),
        output : {
            path : path.join(__dirname, 'dist', 'client'),
            filename : 'app.js'
        },
        module: {
            loaders: [{
                loader: "babel-loader",
                test: /\.js$/,
                query : {
                    presets: ['es2015']
                },
                include: [
                    path.join(__dirname, temp, 'frontend'),
                ],
                exclude: [
                    path.join(__dirname, temp, 'frontend/libs'),
                ]
            }],
        },
        devtool : '#source-map',
    }, function(err, stats) {
        if(err) throw new Gutil.PluginError("webpack", err);
        Gutil.log("[webpack]", stats.toString());
        callback();
    });
});

gulp.task('indent', function(){
    gulp.src(['src/**/*.*', '!src/backend/node_modules/**'])
        .pipe(indent({
            tabs : false,
            amount : 4
        }))
        .pipe(gulp.dest('src/'));
});

gulp.task('watch', ['default'], function(){
	gulp.watch(['src/**/*.*'], ['copyToDist', 'clean:temp']);
})

gulp.task('default', function(cb){
	runSequence('clean', ['copyDependecies', 'clean:temp'], cb);
});
