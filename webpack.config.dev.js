let path = require('path');
let webpack = require('webpack');
let webpackMerge = require('webpack-merge');
const {AotPlugin} = require('@ngtools/webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const {CheckerPlugin} = require('awesome-typescript-loader');
var CompressionPlugin = require("compression-webpack-plugin");

let webpackConfig = {
    entry: {
        //  vendor: ['./src/vendor.ts'],  //./src/vendor.ts
        polyfills: './src/polyfills.ts',
        app: ['./src/main.hmr.ts']
    },
    resolve: {
        extensions: ['.ts', '.js', '.html'],
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '/bin/debug')
    },

    plugins: [
        // new webpack.optimize.UglifyJsPlugin({
        //     beautify: false,
        //     mangle: {
        //         screw_ie8: true,
        //         keep_fnames: true
        //     },
        //     compress: {
        //         warnings: false,
        //         screw_ie8: true
        //     },
        //     comments: false
        // }),
        new CheckerPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.dev.html',
            inject: false
        }),
        //复制静态资源文件
        new CopyWebpackPlugin([{
            from: 'src/assets',
            to: 'assets'
        }]),
        // new ExtractTextPlugin("styles.css"),
        new ExtractTextPlugin({
            filename: "styles.css", // ?[hash]-[chunkhash]-[contenthash]-[name] "@angularclass/hmr-loader",
            disable: false,
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            // name:"common",filename:"vendor.bundle.js"
            names: ['app', 'polyfills', 'manifest'],
            // names: ['app'],
            //   name:"manifest"
            // children: true,
            // async: true
            // , minChunks: Infinity,chunks:[]
        }),
        new NamedModulesPlugin(),
        new webpack.DllReferencePlugin({
            context: '.',
            manifest: require('./bin/debug/manifest/vendor-manifest-dev.json'),
            sourceType: 'var'
        })
    ],

    module: {
        rules: [
            {
                test: /\.ts$/,
                loaders: [
                    "@angularclass/hmr-loader",
                    "awesome-typescript-loader",
                    "angular2-router-loader",
                    "angular2-template-loader"
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file-loader?name=assets/[name].[hash].[ext]'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.css$/,
                loaders: ['to-string-loader', 'css-loader']
            },
            { test: /\.scss$/i, loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader']) },
            { test: /\.less$/i, loader: ExtractTextPlugin.extract(['css-loader', 'less-loader']) },

            {
                test: /\.html$/,
                loader: 'raw-loader'
            }
        ]
    }
    // ,
    // devServer: {
    //     contentBase: path.join(__dirname, "aot/"),
    //     compress: true,
    //     quiet: false,
    //     open: true,
    //     hot: true,
    //     inline: true,
    //     stats: 'errors-only', //errors-only normal minimal
    //     historyApiFallback: true,
    //     port: 9000,
    //     //     watchContentBase: true,
    //     // clientLogLevel: "error",
    //     // headers: {
    //     //     "Content-Encoding": "gzip"
    //     // }
    //     // ,
    //     // watchOptions: {
    //     //     aggregateTimeout: 300,
    //     //     poll: 1000
    //     // }
    // }
};
let defaultConfig = {
    output: {
        filename: '[name].bundle.js',
        sourceMapFilename: '[name].map',
        chunkFilename: '[id].chunk.js'
    },
    resolve: {
        extensions: ['.ts', '.js']
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

function root(__path = '.') {
    return path.join(__dirname, __path);
}

module.exports = webpackMerge(defaultConfig, webpackConfig);