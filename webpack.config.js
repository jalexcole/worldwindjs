const path = require("path");

module.exports = {
  entry: "./src/WorldWind.js",
  output: {
    filename: "worldwind.min.js",
      path: path.resolve(__dirname, "build/dist"),
    assetModuleFilename: 'images/[hash][ext][query]'
  },
  module: {
    rules: [
      {
        loader: "file-loader",
        test: /\.(png|jpg|gif)$/,
        type: "images",
      },
    ],
  },
};
