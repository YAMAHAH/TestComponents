var webpack = require('webpack');
var path = require('path');
var webpackMerge = require('webpack-merge');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CompressionPlugin = require("compression-webpack-plugin");
var ngtools = require('@ngtools/webpack');
var CopyWebpackPlugin = require("copy-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var webpackConfig = {
    entry: {
        polyfills: './src/polyfills.ts',
        app: './src/main.ts',
    },
    output: {
        publicPath: '/',
        path: path.resolve(__dirname, './bin/release'),
    },
    devtool: "source-map",
    plugins: [
        new ngtools.AngularCompilerPlugin({
            tsConfigPath: path.resolve(__dirname, './ts-aot.json'),
            skipMetadataEmit: false,
            entryModule: path.resolve(__dirname, './src/app/app.module#AppModule'),

            compilerOptions: {
                emitDecoratorMetadata: true,
                experimentalDecorators: true,
                sourceMap: true
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['app', 'polyfills'],
            minChunks: 2,
            children: true,
            async: true
        }),


        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            minify: {
                removeComments: false,
                collapseWihitespace: true,
                minifyJS: false
            },
            inject: true,
            chunksSortMode: 'dependency',
            favicon: "./favicon.ico",
            chunksSortMode: (a, b) => {
                //A位于B前返负数，A位于B返正数，相等返0
                //按ID从大到小排序 a.id - b.id => asc  b.id - a.id =>desc
                return b.id - a.id;
            }
        }),
        new CompressionPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.html$/
        }),
        new ExtractTextPlugin({
            filename: "styles.css", // ?[hash]-[chunkhash]-[contenthash]-[name] "@angularclass/hmr-loader",
            disable: false,
            allChunks: true
        }),
        new webpack.optimize.UglifyJsPlugin({ minimize: false }),
        new CopyWebpackPlugin([{
            from: 'src/assets',
            to: 'assets'
        }])
    ],
    module: {
        rules: [{
                test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
                use: ['@ngtools/webpack']
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'to-string-loader' },
                    { loader: 'css-loader' }
                ]
            },

            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.html$/,
                use: [{
                    loader: "raw-loader"
                }]
            },
            {
                test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        mimetype: "application/font-woff",
                        fallback: 'file-loader'
                    }
                }]
            },
            {
                test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        mimetype: "application/font-woff",
                        fallback: 'file-loader'
                    }
                }]
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        mimetype: "application/octet-stream",
                        fallback: 'file-loader'
                    }
                }]
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        outputPath: 'assets/images/'
                    }
                }]
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        mimetype: "image/svg+xml"
                    }
                }]
            },
            {
                test: /\.(jpg|jpeg|bmp|png|gif)$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        outputPath: 'assets/images/'
                    }
                }]
            },
        ]
    }
};

var defaultConfig = {
    devtool: 'inline-source-map',
    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[id].chunk.js'
    },
    resolve: {
        extensions: ['.ts', '.js'],
        modules: [path.resolve(__dirname, 'node_modules')]
    },
    devServer: {
        contentBase: './',
        port: 3000,
        inline: true,
        stats: 'errors-only',
        historyApiFallback: true,
        watchOptions: { aggregateTimeout: 100, poll: 500 }
    },
    node: {
        global: true,
        crypto: 'empty',
        __dirname: true,
        __filename: true,
        Buffer: false,
        clearImmediate: false,
        setImmediate: false
    }
};

module.exports = webpackMerge(defaultConfig, webpackConfig);