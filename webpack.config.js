const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

const CSS_MODULES_EXT = ".module.scss"

const config = {
    target: 'web',
    entry: {
        index: './src/index.ts',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        library: 'mask-field',
        libraryTarget: 'umd',
        globalObject: 'this',
        umdNamedDefine: true,
    },
    watchOptions: {
        aggregateTimeout: 600,
        ignored: /node_modules/,
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false,
            cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, 'dist')],
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
            chunkFilename: '[id].[contenthash].css',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: [/node_modules/, /__tests__/],
                use: [
                    {
                        loader: 'babel-loader',
                    },
                    {
                        loader: 'ts-loader',
                    },
                ],
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                    },
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            importLoaders: 1,
                            modules: {
                                auto: resourcePath => resourcePath.endsWith(CSS_MODULES_EXT),
                                mode: "local",
                            },
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            implementation: require("sass"),
                            sourceMap: true,
                        },
                    },
                    "import-glob-loader",
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    externals: {
        "react": "commonjs react",
        "react-dom": "commonjs react-dom",
    }
};

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        // * add some development rules here
    } else if (argv.mode === 'production') {
        // * add some prod rules here
    } else {
        throw new Error('Specify env');
    }

    return config;
};