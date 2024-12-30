const path = require("path");
//const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  //mode: "development",
  devtool: "inline-source-map",
  optimization: {
    minimize: false, // Disable minification
  },
  entry: "./src/WorldWind.js",
  output: {
    filename: "worldwind.min.js",
    path: path.resolve(__dirname, "build/dist"),
    assetModuleFilename: "images/[hash][ext][query]",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        // loader: "file-loader",
        use: "ts-loader",
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        type: "asset/resource",
      },
    ],
  },
};
