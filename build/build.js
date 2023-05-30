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
const fs = require('fs');
const OSS = require('ali-oss');
const dirPath = __dirname + '/../dist/static/';
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
const client = new OSS({
	region: 'oss-us-west-1',
	accessKeyId: accessKey[0],
	accessKeySecret: accessKey[1],
	bucket: 'static-oss-cdn',
});
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
		let index = 0;

		// 读取资源文件，上传cdn
		fs.readdir(dirPath, (err, dirs) => {
			dirs.forEach((dir) => {
				if (dir != 'css' && dir != 'img' && dir != 'js') {
					return;
				}
				fs.readdir(dirPath + '/' + dir, (err, files) => {
					files.forEach(async (file) => {
						let fileStream = fs.createReadStream(dirPath + '/' + dir + '/' + file);
						let result = await client.putStream('aso/static/' + dir + '/' + file, fileStream);
						// 打印cdn地址
						console.log(result.url);
						index += 1;
						if (result.res.status !== 200 || result.res.statusCode !== 200) {
							console.log(result);
							console.error('Upload Error!');
							process.exit(1);
						}
					});
				});
			});
		});

		console.log(chalk.cyan('  Build complete.\n'));
		console.log(
			chalk.yellow(
				'  Tip: built files are meant to be served over an HTTP server.\n' +
					'  Opening index.html over file:// won\'t work.\n'
			)
		);
	});
});
