/*eslint-env node */
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const BabiliPlugin = require("babili-webpack-plugin");

const isDev = process.env.NODE_ENV !== 'production';
const plugins = [
    // for proper bootstrap loading (and vue)
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
    }),

    new webpack.EnvironmentPlugin({
        NODE_ENV: process.env.NODE_ENV || 'development'
    }),
    new CopyWebpackPlugin([
        { from: 'src/index.html' },
        { from: 'src/style.css' }
    ]),
    new LiveReloadPlugin({
        port: 35729
    }),
    new webpack.DllReferencePlugin({
        context: '.',
        manifest: require('./dist/vendor-manifest.json')
    })
];
if (!isDev) {
    plugins.push(new BabiliPlugin());
}

module.exports = {
    entry: ['./src/index.js'],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        alias: {
            'src': path.resolve(__dirname, 'src'),
            'vue$': 'vue/dist/vue.esm.js', // required to bundle vue with compiler so it can process templates
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
        loaders: [
            // the url-loader uses DataUrls. 
            // the file-loader emits files. 
            // for font-awesome
            { test: /\.(woff2?|ttf|eot|svg)$/, loader: 'url-loader' },
            {
                test: /\.vue$/,
                exclude: /node_modules/,
                loader: 'vue-loader',
                options: {
                    preLoaders: {
                        js: 'eslint-loader'
                    }
                }
            },
            {
                test: /\.vue$/,
                include: /node_modules/,
                loader: 'vue-loader'
            },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            {
                enforce: "pre",
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "eslint-loader"
            },
        ]
    }
};
