import * as path from 'path'
const __dirname = path.dirname(new URL(import.meta.url).pathname)

const externals = {}
for (const key of [
    'child_process',
    'crypto',
    'dns',
    'fs',
    'http',
    'https',
    'net',
    'path',
    'querystring',
    'tls',
    'tty',
    'zlib',
    '../build/Release/cpufeatures.node',
    './crypto/build/Release/sshcrypto.node',
]) {
    externals[key] = `commonjs ${key}`
}

const config = {
    name: 'tabby-web-entry',
    target: 'web',
    entry: {
        preload: path.resolve(__dirname, 'entry.preload.ts'),
        bundle: path.resolve(__dirname, 'entry.ts'),
    },
    mode: process.env.TABBY_DEV ? 'development' : 'production',
    optimization:{
        minimize: false,
    },
    context: __dirname,
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, 'dist'),
        pathinfo: true,
        filename: '[name].js',
        publicPath: 'auto',
    },
    resolve: {
        modules: ['../app/node_modules', 'node_modules', '../node_modules', '../app/assets/'].map(x => path.join(__dirname, x)),
        extensions: ['.ts', '.js'],
        fallback: {
            stream: path.join(__dirname, 'node_modules/stream-browserify/index.js'),
            assert: path.join(__dirname, 'node_modules/assert/assert.js'),
            constants: path.join(__dirname, 'node_modules/constants-browserify/constants.json'),
            util: path.join(__dirname, 'node_modules/util/util.js'),
        },
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile: path.resolve(__dirname, 'tsconfig.json'),
                    },
                },
            },
            { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
            { test: /\.css$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
            {
                test: /\.(png|svg|ttf|eot|otf|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                type: 'asset',
            },
        ],
    },
    externals,
}

export default config
