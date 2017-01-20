module.exports = function (config) {
  config.set({
    browsers: [ "PhantomJS" ],
    frameworks: [ "mocha", "chai" ],
    basePath: "../",
    files: [
      "dist/mizzy.js",
      "test/**/*.js"
    ],
    reporters: [ "mocha" ]
  });
};
