/*eslint-env node */
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  mode: 'development',
  entry: ['./test/test-index.js'],
  output: {
    filename: 'test.bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'cheap-module-source-map',
  resolve: {
    alias: {
      'src': path.resolve(__dirname, 'src'),
      'vue$': 'vue/dist/vue.esm.js', // need to include vue compiler
      'nprogress.css$': path.resolve(__dirname, 'dummy.css'),
      'toastr.css$': path.resolve(__dirname, 'dummy.css'),
    }
  },
  plugins: [
    new VueLoaderPlugin()
  ],
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      { test: /\.vue$/, loader: 'vue-loader' },
      { test: /\.css$/, loader: 'null-loader' }
    ]
  },
  watch: false,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: /node_modules/
  }
};
