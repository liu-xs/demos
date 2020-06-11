import axios from "axios"
// import loading from './loading'
import { Modal } from 'antd';


const instance = axios.create();
instance.interceptors.request.use(function (config) {
  // loading.show()

  return config;
}, function (error) {

  return Promise.reject(error);
});

const codeMsg = {
  'timeout': '连接超时',
  '405': '登录失效，请关闭后重新进入',
  '406': '您的账户已在别处登录，请关闭后重新进入',
}

function errModal(txt){
  Modal.warning('提示',txt === 'token is null or not exists' ? '登录失效，请关闭后重新进入' : txt)
}

instance.interceptors.response.use(function (response) {  
  // loading.hide()
  const result = response.data

  if (result.success === false) {
    const error = result.errors;
    let msg = '';
    if (error === null) {
      msg = result.data || '未知错误'
    }else if (Array.isArray(error)) {
      const code = error[0].code
      msg = codeMsg[code] || error[0].message 
    }
    errModal(msg)
    return Promise.resolve(result);
  }
  return result;
}, function (error) {
  console.error(error.stack);
  // loading.hide()
  if (error.response) {
    errModal(`${error.response.status}/${error.response.statusText}`)
  } else if (error.request) {
    errModal('网络不通畅.')
  } else {
    errModal(error.message)
  }
  return Promise.resolve({success: false});
});

instance.defaults.timeout = 3 * 60 * 1000;

const SERVICE = process.env.SERVICE



export default instance;