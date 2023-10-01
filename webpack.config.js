const path = require("path");
//const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  //mode: "development",
  optimization: {
    minimize: false, // Disable minification
  },
  entry: "./src/WorldWind.js",
  output: {
    filename: "worldwind.min.js",
    path: path.resolve(__dirname, "build/dist"),
    assetModuleFilename: "images/[hash][ext][query]",
  },
  module: {
    rules: [
      {
        loader: "file-loader",
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        type: "asset/resource",
      },
    ],
  },
};
