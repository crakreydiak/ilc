/* eslint-env node */
const fs = require('fs');
const path = require('path');
const { DefinePlugin } = require('webpack');
const WrapperPlugin = require('wrapper-webpack-plugin');
const { DuplicateIlcPluginsWebpackPlugin, ResolveIlcDefaultPluginsWebpackPlugin } = require('ilc-plugins-sdk/webpack');

const { environment } = require('../common/Environment');
const ilcPluginsPath = path.resolve(__dirname, '../../node_modules/');

module.exports = {
    entry: path.resolve(__dirname, '../client.js'),
    output: {
        filename: 'client.js',
        path: path.resolve(__dirname, '../public'),
    },
    mode: 'production',
    module: {
        rules: [
            { parser: { System: false } },
            {
                test: /\.js?$/,
                exclude: /node_modules\/(?!(@namecheap\/error-extender)\/).*/,
                loader: 'babel-loader',
            },
        ],
    },
    resolve: {
        modules: [__dirname, 'node_modules'],
        alias: {
            'single-spa': require.resolve('single-spa/lib/umd/single-spa.min.js'),
        },
        plugins: [new ResolveIlcDefaultPluginsWebpackPlugin(ilcPluginsPath)],
    },
    plugins: [
        new DuplicateIlcPluginsWebpackPlugin(ilcPluginsPath),
        new WrapperPlugin({
            test: /\.js$/,
            header: () => fs.readFileSync(path.resolve(__dirname, '../public/system.js')),
            afterOptimizations: true,
        }),
        new DefinePlugin({
            LEGACY_PLUGINS_DISCOVERY_ENABLED: JSON.stringify(environment.isLegacyPluginsDiscoveryEnabled()),
        }),
    ],
    devtool: 'source-map',
    externals: [],
};
