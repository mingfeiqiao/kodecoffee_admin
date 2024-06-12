const {VUE_APP_BASE_URL, VUE_APP_API_URL, VUE_APP_GLOBAL_URL, VUE_APP_OSS_URL} = process.env

// const URL = 'http://localhost:8080';
// const API_URL = 'http://127.0.0.1:8001';
export default Object.freeze({
  URL: VUE_APP_BASE_URL,
  API_URL: VUE_APP_API_URL,
  GLOBAL_URL: VUE_APP_GLOBAL_URL,
  OSS_URL: VUE_APP_OSS_URL,
  MODECONFIG: {
    PRODUCTION: {
      mode: 'vendors',
      basePath:'/vendors',
      baseURL: `${VUE_APP_BASE_URL}/vendors`,
      apiURL: `${VUE_APP_API_URL}/production`,
    },
    SANDBOX: {
      mode: 'sandbox-vendors',
      basePath:'/sandbox-vendors',
      baseURL: `${VUE_APP_BASE_URL}/sandbox-vendors`,
      apiURL: `${VUE_APP_API_URL}/sandbox`,
    }
  }
});
