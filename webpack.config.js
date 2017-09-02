let path = require('path');
let webpack = require('webpack');
let webpackMerge = require('webpack-merge');
const AotPlugin = require('@ngtools/webpack').AotPlugin;
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
// let extractCSS = new ExtractTextPlugin('css/[name].css');
// let extractLESS = new ExtractTextPlugin('css/[name].less');
var CompressionPlugin = require("compression-webpack-plugin");
const {
    ContextReplacementPlugin,
    HotModuleReplacementPlugin,
    DefinePlugin,
    ProgressPlugin,
    DllPlugin
} = require('webpack');

let webpackConfig = {
    entry: {
        vendor: ['./src/vendor.prod.ts'],
        polyfills: './src/polyfills.ts',
        app: './src/main.ts',
    },
    resolve: {
        extensions: ['.ts', '.js', '.html'],
    },
    output: {
        filename: '[name].[chunkhash].bundle.js',
        path: path.resolve(__dirname, './bin/release')
    },

    plugins: [
        new AotPlugin({
            tsConfigPath: './ts-aot.json',
            basePath: process.cwd(),
            entryModule: 'src/app/app.module#AppModule'
        }),
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            mangle: {
                screw_ie8: true,
                keep_fnames: true
            },
            compress: {
                warnings: false,
                screw_ie8: true
            },
            comments: false
        }),
        new CompressionPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.html$/,
            threshold: 0,
            minRatio: 0.8
        }),
        new HtmlWebpackPlugin({
            // filename: 'index.html',
            template: 'index.html',
            inject: "body",
            chunksSortMode: (a, b) => {
                //A位于B前返负数，A位于B返正数，相等返0
                //按ID从大到小排序 a.id - b.id => asc  b.id - a.id =>desc
                return b.id - a.id;
                //按名称从小到大排序 a 
                // if (a.names[0] > b.names[0]) {
                //     return 1;
                // }
                // if (a.names[0] < b.names[0]) {
                //     return -1;
                // }
                // return 0;
            }
        }),
        //复制静态资源文件
        new CopyWebpackPlugin([{
            from: 'src/assets',
            to: 'assets'
        }]),
        new ExtractTextPlugin({
            filename: "styles.css", // ?[hash]-[chunkhash]-[contenthash]-[name]
            disable: false,
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['app', 'polyfills', 'vendor'],
            // children: true,async:true
        })
    ],

    module: {
        rules: [{
            test: /\.ts$/,
            loaders: [
                '@ngtools/webpack'
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
        //  {
        //     test: /\.js$/,
        //     loader: 'string-replace-loader',
        //     query: {
        //         search: 'chunk.js',
        //         replace: 'chunk.js.gz',
        //         flags: 'g'
        //     }
        // },
        // {
        //     test: /\.css$/,
        //     loader: ExtractTextPlugin.extract(
        //         {
        //             notExtractLoader: "style-loader",
        //             loader: "css-loader"
        //             // publicPath: "../"
        //         })
        // },
        // {
        //     test: /\.css$/,
        //     exclude: /node_modules/,
        //     loader: ExtractTextPlugin.extract({
        //         loader: ['style-loader', 'css-loader']
        //     })
        // },
        {
            test: /\.css$/,
            loaders: ['to-string-loader', 'css-loader']
        },
        // {
        //     test: /\.css$/, loader: ExtractTextPlugin.extract({
        //         loader: ['to-string-loader', 'css-loader']
        //     })
        // },
        // {
        //     test: /\.css$/, loader: ExtractTextPlugin.extract({
        //         fallbackLoader: "style-loader",
        //         loader: ['to-string-loader', 'css-loader']
        //     })
        // },
        { test: /\.scss$/i, loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader']) },
        { test: /\.less$/i, loader: ExtractTextPlugin.extract(['css-loader', 'less-loader']) },

        // {
        //     test: /\.scss$/,
        //     loader: "style-loader!css-loader!sass-loader"
        // },
        // {
        //     test: /\.less$/,
        //     loader: "style-loader!css-loader!less-loader"
        // },
        // {
        //     test: /\.css$/i,
        //     loader: ExtractTextPlugin.extract({
        //         fallbackLoader: "style-loader",
        //         loader: "css-loader"
        //     })
        // },

        {
            test: /\.html$/,
            loader: 'raw-loader'
        }
        ]
    }

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

module.exports = webpackMerge(defaultConfig, webpackConfig);