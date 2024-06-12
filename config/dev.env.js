/* eslint-disable indent */
'use strict';
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  VUE_APP_BASE_URL: '"https://dev.kodecoffee.com"',
	VUE_APP_API_URL: '"https://devapi.kodecoffee.com"',
  VUE_APP_GLOBAL_URL: '"https://kodecoffee-global.zingfront.com"',
	VUE_APP_OSS_URL: '"https://kodepay-cdn.oss-us-west-1.aliyuncs.com/"'
});
