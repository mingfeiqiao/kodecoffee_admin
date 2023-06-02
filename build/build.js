'use strict';
require('./check-versions')();
process.env.NODE_ENV = 'production';
const ora = require('ora');
const rm = require('rimraf');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const config = require('../config');
const webpackConfig = require('./webpack.prod.conf');
/**
 * 获取最新的accessKeyId和accessKeySecret, 该方法会在每次构建时调用
 * @returns {string[]}
 */
function getAccessKey () {
	let fs = require('fs');
	let path = require("path");
	let content = fs.readFileSync(path.join(__dirname,'./accesskey.txt')).toString()
	content = content.split('\n')
	return content;
}
const accessKey = getAccessKey();
if (!accessKey || accessKey.length < 2) {
	console.log('####注意从测试环境获取最新的accessKeyId和accessKeySecret####');
	console.log('####accessKeyId和accessKeySecret所在文件地址(测试机及所有线上机器): /nas/zbase/security-credentials/ali_ram ####');
	return;
}
const spinner = ora('building for production...');
spinner.start();

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), (err) => {
	if (err) throw err;
	webpack(webpackConfig, function (err, stats) {
		spinner.stop();
		if (err) throw err;
		process.stdout.write(
			stats.toString({
				colors: true,
				modules: false,
				children: false,
				chunks: false,
				chunkModules: false,
			}) + '\n\n'
		);
		console.log(chalk.cyan('  Build complete.\n'));
		console.log(
			chalk.yellow(
				'  Tip: built files are meant to be served over an HTTP server.\n' +
					'  Opening index.html over file:// won\'t work.\n'
			)
		);
	});
});
