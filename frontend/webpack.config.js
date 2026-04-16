const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './src/app.js',
    mode: 'development',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    devServer: {
        static: {
            directory: path.join(__dirname, "dist"),
        },
        compress: true,
        port: 9000,
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    "style-loader",
                    "css-loader"
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html"
        }),
        new CopyPlugin({
            patterns: [
                { from: "./src/templates", to: "templates" },
                { from: "./src/static/images", to: "images" },
                { from: "./node_modules/bootstrap/dist/css/bootstrap.min.css", to: "css" },
                { from: "./node_modules/bootstrap-icons/font/bootstrap-icons.min.css", to: "css" },
                { from: "./node_modules/bootstrap-icons/font/fonts", to: "css/fonts" },
                { from: "./node_modules/bootstrap/dist/js/bootstrap.min.js", to: "js" },
                { from: "./node_modules/chart.js/dist/chart.umd.js", to: "js" },
                { from: "./src/scripts/main-chart.js", to: "js" },
            ],
        }),
    ]
}