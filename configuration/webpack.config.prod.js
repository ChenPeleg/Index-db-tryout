
const path = require('path');
const common = require('../webpack.config.common')
const merge = require('webpack-merge');

module.exports = merge(common, {
    mode: "production",
    output: {
        filename: "main.[contenthash].js",
        path: path.resolve(__dirname, '..', 'dist'),
        publicPath: '../dist'
    },



})