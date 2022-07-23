const path = require("path");

module.exports = {
    name: "drag-drop-app",
    mode: 'development',
    entry: "./src/app.ts",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
        // publicPath: 'dist'
    },
    devServer: {
        static: {
            directory: path.join(__dirname, './'),
        },
        compress: true,
        // devMiddleware: {
        //     index: true,
        //     mimeTypes: { phtml: 'text/html' },
        //     publicPath: '/dist',
        //     serverSideRender: true,
        //     writeToDisk: false,
        // },
        port: 3000
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    }
};