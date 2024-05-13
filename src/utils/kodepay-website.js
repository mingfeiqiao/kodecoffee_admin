class KodepayError extends Error {
  static CONTENT_SCRIPT_NOT_LOADED = 'content script set up error: Please configure your manifest.json strictly according to the content script configuration in document_start';

  static CREATE_API_KEY_ERROR = 'create uuid key error: please check the extension id';

  static NO_STORAGE_PERMISSION = 'no storage in permissions, please add storage in permissions in manifest.json'

  static GET_USER_INFO_ERROR = 'get user info error: please check your extension key and extension id, Finally, you can contact the developer for support';

  static NO_ACCESS_KEY = 'no access key, please check your extension key and extension id, Finally, you can contact the developer for support';

  static MODE_KEY_ERROR = 'mode must be development or production';

  static LIMIT_ERROR = 'request too fast, please try again later';
  constructor(message) {
    super(message);
    this.name = 'kodepay error';
    this.message = message;
  }
}
export function KodePay (application_id, client_id, mode = 'production') {
  const WEB_HOST = 'https://kodecoffee.com';
  const BASE_HOST = 'https://api.kodecoffee.com';
  let HOST;
  if (mode === 'development') {
    HOST = BASE_HOST + '/sandbox';
  } else if (mode === 'production') {
    HOST = BASE_HOST;
  } else {
    throw new KodepayError(KodepayError.MODE_KEY_ERROR);
  }
  // 获取用户语言
  const LANGUAGE = get_language();
  const SUCCESS_CODE = 100000;
  const CREATE_EXTENSION_KEY_URL = `${HOST}/api/extension/new-key`;
  const PAY_MANAGE_URL = `${HOST}/api/extension/user-managerment`;
  const GET_USER_INFO_URL = `${HOST}/api/extension/user-info`;
  const PAY_STATUS_URL = `${HOST}/api/extension/search-order`;
  const PAY_URL = `${HOST}/api/extension/make-order`;
  const REGISTER_LOGIN_INFORMATION = `${HOST}/api/extension/client-user-login`
  const EXTENSION_KEY_LOCAL_STORAGE_KEY = client_id + '_ext_key';
  const CHOOSE_PAYMENT_LINK_URL = `${HOST}/api/extension/pre_make_order`;
  const APP_VERSION = '1.0.0';
  const pay_callbacks = [];
  let api_key = '';
  let orders = {};
  const open_pay_manage_page_limit = {
    last_access_time: 0,
    limit: 5000
  };
  const open_payment_page_limit = {
    last_access_time: 0,
    limit: 5000
  };
  start_call_back_listener();
  /**
   * 获取浏览器语言
   * @returns {string|null}
   */
  function get_language () {
    try {
      return navigator.language;
    } catch (e) {
      return '';
    }
  }
  /**
   * 请求获取支付链接
   * @param price_id
   * @param extra_info
   * @returns {Promise<*>}
   */
  async function get_payment_url (price_id, extra_info = null) {
    let body = {price_id : price_id};
    if (extra_info) {
      if (is_JSON_Object(extra_info)) {
        body.origin_data = extra_info;
      } else {
        console.error('extra_info is not a JSON object');
      }
    }
    let response = await sea_fetch(PAY_URL, {method: 'POST', body: JSON.stringify(body)});
    if (parseInt(response.code) === SUCCESS_CODE) {
      return response.data;
    } else {
      let message = `get payment url error: ${JSON.stringify(response)}`;
      if (response.code && response.message) {
        message = `${response.code}: ${response.message}`;
      }
      throw new KodepayError(message);
    }
  }
  async function get_payment_url_new (price_id, extra_info = null) {
    let body = {price_id : price_id};
    if (extra_info) {
      if (is_JSON_Object(extra_info)) {
        body = {...body, ...extra_info};
      } else {
        console.error('extra_info is not a JSON object');
      }
    }
    let response = await sea_fetch(PAY_URL, {method: 'POST', body: JSON.stringify(body)});
    if (parseInt(response.code) === SUCCESS_CODE) {
      return response.data;
    } else {
      let message = `get payment url error: ${JSON.stringify(response)}`;
      if (response.code && response.message) {
        message = `${response.code}: ${response.message}`;
      }
      throw new KodepayError(message);
    }
  }
  /**
   * 是否是一个JSON OBJ
   * @param obj
   * @returns {boolean}
   */
  function is_JSON_Object(obj) {
    return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
  }
  /**
   * 接口请求
   * @param url
   * @param options
   * @returns {Promise<Response>}
   */
  async function sea_fetch(url, options = {}) {
    api_key = get_local_storage(EXTENSION_KEY_LOCAL_STORAGE_KEY);
    if (!api_key && url !== CREATE_EXTENSION_KEY_URL) { // 如果没有api_key，那么就应该去创建一个
      api_key = await create_extension_key();
    }
    options.headers = get_common_headers(options);
    return fetch(url, options).then(response => {
      return response.json();
    }).then(result => {
      return result;
    }).catch(error => {
      throw new KodepayError(`Network request failed: ${error.status} ${error.message}`);
    });
  }
  /**
   * 获取通用header
   * @param options
   * @returns {Headers}
   */
  function get_common_headers (options) {
    const headers = new Headers(options.headers || {});
    headers.append('content-type', 'application/json');
    headers.append('application-id', application_id);
    headers.append('client-type', 'website')
    headers.append('language', LANGUAGE);
    headers.append('client-id', client_id);
    headers.append('api-key', api_key);
    headers.append('app-version', APP_VERSION);
    return headers;
  }
  /**
   * 创建key
   * @returns {Promise<string>} 返回创建的api_key
   */
  async function create_extension_key() {
    try {
      const response = await sea_fetch(CREATE_EXTENSION_KEY_URL, {method: 'POST'});
      if (parseInt(response.code) === SUCCESS_CODE) {
        const api_key = response.data['api-key'];
        set_local_storage(EXTENSION_KEY_LOCAL_STORAGE_KEY, api_key);
        return api_key;
      } else {
        throw new Error(`Failed to create API key: ${response.message}`);
      }
    } catch (error) {
      throw new KodepayError(`${KodepayError.CREATE_API_KEY_ERROR} ${error.message}`);
    }
  }
  /**
   * 设置localstorage
   * @param key
   * @param value
   */
  function set_local_storage (key, value) {
    return localStorage.setItem(key, value)
  }
  /**
   * 获取localstorage中得指
   * @param key
   * @returns {string}
   */
  function get_local_storage (key) {
    try {
      return localStorage.getItem(key)
    } catch(e) {
      console.log('set local storage error', e);
    }
  }
  /**
   * 获取用户信息
   * @returns {Promise<any>}
   */
  async function get_user_info () {
    return await sea_fetch(GET_USER_INFO_URL, {method: 'POST'});
  }
  /**
   * 判断空值
   * @param value
   * @returns {boolean}
   */
  function is_empty_value(value) {
    if (value === null || value === undefined || value === '') {
      return true;
    }
    if (Array.isArray(value) && value.length === 0) {
      return true;
    }
    if (typeof value === 'object' && Object.keys(value).length === 0) {
      return true;
    }
    return typeof value === 'number' && isNaN(value);
  }
  /**
   * 打开新的web窗口
   * @param url
   * @param width
   * @param height
   * @returns {WindowProxy}
   */
  function open_sea_web_page(url, width, height) {
    return window.open(url, 'popup', `scrollbars=no,resizable=yes,status=no,location=no,toolbar=no,menubar=no,titlebar=no,dependent=yes,width=${width},height=${height}`);
  }
  /**
   * 检测订单状态，如何订单完成则清除定时器
   * @param transaction_id
   * @returns {Promise<void>}
   */
  async function check_order_status(transaction_id) {
    if (orders[transaction_id] && orders[transaction_id].status) {
      if (orders[transaction_id].status === 'uncompleted') {
        let res = await sea_fetch(PAY_STATUS_URL, {body: JSON.stringify({transaction_id: transaction_id}), method: 'POST'});
        const code = parseInt(res.code);
        const data = res.data;
        if (code === SUCCESS_CODE && data.transaction_id === transaction_id) {
          const pay_status = data.pay_status;
          if (pay_status === 'succeed' || pay_status === 'failed') {
            if (orders[transaction_id] && orders[transaction_id]['Interval']) {
              clearInterval(orders[transaction_id]['Interval']);
            }
            let user_info = await get_user_info();
            pay_callbacks.forEach((callback) => {
              callback(user_info, pay_status);
            });
          }
        }
      } else {
        if (orders[transaction_id] && orders[transaction_id]['Interval']) {
          clearInterval(orders[transaction_id]['Interval']);
        }
      }
    } else {
      if (orders[transaction_id] && orders[transaction_id]['Interval']) {
        clearInterval(orders[transaction_id]['Interval']);
        orders[transaction_id]['Interval'] = null;
      }
    }
  }
  /**
   * 轮询订单状态
   * @param options
   * @returns {Object}
   */
  function check_order_status_polling(options = {}) {
    const {
      transaction_id = '', // 订单id
      max_retries = 6, // 最大轮询次数
      retry_interval = 3000, // 轮询间隔，单位为毫秒
      timeout = 20000, // 轮询超时时间，单位为毫秒
    } = options;
    let retries = 0;
    let start_time = Date.now();
    const pollingTimer = setInterval(async () => {
      await check_order_status(transaction_id);
      const elapsed_time = Date.now() - start_time;
      if (elapsed_time >= timeout) {
        console.info('Polling timed out');
        clearInterval(pollingTimer);
      }
      retries++;
      if (retries > max_retries) {
        console.info('Maximum retries exceeded');
        clearInterval(pollingTimer);
      }
    }, retry_interval);
    return pollingTimer;
  }
  /**
   * 初始化
   */
  function start_call_back_listener() {
    window.addEventListener('message', function(event) {
      if (event.origin === WEB_HOST) {
        const message_data = event.data;
        if (message_data.data && message_data.type) {
          if (message_data.type === 'pay' && message_data.data.transaction_key) { // 支付成功轮询
            const transaction_id = message_data.data.transaction_key;
            if (orders && orders[transaction_id]) { // 已经在轮询的，直接停止轮询
              if (parseInt(message_data.data.status) === 0) { // 支付失败
                orders[transaction_id].status = 'failed';
                if (orders[transaction_id] && orders[transaction_id]['Interval']) {
                  clearInterval(orders[transaction_id]['Interval']);
                }
              } else if (parseInt(message_data.data.status) === 1) {
                if (orders[transaction_id] && orders[transaction_id].status === 'uncompleted') {
                  if (orders[transaction_id] && orders[transaction_id]['Interval']) {
                    clearInterval(orders[transaction_id]['Interval']);
                  }
                  check_order_status(transaction_id);
                  if (!orders[transaction_id]) {
                    orders[transaction_id] = {};
                  }
                  orders[transaction_id]['Interval'] = check_order_status_polling({transaction_id: transaction_id, max_retries: 6, retry_interval: 3000, timeout: 20000});
                }
              }
            } else { // 没有在轮询的，直接开始轮询
              if (parseInt(message_data.data.status) === 1) {
                check_order_status(transaction_id);
                if (!orders[transaction_id]) {
                  orders[transaction_id] = {};
                }
                orders[transaction_id]['Interval'] = check_order_status_polling({transaction_id: transaction_id, max_retries: 6, retry_interval: 3000, timeout: 20000});
              }
            }
          } else if (message_data.type === 'transaction' && get_local_storage(EXTENSION_KEY_LOCAL_STORAGE_KEY) === message_data.data.api_key && application_id === message_data.data.application_id && client_id === message_data.data.client_id) { // 开始支付轮询
            start_check_order_polling(message_data.data.transaction_id);
          }
        }
      }
    });
  }
  /**
   * 检查application_id 和 client_id是否存在
   * @returns {boolean}
   */
  function check_params () {
    return !(is_empty_value(application_id) || is_empty_value(client_id));
  }
  /**
   *
   * @param price_id
   * @param extra_info
   * @param width
   * @param height
   * @returns {Promise<Window>}
   */
   async function open_payment_page (price_id, extra_info= null, width=1100, height=700) {
    try {
      check_limit(open_payment_page_limit);
      if (!check_params() || is_empty_value(price_id)){
        throw new KodepayError(KodepayError.NO_ACCESS_KEY);
      }
      const data = await get_payment_url(price_id,extra_info);
      if (data.transaction_id) {
        start_check_order_polling(data.transaction_id);
      }
      return open_sea_web_page(data.url, width, height);
    } catch (e) {
      console.log(e)
    }
  }
  async function open_payment_page_new (price_id, extra_info= null, width=1100, height=700) {
    try {
      let {payment_channel, payment_method, currency} = extra_info;
      let obj = {price_id,currency,payment_channel, payment_method};
      
      let value = get_local_storage('open_payment_params');
      value = JSON.parse(value);
      if (value && (payment_channel == value.payment_channel && payment_method == value.payment_method && price_id == value.price_id && currency == value.currency)) {
        check_limit(open_pay_manage_page_limit);
      }
      set_local_storage('open_payment_params', JSON.stringify(obj));
      if (!check_params() || is_empty_value(price_id)){
        throw new KodepayError(KodepayError.NO_ACCESS_KEY);
      }

      const data = await get_payment_url_new(price_id,extra_info);
      // if (data.transaction_id) {
      //   start_check_order_polling(data.transaction_id);
      // }
      // return open_sea_web_page(data.url, width, height);
      return {
        code:'success',
        data:data.url
      };
    } catch (e) {
      return {
        code:'error',
        error: e.message || ''
      };
    }
  }
  /**
   * 检查订单状态
   * @param transaction_id
   */
  function start_check_order_polling (transaction_id) {
    if (orders && orders[transaction_id] && orders[transaction_id].status === 'uncompleted') {
      return;
    }
    orders[transaction_id] = {status: 'uncompleted', 'Interval': check_order_status_polling({
        transaction_id: transaction_id,
        max_retries: 24,
        retry_interval: 9000,
        timeout: 180000,
        retries: 0,
        start_time: Date.now(),
      })};
  }
  /**
   * 检查是否超出限制
   * @param limit_params
   */
  function check_limit (limit_params) {
    const current_time = Date.now();
    if (current_time - limit_params.last_access_time < limit_params.limit) {
      throw new KodepayError(KodepayError.LIMIT_ERROR);
    }
    limit_params.last_access_time = current_time;
  }
  /**
   * 获取用户中心链接
   * @param width
   * @param height
   * @returns {Promise<void>}
   */
  async function open_user_management_page (width= 1100, height=700) {
    try {
      check_limit(open_pay_manage_page_limit);
      if (!check_params()){
        throw new KodepayError(KodepayError.NO_ACCESS_KEY);
      }
      let url = await get_user_management_url()
      await open_sea_web_page(url, width, height);
    } catch (e) {
      console.log(e)
    }
  }
  /**
   * 获取支付链接
   * @returns {Promise<*>}
   */
  async function get_user_management_url () {
    let response = await sea_fetch(PAY_MANAGE_URL, {method: 'POST'});
    if (parseInt(response.code) === SUCCESS_CODE) {
      return response.data.url;
    } else {
      let message = `get user management error: ${JSON.stringify(response)}`;
      if (response.code && response.message) {
        message = `${response.code}: ${response.message}`;
      }
      throw new KodepayError(message);
    }
  }

  /**
   * 打开支付方式选择页面
   * @param price_id
   * @param currency
   * @param extra_info
   * @param width
   * @param height
   * @returns {Promise<Window>}
   */
  async function open_payment_choose_page (price_id, currency="", extra_info=null, width=1100, height=700) {
    try {
      check_limit(open_pay_manage_page_limit);
      if (!check_params()){
        throw new KodepayError(KodepayError.NO_ACCESS_KEY);
      }
      const data = await get_payment_choose_page_url(price_id,currency,extra_info);
      return open_sea_web_page(data.url, width, height);
    } catch (e) {
      console.log(e)
    }
  }
  /**
   * 获取支付方式选择页面
   * @param price_id
   * @param currency
   * @param extra_info
   * @returns {Promise<*>}
   */
  async function get_payment_choose_page_url (price_id, currency='', extra_info= null){
    let body = {price_id: price_id, currency:currency, quantity: extra_info.quantity};
    if (extra_info) {
      if (is_JSON_Object(extra_info)) {
        body.origin_data = extra_info;
      } else {
        console.error('extra_info is not a JSON object');
      }
    }
    let response = await sea_fetch(CHOOSE_PAYMENT_LINK_URL, {method: 'POST', body: JSON.stringify(body)});
    if (parseInt(response.code) === SUCCESS_CODE) {
      return response.data;
    } else {
      let message = `get payment choose url error: ${JSON.stringify(response)}`;
      if (response.code && response.message) {
        message = `${response.code}: ${response.message}`;
      }
      throw new KodepayError(message);
    }
  }
  /**
   * 获取有效套餐
   * @returns {Promise<*|[]|*[]>}
   */
  async function get_valid_subscriptions() {
    try {
      let res = await get_user_info();
      if (parseInt(res.code)  === SUCCESS_CODE) {
        return valid_subscriptions(res.payinfo);
      }
      return [];
    } catch (e) {
      return [];
    }
  }
  /**
   * 获取有效套餐
   * @param pay_info
   * @returns {*|*[]}
   */
  function valid_subscriptions (pay_info) {
    if (Array.isArray(pay_info) && pay_info.length > 0) {
      let success_status = ['created', 'updated'];
      let cancling_status = ['canceling', 'canceled'];
      return pay_info.filter((item) => {
        if (item.plan_type === 'one_time' && item.pay_status === 'succeed') {
          return item;
        }
        if (item.plan_type === 'recurring') {
          if (success_status.includes(item.order_status)) {
            return item;
          }
          if (cancling_status.includes(item.order_status)) {
            // 判断plan_end 这个时间戳与当前时间戳的大小
            if (item.plan_end > Date.now() / 1000) {
              return item;
            }
          }
        }
      });
    } else {
      return [];
    }
  }
  /**
   * 向服务器登录自有用户
   * @param user_key
   * @returns {Promise<any>}
   */
  async function register_login_information (user_key) {
    return await sea_fetch(REGISTER_LOGIN_INFORMATION, {method: 'POST', body: JSON.stringify({user_key: user_key})});
  }
  return {
    get_user_info: get_user_info,
    get_valid_subscriptions: get_valid_subscriptions,
    open_payment_page: open_payment_page,
    open_payment_page_new:open_payment_page_new,
    register_login_information:register_login_information,
    open_user_management_page: open_user_management_page,
    open_payment_choose_page:open_payment_choose_page,
    on_pay_completed: {
      addListener : function (callback) {
        pay_callbacks.push(callback);
      }
    }
  };
}
// window.KodePay = KodePay(window.KODEPAY_APPLICATION_ID, window.KODEPAY_CLIENT_ID, window.KODEPAY_ENV);