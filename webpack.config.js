const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'production',

    entry: {
        'wc-poster': './src/ts/main.ts',
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
                options: {
                    minimize: true,
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/html/index.html"
        }),
    ],
    resolve: {
        extensions: [
            '.ts',
            '.js',
        ],
    },
};
