const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const path = require('path')
module.exports = {
    mode: "production",
    entry: "./src/app.ts",
    output: {
        filename: "[contenthash].js",
        path: path.resolve(__dirname, '..', 'dist'),
        publicPath: '../dist'

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
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ]
    }
}