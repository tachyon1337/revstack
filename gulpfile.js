
var gulp=require('gulp'),
    gulputil=require('gulp-util'),
    path=require('path'),
    fs = require('fs-extra'),
    concat=require('gulp-concat'),
    http = require('http'),
    ecstatic = require('ecstatic'),
    uglify = require('gulp-uglify'),
    distPath='./dist',
    devPath='./dev',
    buildPath='./build';


gulp.task('default',function(){
    console.log('welcome to revstack!');
});

gulp.task('build',function(){
    concatJS();
    minifyJS();
});

gulp.task('dev',function(){
    if (!fs.existsSync(devPath)) {
        initDevDirectory();
    }
    DevProject();
    startServer({
        port:9000,
        path:'/dev'
    });
});


function getRevstackStream(){
    return gulp.src(['./node_modules/async/lib/async.js','./node_modules/lodash/dist/lodash.js',
        './lib/constructor.js','./lib/crypto/base64.js','./lib/http/http.js','./lib/functions.js',
        './lib/account.js','./lib/app.js','./lib/datastore.js','./lib/log.js','./lib/membership.js',
        './lib/messaging.js','./lib/role.js','./lib/user.js'
        ])
}

function initDevDirectory(){
    fs.mkdirsSync(devPath);
    fs.copySync(buildPath + '/dev/index.html', devPath + '/index.html');
}

function DevProject(){
    fs.copySync(distPath + '/revstack.js', devPath + '/revstack.js');
    fs.copySync(distPath + '/revstack.min.js', devPath + '/revstack.min.js');
    fs.copySync('./node_modules/jquery/dist/jquery.js', devPath + '/jquery.js');

}

function concatJS(){
    return getRevstackStream()
        .pipe(concat('revstack.js'))
        .pipe(gulp.dest(distPath));
}

function minifyJS(){
    return getRevstackStream()
        .pipe(concat('revstack.min.js'))
        .pipe(uglify({outSourceMap: false}))
        .pipe(gulp.dest(distPath));
}

function startServer(opts) {
    http.createServer(
        ecstatic({ root: __dirname + opts.path })
    ).listen(opts.port);
}