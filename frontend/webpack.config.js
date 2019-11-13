/*eslint-env node */
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
// const BabiliPlugin = require("babili-webpack-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDev = process.env.NODE_ENV !== 'production';
const plugins = [
  new VueLoaderPlugin(),
  // for proper bootstrap loading (and vue)
  new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery"
  }),

  new webpack.EnvironmentPlugin({
    NODE_ENV: process.env.NODE_ENV || 'development'
  }),
  new CopyWebpackPlugin([
    { from: 'src/style.css' }
  ]),
  new HtmlWebpackPlugin({
    template: 'src/index.html'
  }),
  new LiveReloadPlugin({
    port: 35729
  }),
];
// if (!isDev) {
//   plugins.push(new BabiliPlugin());
// }

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: ['babel-polyfill', './src/index.js'],
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    alias: {
      'src': path.resolve(__dirname, 'src'),
      'vue$': 'vue/dist/vue.runtime.js',
      'toastr.css$': 'toastr/build/toastr.min.css',
      'bootstrap.css$': 'bootstrap/dist/css/bootstrap.min.css',
      'nprogress.css$': 'nprogress/nprogress.css'
    }
  },
  devtool: isDev ? 'cheap-module-eval-source-map' : false,
  plugins,
  watch: false,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: /node_modules/
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        // Limiting the size of the woff fonts breaks font-awesome ONLY for the extract text plugin
        // loader: "url?limit=10000"
        loader: "url-loader"
      },
      {
        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        loader: 'file-loader'
      },
      { test: /\.vue$/, loader: 'vue-loader' },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  }
};
