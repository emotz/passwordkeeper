var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: ['./fe/index.js'],
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
    ]
};
