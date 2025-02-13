const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development", // Mode development
  devtool: "inline-source-map", // Source map untuk debugging
  devServer: {
    static: "./dist", // Direktori untuk serve file
    port: 8080, // Port untuk development server
    open: true, // Otomatis membuka browser
    hot: true, // Hot Module Replacement
  },
});
