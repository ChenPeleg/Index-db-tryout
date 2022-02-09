const path = require('path')
module.exports = {
    entry: "./src/app.ts",
    output: {
        filename: "bundle.app.js",
        path: path.resolve(__dirname, 'assets', 'js')

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