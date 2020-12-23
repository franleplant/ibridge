// Main wrapper for distribution,
// consumers will need to setup process.env.NODE_ENV
// to be production for them to use the prod minified version
if (process.env.NODE_ENV === "production") {
  module.exports = require("./dist/index.production.min.js");
} else {
  module.exports = require("./dist/index.development.js");
}
