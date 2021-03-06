import gulp from 'gulp';
import config from '../config';
import sass from 'gulp-sass';
import plumber from 'gulp-plumber';
import gulpif from 'gulp-if';
import size from 'gulp-size';
import stylelint from 'stylelint';
import postcss from 'gulp-postcss';
import syntaxScss from 'postcss-scss';
import reporter from 'postcss-reporter';
import browser from './browser';
import notify from 'gulp-notify';
import header from 'gulp-header';
import minify from 'gulp-clean-css';
import rename from 'gulp-rename';

// Skins
// ------------------
// Compiles sass into css & minifies it (production)
gulp.task('skins', () => {
  return gulp
    .src(`${config.skins.source}/*.scss`)
    .pipe(
      plumber({errorHandler: notify.onError('Error: <%= error.message %>')})
    )
    .pipe(
      sass({
        precision: 10, // https://github.com/sass/sass/issues/1122
        includePaths: config.skins.include,
      })
    )
    .pipe(postcss())
    .pipe(gulpif(config.production, header(config.banner)))
    .pipe(size({gzip: true, showFiles: true}))
    .pipe(gulp.dest(`${config.skins.build}`))
    .pipe(minify())
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(size({gzip: true, showFiles: true}))
    .pipe(gulp.dest(`${config.skins.build}`))
    .pipe(browser.stream())
    .pipe(
      gulpif(
        config.enable.notify,
        notify({
          title: config.notify.title,
          message: 'Skins task complete',
          onLast: true,
        })
      )
    );
});