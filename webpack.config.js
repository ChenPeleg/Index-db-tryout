const path = require('path')
module.exports = {
    entry: "./src/app.ts",
    output: {
        filename: "bundle.app.js",
        path: path.resolve(__dirname, 'assets', 'js')

    }
}