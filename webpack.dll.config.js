var path = require("path");
var webpack = require('webpack');
// const AotPlugin = require('@ngtools/webpack').AotPlugin;
var assetsPluginInstance = require('./assetsPlugin')
const {CheckerPlugin} = require('awesome-typescript-loader');
// var deps = require('./package.json').dependencies;
// delete deps['mobx-react-devtools'];

var config = {
    name: "vendor",
    entry: {
        vendor: ['./src/vendor.ts'],
        polyfillsa: ['./src/polyfills.ts']
    },
    output: {
        path: path.join(__dirname, "bin/debug"),
        filename: "[name].bundle.js",
        library: "[name]_[hash]", //和DllPlugin的name对应
        libraryTarget: "var"
    },
    module: {
        loaders: [
            //  fix angular2
            {
                test: /(systemjs_component_resolver|system_js_ng_module_factory_loader)\.js$/,
                loader: 'string-replace-loader',
                query: {
                    search: '(lang_1(.*[\\n\\r]\\s*\\.|\\.))?' +
                    '(global(.*[\\n\\r]\\s*\\.|\\.))?' +
                    '(System|SystemJS)(.*[\\n\\r]\\s*\\.|\\.)import\\((.+)\\)',
                    replace: '$5.import($7)',
                    flags: 'g'
                },
                include: [root('node_modules/@angular/core')]
            },
            {
                test: /\.js$/,
                loader: 'string-replace-loader',
                query: {
                    search: 'moduleId: module.id,',
                    replace: '',
                    flags: 'g'
                }
            },
            // end angular2 fix
            {
                test: /\.ts$/,
                loaders: [
                    "awesome-typescript-loader",
                    "angular2-router-loader",
                    "angular2-template-loader",
                ],
                exclude: [root('src/app')],
                include: [root('./src')]
            },
        ]
    },
    plugins: [
        assetsPluginInstance,
        new CheckerPlugin(),
        // new webpack.DllPlugin({
        //     path: path.join(__dirname, "bin/dll/manifest", "dll-manifest.json"),
        //     name: "[name]_[hash]"
        // }),
        // new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true
            },
            output: { comments: false }
        })
    ]
};
function root(__path = '.') {
    return path.join(__dirname, __path);
}

if (process.env.NODE_ENV == 'production') {
    config.output.filename = '[name].[hash].dll.js';
    config.plugins = config.plugins.concat(
        [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('production')
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                    drop_console: true
                },
                output: { comments: false }
            }),
            new webpack.DllPlugin({
                path: path.join(__dirname, "manifest", "[name]-manifest.json"),
                name: "[name]_[hash]"
            }),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.AggressiveMergingPlugin
        ]
    );
} else {
    config.plugins.push(
        new webpack.DllPlugin({
            path: path.join(__dirname, "bin/debug/manifest", "[name]-manifest-dev.json"),
            name: "[name]_[hash]"
        })
    )
}
module.exports = config;
