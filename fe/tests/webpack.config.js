const path = require('path');

module.exports = {
    entry: ['./test_index.js'],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'cheap-module-source-map',
    resolve: {
        alias: {
            'src': path.resolve(__dirname, '..', 'src'),
            'vue$': 'vue/dist/vue.esm.js', // required to bundle vue with compiler so it can process templates
            'nprogress.css$': path.resolve(__dirname, 'dummy.css'),
            'toastr.css$': path.resolve(__dirname, 'dummy.css'),
        }
    },
    module: {
        loaders: [
            { test: /\.vue$/, loader: 'vue-loader' },
            { test: /\.css$/, loader: 'null-loader' },
            { test: /\.js$/, loader: 'babel-loader', exclude: [/node_modules/], options: { presets: ['es2015'] } } // babel is required for proper inject-loader work
        ]
    },
    watch: false,
    watchOptions: {
        aggregateTimeout: 300,
        // poll: 1000,
        ignored: /node_modules/
    }
};
