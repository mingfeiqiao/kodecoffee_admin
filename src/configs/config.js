// const URL ='https://kodepay.io';
// const API_URL = 'https://api.kodepay.io';

const URL = 'https://345c-111-175-57-114.ngrok-free.app';
// const API_URL = 'https://b3b0-219-140-118-123.ngrok.io';
const API_URL = 'http://127.0.0.1:8001'
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
