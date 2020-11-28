const path = require("path");

// This is where we define the Inline magic.
// This loader will turn all .svg, .jpg and .png files
// into something that can be inlined in the final bundle
const fileRules = {
  test: /\.(svg|jpg|png)$/,
  use: [
    {
      loader: "url-loader",
      options: {
        // All files no matter what size
        limit: Infinity,
      },
    },
  ],
};

// Pretty standard babel configurations for modern react apps
const jsRules = {
  test: /\.tsx?$/,
  exclude: /node_modules/,
  use: {
    loader: "babel-loader",
    // babel config is in babel.config.js
  },
};

/**
 * We have two distinct bundles, this
 * covers the parent bundle.
 * In this context parent refers to the
 * top level, final, library consumer.
 *
 * This is what external users will consume and use.
 *
 */
module.exports = {
  entry: "./src/index.ts",
  mode: "development",
  devtool: "source-map",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
    library: "ibridge",
    libraryTarget: "umd",
    globalObject: "this",
  },

  resolve: { extensions: [".tsx", ".ts", ".js"] },

  module: {
    rules: [jsRules, fileRules],
  },
};
