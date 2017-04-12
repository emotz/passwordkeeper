/*eslint-env node */
const webpack = require('webpack');
const path = require('path');
const BabiliPlugin = require("babili-webpack-plugin");

const isDev = process.env.NODE_ENV !== 'production';
const plugins = [
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
    plugins.push(new BabiliPlugin());
}

module.exports = {
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
            'font-awesome-webpack',
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
            'vue$': 'vue/dist/vue.esm.js', // required to bundle vue with compiler so it can process templates
            'toastr.css$': 'toastr/build/toastr.min.css',
            'bootstrap.css$': 'bootstrap/dist/css/bootstrap.min.css',
            'nprogress.css$': 'nprogress/nprogress.css'
        }
    },
    plugins,
    module: {
        loaders: [
            // the url-loader uses DataUrls. 
            // the file-loader emits files. 
            // for font-awesome
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
            { test: /\.vue$/, loader: 'vue-loader' },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] }
        ]
    }
};