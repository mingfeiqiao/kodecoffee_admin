'use strict';
// Template version: 1.1.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path');

module.exports = {
	build: {
		env: require('./prod.env'),
		index: path.resolve(__dirname, '../dist/index.html'),
		assetsRoot: path.resolve(__dirname, '../dist'),
		assetsSubDirectory: 'static',
		// 打包路径这边记得替换绝对路径,这边上传要匹配后台https,该配置会影响js文件生成
		assetsPublicPath: '//appcdn-global.zingfront.com/aso/',
		productionSourceMap: false,
		// Gzip off by default as many popular static hosts such as
		// Surge or Netlify already gzip all static assets for you.
		// Before setting to `true`, make sure to:
		// npm install --save-dev compression-webpack-plugin
		productionGzip: false,
		productionGzipExtensions: ['js', 'css'],
		// Run the build command with an extra argument to
		// View the bundle analyzer report after build finishes:
		// `npm run build --report`
		// Set to `true` or `false` to always turn it on or off
		bundleAnalyzerReport: false,
	},
	dev: {
		env: require('./dev.env'),
		port: process.env.PORT || 8080,
		host: '0.0.0.0',
		autoOpenBrowser: true,
		assetsSubDirectory: 'static',
		assetsPublicPath: '/',
		proxyTable: {
		},
		cssSourceMap: false,
	},
};
