const webpack = require("webpack");
const FlowWebpackPlugin = require("flow-webpack-plugin");

module.exports = {
  context: process.cwd(),
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: "babel-loader"
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new FlowWebpackPlugin()
  ]
};
