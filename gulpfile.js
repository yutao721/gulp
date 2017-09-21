var gulp = require('gulp');
var sass = require('gulp-sass');
var base64 = require('gulp-base64');	//插件，将图片换为base64的
var autoprefixer = require('gulp-autoprefixer'); // 作用：样式文件的兼容
var px2rem = require('gulp-px2rem-plugin');//px转rem

//编译sass
gulp.task('sass', function() {
    return gulp.src( './sass/style.scss')
        //outputStyle:expanded,compact,nested,compressed四种模式
        //compressed已经是压缩合并过的
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(base64({
            extensions: ['svg', 'png', /\.jpg#datauri$/i],
            exclude:    [/\.server\.(com|net)\/dynamic\//, '--live.jpg'],
            maxImageSize: 8*1024, // bytes
            debug: true
        }))
        .pipe(gulp.dest('./sass'));
});


//css兼容性
gulp.task('prefixer', ['sass'], function() {
    return gulp.src('./sass/style.css')
        .pipe(autoprefixer({
            browsers: ['ie >= 8', 'Android >= 4.0', 'ios > 7'],
            remove: true,
            cascade: false
        }))
        .pipe(gulp.dest('./sass/'));
});

gulp.task('px2rem',function(){
    gulp.src('./sass/style.css')
        .pipe(px2rem({'width_design':750,'valid_num':6,'pieces':10,'ignore_px':[1,2],'ignore_selector':['.class1']}))
        .pipe(gulp.dest('./dist/'));
})


//定义一个工作，监听
gulp.task("watch",function(){
     gulp.watch( 'sass/**/*', ['prefixer', 'sass','px2rem']);
});
