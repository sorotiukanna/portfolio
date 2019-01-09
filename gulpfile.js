var gulp = require('gulp'), //-----------------------------------Подключаем Gulp
  sass = require('gulp-sass'), //--------------------------------Подключаем Sass пакет,
  sassGlob = require('gulp-sass-glob'), //-----------------------Импорт файлов по маске ввода
  browserSync = require('browser-sync'), //----------------------Подключаем Browser Sync
  concat = require('gulp-concat'), //----------------------------Подключаем gulp-concat (для конкатенации файлов)
  cssnano = require('gulp-cssnano'), // -------------------------Подключаем пакет для минификации CSS
  rename = require('gulp-rename'), // ---------------------------Подключаем библиотеку для переименования файлов
  uglify = require('gulp-uglify'), // ---------------------------Подключаем gulp-uglifyjs (для сжатия JS)
  del = require('del'), // --------------------------------------Подключаем библиотеку для удаления файлов и папок
  cache = require('gulp-cache'), // -----------------------------Подключаем библиотеку кеширования
  autoprefixer = require('gulp-autoprefixer'), //----------------Подключаем библиотеку для автоматического добавления префиксов
  flatten = require('gulp-flatten'), //--------------------------Очистка путей конвертируемых файлов
  sourcemaps = require('gulp-sourcemaps'); //--------------------Карта sourcemaps



//компиляция scss в css

gulp.task('sass', function() {
  return gulp.src('app/sass/main.scss')

    .pipe(sourcemaps.init()) //----------------------------------Преобразуем scss в css              
    .pipe(sassGlob()) //-----------------------------------------Импорт файлов по маске ввода
    .pipe(sass({

    }))

    .pipe(autoprefixer(['last 15 versions'], { //----------------Создаем префиксы в css
      cascade: true
    }))

    .pipe(flatten()) //------------------------------------------Удалить относительные пути к файлам

    .pipe(sourcemaps.write('../maps')) //------------------------Вывести в отладчик стили из scss

    .pipe(gulp.dest('app/css/')) //------------------------------Выгрузить обработанные css файлы 

    .pipe(browserSync.reload({ //--------------------------------Обновить отображение сайта в браузере
      stream: true
    }))
});


//автоматическая перезагрузка браузера после изменения файлов
// Создаем таск browser-sync

gulp.task('browser-sync', function() {
  browserSync({ //------------------------------------------------Выполняем browserSync
    server: { //--------------------------------------------------Определяем параметры сервера
      baseDir: 'app' //-------------------------------------------Указываем корневую директорию для сервера 
    },
    notify: false //----------------------------------------------Отключаем уведомления
  });
});


//Конкатенация и сжатие js файлов библиотек

gulp.task('scripts', function() {
  return gulp.src([ //--------------------------------------------Берем все необходимые библиотеки
      'app/libs/**/*.js'

    ])
    .pipe(concat('libs.min.js')) //-------------------------------Собираем их  в новом файле libs.min.js
    .pipe(uglify())
    .pipe(gulp.dest('app/js')); //--------------------------------Выгружаем в папку app/js
});


//Конкатенация и сжатие css файлов библиотек 
gulp.task('css-libs', function() {
  return gulp.src('app/libs/*.css') //----------------------------Выбираем файл для минификации
    .pipe(concat('libs.min.css'))
    .pipe(cssnano())

    .pipe(gulp.dest('app/css')); //-------------------------------Выгружаем в папку app/css
});


//  Слежение за изменениями файлов
gulp.task('watch', ['browser-sync', 'css-libs', 'sass', 'scripts'], function() {
  gulp.watch('app/**/*.scss', function(event, cb) {
    setTimeout(function(){gulp.start('sass');},500) // задача выполниться через 500 миллисекунд и файл успеет сохраниться на диске
}); // Наблюдение за sass файлами в папке sass //------------------Наблюдение за sass файлами в папке sass
  gulp.watch('app/*.html', browserSync.reload); //----------------Наблюдение за HTML файлами в корне проекта
  gulp.watch('app/**/*.js', browserSync.reload); //---------------Наблюдение за js файлами в корне проекта
});


// Очистка папки dist перед сборкой
gulp.task('clean', function() {
  return del.sync('dist');
});

//Выгрузка в продакшен



gulp.task('build', ['clean', 'sass', 'css-libs', 'scripts'], function() {

  var buildCss = gulp.src([ //------------------------------------Переносим библиотеки и файл стилей в продакшен
      'app/css/main.css',
      'app/css/libs.min.css'
    ])
    .pipe(gulp.dest('dist/css'))

  var buildFonts = gulp.src('app/fonts/**/*') //------------------Переносим шрифты в продакшен
    .pipe(gulp.dest('dist/fonts'))

  var buildImg = gulp.src('app/img/**/*') //----------------------Переносим картинки в продакшен
    .pipe(gulp.dest('dist/img'))

  var buildJs = gulp.src('app/js/**/*') //------------------------Переносим скрипты в продакшен
    .pipe(gulp.dest('dist/js'))

  var buildHtml = gulp.src('app/**/*.html') //--------------------Переносим HTML в продакшен
    .pipe(gulp.dest('dist'));

});

gulp.task('clear', function() {
  return cache.clearAll(); //-------------------------------------Очистка кеш
})

gulp.task('default', ['watch']);