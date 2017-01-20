import gulp from "gulp";
import rollup from "rollup-stream";
import babel from "rollup-plugin-babel";
import source from "vinyl-source-stream";
import rename from "gulp-rename";
import uglify from "gulp-uglify";
import sourcemaps from "gulp-sourcemaps";
import buffer from "vinyl-buffer";
import karma from "karma";
import fs from "fs";

const paths = {
  entry: "./src/main.js",
  dist: "./dist/",
  sourceFiles: "./src/**/*.js",
  sourcemaps: ".",
  testConfig: `${__dirname}/test/karma.conf.js`
};

const buildCaches = {};

const pkg = JSON.parse(fs.readFileSync("./package.json"));

function mapFile (filename) {
  return filename.replace(".js", "");
}

function bundle (options, type, minify) {
  const filename = `${pkg.name.toLowerCase()}${type.length ? `.${type}` : ""}${minify ? ".min" : ""}.js`;
  if (buildCaches[filename] != null) { options.cache = buildCaches[filename]; }
  options.entry = paths.entry;

  let b = rollup(options)
    .on("bundle", bundle => buildCaches[filename] = bundle) // cache bundle for re-bundles triggered by watch
    .pipe(source(paths.entry))
    .pipe(buffer())
    .pipe(rename(filename))
  if (minify) {
    b = b
    .pipe(uglify());
  } else {
    b = b
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write(paths.sourcemaps, { mapFile }));
  }
  return b.pipe(gulp.dest(paths.dist));
}

gulp.task("bundle:es6", function (done) {
  let options = { format: "es" };
  bundle(options, "es6");
  done();
});

gulp.task("bundle:cjs", function (done) {
  let options = {
    format: "cjs",
    plugins: [ babel() ]
  }
  bundle(options, "cjs", false);
  bundle(options, "cjs", true);
  done();
});

gulp.task("bundle:global", function (done) {
  let options = {
    format: "iife",
    moduleName: pkg.name,
    plugins: [ babel() ]
  };
  bundle(options, "", false);
  bundle(options, "", true);
  done();
});

gulp.task("watch", function () {
  // only rebundle the global module for testing
  gulp.watch(paths.sourceFiles, gulp.series("bundle:global"));
});

gulp.task("karma", function (done) {
  new karma.Server({ configFile: paths.testConfig }, function () { done(); }).start();
});


gulp.task("build", gulp.parallel("bundle:es6" ));
gulp.task("test", gulp.series("bundle:global", gulp.parallel("watch", "karma")));
