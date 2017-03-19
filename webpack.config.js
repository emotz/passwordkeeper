var path = require('path');

module.exports = {
    entry: path.resolve(__dirname, 'fe', 'index.js'),
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'fe', 'dist')
    }
};
