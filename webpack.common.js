const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/main.js", // Entry point aplikasi
  output: {
    filename: "bundle.js", // Nama file output
    path: path.resolve(__dirname, "dist"), // Direktori output
    clean: true, // Membersihkan folder 'dist' sebelum build
  },
  module: {
    rules: [
      {
        test: /\.css$/, // Aturan untuk file CSS
        use: ["style-loader", "css-loader"], // Loaders untuk menangani CSS
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html", // Template HTML
    }),
  ],
};
