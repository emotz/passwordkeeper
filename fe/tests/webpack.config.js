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
            {
                enforce: "pre",
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "eslint-loader",
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: { presets: ['es2015'] }
            },
            { test: /\.vue$/, loader: 'vue-loader' },
            { test: /\.css$/, loader: 'null-loader' }
        ]
    },
    watch: false,
    watchOptions: {
        aggregateTimeout: 300,
        // poll: 1000,
        ignored: /node_modules/
    }
};
