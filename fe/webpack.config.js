let path = require('path');
let webpack = require('webpack');
let CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: ['font-awesome-webpack', './src/index.js'],
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
    devtool: 'cheap-module-eval-source-map',
    plugins: [
        // for proper bootstrap loading
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'development'
        }),
        new CopyWebpackPlugin([
            { from: 'src/index.html' },
            { from: 'src/index.css' }
        ])
    ],
    watch: false,
    watchOptions: {
        aggregateTimeout: 300,
        // poll: 1000,
        ignored: /node_modules/
    },
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
