const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const merge = require("webpack-merge");

const common = require("./webpack.config.common");

module.exports = merge(common, {
  context: process.cwd(),
  devtool: "sourcemap",
  entry: "./src/client",
  output: {
    path: path.resolve("dist"),
    filename: "client.js",
  },
  module: {
    rules: [
      {
        test: /\.worker.js$/,
        use: [
          {
            loader: "babel-loader"
          },
          {
            loader: "worker-loader",
            options: {
              name: "[hash].worker.js"
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              minimize: true,
              modules: true,
              localIdentName: "[name]__[local]--[hash:base64:5]",
              camelCase: true,
            }
          },
          "postcss-loader"
        ]
      }
    ]
  },
  plugins: [
    new webpack.DllReferencePlugin({
      manifest: require(path.resolve("./dist/vendor/react.json"))
    }),
    new webpack.DllReferencePlugin({
      manifest: require(path.resolve("./dist/vendor/three.json"))
    }),
    new webpack.DllReferencePlugin({
      manifest: require(path.resolve("./dist/vendor/p2.json"))
    }),
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    hot: true,
    stats: "minimal",
    publicPath: "/",
    port: 3001
  },
});
