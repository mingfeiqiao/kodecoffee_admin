let path = require('path');
let config = require('../config');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

exports.assetsPath = function (_path) {
	let assetsSubDirectory = process.env.NODE_ENV === 'production' ?
		config.build.assetsSubDirectory :
		config.dev.assetsSubDirectory;
	return path.posix.join(assetsSubDirectory, _path);
};

exports.cssLoaders = function (options) {
	options = options || {};

	let cssLoader = {
		loader: 'css-loader',
		options: {
			minimize: process.env.NODE_ENV === 'production',
			sourceMap: options.sourceMap,
		}
	};

	// generate loader string to be used with extract text plugin
	function generateLoaders (loader, loaderOptions) {
		let loaders = [cssLoader];
		if (loader) {
			loaders.push({
				loader: loader + '-loader',
				options: Object.assign({}, loaderOptions, {
					sourceMap: options.sourceMap
				})
			});
		}

		// Extract CSS when that option is specified
		// (which is the case during production build)
		if (options.extract) {
			return ExtractTextPlugin.extract({
				use: loaders,
				fallback: 'vue-style-loader'
			});
		} else {
			return ['vue-style-loader'].concat(loaders);
		}
	}

	// https://vue-loader.vuejs.org/en/configurations/extract-css.html
	return {
		postcss: generateLoaders(),
	};
};

exports.specificCSSRules = function (options) {
	options = options || {};
	function getRule (loader,includePath,excludePath) {
		return {
			test: new RegExp('\\.css$'),
			use: loader,
			include: path.resolve(__dirname, includePath),
			exclude: path.resolve(__dirname, excludePath)
		};
	}

	function getLoader (options, module) {
		let loader = {
			loader: 'css-loader',
			options: {
				minimize: process.env.NODE_ENV === 'production',
				sourceMap: options.sourceMap,
			}
		};
		if (module) Object.assign(loader.options, {
			modules: true,
			camelCase: true,
			localIdentName: '[path][name]-[local]-[hash:base64:4]'
		});
		if (options.extract) {
			return ExtractTextPlugin.extract({
				use: [loader],
				fallback: 'vue-style-loader'
			});
		}else{
			return ['vue-style-loader'].concat([loader]);
		}
	}
	let normalLoader = getLoader(options);
	let moduleLoader = getLoader(options,true);
	let normalRule = getRule(normalLoader,'../node_modules','../src');
	let moduleRule = getRule(moduleLoader,'../src','../node_modules');
	return [normalRule,moduleRule];
};

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
	let output = [];
	let loaders = exports.cssLoaders(options);
	for (let extension in loaders) {
		let loader = loaders[extension];
		output.push({
			test: new RegExp('\\.' + extension + '$'),
			use: loader
		});
	}
	let specialRules = exports.specificCSSRules(options);
	output = output.concat(specialRules);
	return output;
};
