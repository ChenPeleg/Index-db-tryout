const path = require('path')
module.exports = {
    mode: "production",
    entry: "./src/app.ts",
    output: {
        filename: "bundle.app.js",
        path: path.resolve(__dirname, 'assets', 'js'),
        publicPath: 'assets/js'

    },
    devtool: "(none)",
    devServer: {
        static: './',
        port: 8080
    },

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