const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',

    watch: true,
    watchOptions: {
        ignored: /node_modules/,
        aggregateTimeout: 300,
        poll: 3000
    },

    entry: {
        'wc-poster': path.join(__dirname, 'src/ts/main.ts'),
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
            template: path.join(__dirname, 'src/html/index.html'),
        }),
    ],
    resolve: {
        extensions: [
            '.ts',
            '.js',
        ],
    },

    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
            watch: true,
        },
        compress: true,
        port: 9876,
        client: {
            overlay: {
                errors: true,
                warnings: false,
            },
            progress: true,
        },
        // hot: true,
        liveReload: true,
        open: true,
        watchFiles: {
            paths: [
                "src/**/*",
                "dist/**/*",
            ],
            options: {
                usePolling: false,
            },
        },
    }
};
