const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path')
module.exports = {
    mode: "development",
    entry: "./src/app.ts",
    output: {
        filename: "main.[contenthash].js",
        path: path.resolve(__dirname, 'build'),
        publicPath: './'

    },
    devtool: "eval-cheap-module-source-map",
    devServer: {
        static: {
            directory: path.join(__dirname, 'build'),
        },
        compress: true,
        port: 9000,
        open: true,

        devMiddleware: {
            writeToDisk: true,
        },

        //  writeToDisk: true
    },
    plugins: [
        new CleanWebpackPlugin(), new HtmlWebpackPlugin({
            template: './src/template.html'
        })
    ],


    // file resolutions
    resolve: {
        extensions: ['.ts', '.js'],
    },

    // loaders
    module: {
        rules: [
            {
                test: /\.tsx?/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/i,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
        ]
    }
}