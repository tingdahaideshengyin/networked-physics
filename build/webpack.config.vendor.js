const path = require("path");
const webpack = require("webpack");

module.exports = {
  context: process.cwd(),
  entry: {
    react: [
      "react",
      "react-dom",
    ],
    three: [
      "three",
    ],
    p2: [
      "p2/build/p2.js",
    ],
  },
  output: {
    filename: "[name].dll.js",
    path: path.resolve("dist/vendor"),
    library: "[name]"
  },
  plugins: [
    new webpack.DllPlugin({
      name: "[name]",
      path: "dist/vendor/[name].json"
    })
  ]
};