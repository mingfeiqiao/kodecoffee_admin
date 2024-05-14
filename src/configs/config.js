const URL ='https://kodecoffee.com';
const API_URL = 'https://api.kodecoffee.com';
const GLOBAL_URL = 'https://kodecoffee-global.zingfront.com';
const OSS_URL = 'https://kodepay-cdn.oss-us-west-1.aliyuncs.com/';

// const URL = 'http://localhost:8080';
// const API_URL = 'http://127.0.0.1:8001';
export default Object.freeze({
  URL,
  API_URL,
  GLOBAL_URL,
  OSS_URL,
  MODECONFIG: {
    PRODUCTION: {
      mode: 'vendors',
      basePath:'/vendors',
      baseURL: `${URL}/vendors`,
      apiURL: `${API_URL}/production`,
    },
    SANDBOX: {
      mode: 'sandbox-vendors',
      basePath:'/sandbox-vendors',
      baseURL: `${URL}/sandbox-vendors`,
      apiURL: `${API_URL}/sandbox`,
    }
  }
});
