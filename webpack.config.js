var path = require('path');

module.exports = {
    entry: ['bootstrap-webpack', './fe/index.js'],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'fe', 'dist')
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js' // required to bundle vue with compiler so it can process templates
        }
    },
    module: {
        loaders: [
            // the url-loader uses DataUrls.
            // the file-loader emits files.
            // these are bunch of loaders for Bootstrap loading to work correctly
            { test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream' },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader' },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml' }
        ]
    }
};
