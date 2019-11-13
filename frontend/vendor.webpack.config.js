/*eslint-env node */
const webpack = require('webpack');
const path = require('path');
// TODO: https://github.com/emotz/passwordkeeper/issues/81
// const BabiliPlugin = require("babili-webpack-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const isDev = process.env.NODE_ENV !== 'production';
const plugins = [
  new VueLoaderPlugin(),
  new webpack.DllPlugin({
    name: 'vendor_lib',
    path: 'dist/vendor-manifest.json',
  }),
  // for proper bootstrap loading
  new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery"
  })
];
if (!isDev) {
  // TODO: https://github.com/emotz/passwordkeeper/issues/81
  // plugins.push(new BabiliPlugin());
}

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: {
    vendor: [
      'vue',
      'vue-resource',
      'vue-router',
      'vue-i18n',
      'vue-bootstrap-modal',
      'vuex',
      'jquery',
      'bootstrap',
      'bootstrap.css',
      'toastr',
      'toastr.css',
      'nprogress',
      'nprogress.css',
      'lodash'
    ],
  },
  output: {
    filename: 'vendor.bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'vendor_lib',
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.runtime.js',
      'toastr.css$': 'toastr/build/toastr.min.css',
      'bootstrap.css$': 'bootstrap/dist/css/bootstrap.min.css',
      'nprogress.css$': 'nprogress/nprogress.css'
    }
  },
  plugins,
  module: {
    rules: [
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
  }
};
