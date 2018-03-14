const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const merge = require("webpack-merge");
const nodeExternals = require("webpack-node-externals");

const common = require("./webpack.config.common");

module.exports = merge(common, {
  context: process.cwd(),
  target: "node",
  externals: [nodeExternals()],
  entry: "./src/server",
  output: {
    path: path.resolve("lib"),
    filename: "server/index.js",
  }
});
