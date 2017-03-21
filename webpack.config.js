var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: ['font-awesome-webpack', './fe/src/index.js'],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'fe', 'dist')
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js' // required to bundle vue with compiler so it can process templates
        }
    },
    plugins: [
        // for proper bootstrap loading
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ],
    module: {
        loaders: [
            // the url-loader uses DataUrls. 
            // the file-loader emits files. 
            // for font-awesome
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
            { test: /\.vue$/, loader: 'vue-loader' }
        ]
    }
};
