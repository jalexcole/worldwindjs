const path = require("path");

module.exports = {
  entry: "./src/WorldWind.js",
  output: {
    filename: "WorldWind.js",
    path: path.resolve(__dirname, "dist"),
  },
};
