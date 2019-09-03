var path = require('path');
var webpack = require('webpack');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, '../public'),
        publicPath: '/',
        filename: 'js/build.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [{ loader: MiniCssExtractPlugin.loader }, 'css-loader']
            },
            {
                test: /\.less$/,
                use: ['vue-style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.vue$/,
                exclude: /node_modules/,
                loader: 'vue-loader'
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
                options: {
                    formatter: require('eslint-friendly-formatter')
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.svg$/,
                loader: 'svg-sprite-loader',
                exclude: /node_modules/,
                options: {
                    symbolId: 'icon-[name]'
                }
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                exclude: path.resolve(__dirname, 'src/assets/icons'),
                loader: 'file-loader',
                options: {
                    name: 'img/[name].[ext]?[hash]'
                }
            },
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                loader: 'url-loader',
                options: {
                    // Limit at 50k. Above that it emits separate files
                    limit: 50000,

                    // url-loader sets mimetype if it's passed.
                    // Without this it derives it from the file extension
                    mimetype: 'application/font-woff',

                    // Output below fonts directory
                    name: 'fonts/[name].[ext]'
                }
            }
        ]
    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.esm.js',
            '@': path.resolve('src')
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
    performance: {
        hints: false
    },
    devtool: 'eval',
    optimization: {
        // 分离chunks
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    name: 'vendor',
                    test: /[\\/]node_modules[\\/][^element-ui\/lib]/,
                    priority: 10,
                    chunks: 'initial' // 只打包初始时依赖的第三方
                },
                element: {
                    name: 'element',
                    test: /[\\/]node_modules[\\/]element-ui\/lib/,
                    chunks: 'all' // 只打包初始时依赖的第三方
                }
            }
        },
        minimizer: [
            new OptimizeCSSAssetsPlugin(),
            new TerserPlugin({
                parallel: true,
                sourceMap: true,
                extractComments: {
                    filename: 'LICENSES'
                },
                terserOptions: {
                    compress: {
                        ecma: 6
                    },
                    output: {
                        comments: /^\**!|@preserve|@license|@cc_on/
                    }
                }
            })
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),

        new VueLoaderPlugin(),

        new MiniCssExtractPlugin({
            filename: 'css/app.css'
        }),
        new HtmlwebpackPlugin({
            //模板文件的位置
            template: '../views/index.ejs'
        })
    ]
};
