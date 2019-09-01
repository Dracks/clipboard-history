const base = require('./webpack.base');
const merge = require('webpack-merge');

module.exports = merge(base, {
    mode: 'development',

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    watch: true
});