const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: {
    main: './app/scripts/main.js',
    callback: './app/scripts/oauth-send-back.js',
  },
  devtool: 'source-map',
  devServer: {
    contentBase: './dist',
    port: 8005,
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './app/index.html',
      chunks: ['main'],
      minify: {
        collapseWhitespace: true,
        preserveLineBreaks: true,
        preserveLineBreaks: false,
        minifyCSS: true,
      },
    }),
    new HtmlWebpackPlugin({
      filename: 'es/index.html',
      template: './app/es/index.html',
      chunks: ['main'],
      minify: {
        collapseWhitespace: true,
        preserveLineBreaks: true,
        preserveLineBreaks: false,
        minifyCSS: true,
      },
    }),
    new HtmlWebpackPlugin({
      filename: 'callback.html',
      template: './app/callback.html',
      chunks: ['callback'],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].css',
    }),
  ],
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif|ico)$/,
        loader: 'file-loader?name=[name].[ext]',
      },
    ],
  },
  mode: 'development',
};
