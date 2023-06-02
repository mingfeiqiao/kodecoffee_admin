'use strict';
const path = require('path');
const utils = require('./utils');
const config = require('../config');
const vueLoaderConfig = require('./vue-loader.conf');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
let webpack = require('webpack');
function resolve (dir) {
	return path.join(__dirname, '..', dir);
}
console.log('process.env.NODE_ENV', process.env.NODE_ENV);
module.exports = {
	entry: {
		app: './src/main.js'
	},
	output: {
		path: config.build.assetsRoot,
		filename: '[name].js',
		publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath
	},
	resolve: {
		extensions: ['.js', '.vue', '.json', '.css'],
		alias: {
			vue$: 'vue/dist/vue.esm.js',
			'@': resolve('src'),
			vx: resolve('src/vuex'),
			vr: resolve('src/router'),
			css: resolve('src/css'),
			'#': resolve('src/components'),
			'#mod': resolve('src/components/modules'),
			'#com': resolve('src/components/common'),
			jquery: path.resolve(__dirname, '../node_modules/jquery/src/jquery')
		}
	},
	// node: {
	//   fs: new fs()
	// },
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: vueLoaderConfig
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: [resolve('src'), resolve('test')]
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('img/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('media/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(js|vue)$/,
				loader: 'eslint-loader',
				exclude: /node_modules/,
				// 预处理
				enforce: 'pre',
				//指定检查的目录
				include: [resolve(__dirname, 'src')]
			},
			{
				test: /\.less$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader',
						options: {
							modules: true,
							camelCase: true,
							localIdentName: '[path][name]-[local]-[hash:base64:4]',
							minimize: process.env.NODE_ENV === 'production',
							sourceMap: false
						}
					},
					{
						loader: 'less-loader'
					}
				]
			}
		]
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery'
		}),
		new BundleAnalyzerPlugin()
	]
};
