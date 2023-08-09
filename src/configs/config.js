// const URL ='https://kodepay.io';
// const API_URL = 'https://api.kodepay.io';

const URL = 'http://localhost:8080';
const API_URL = 'http://127.0.0.1:8001';
export default Object.freeze({
  URL: URL,
  API_URL: API_URL,
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
