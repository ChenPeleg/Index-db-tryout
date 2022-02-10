const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const path = require('path')
module.exports = {
    mode: "development",
    entry: "../src/app.ts",
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist'

    },
    devtool: "eval-cheap-module-source-map",
    devServer: {
        static: {
            directory: path.join(__dirname),
        },
        compress: true,
        port: 9000,
        devMiddleware: {
            writeToDisk: true,
        },

        writeToDisk: true
    },
    plugins: [
        new CleanWebpackPlugin()
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
            }
        ]
    }
}