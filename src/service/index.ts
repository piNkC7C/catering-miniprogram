import Taro from '@tarojs/taro'
import { AxiosRequestHeaders, AxiosError } from 'axios'
import { BASE_URL, TIME_OUT } from './config'
import ZZRequest from './request'

// 移除未使用的导入
// import { AtMessage } from 'taro-ui'

// 封装消息提示函数，只使用Taro原生API
const showMessage = (message: string, type: 'success' | 'error' | 'loading' | 'none' = 'none') => {
  // 使用Taro原生API显示提示
  Taro.showToast({
    title: message,
    icon: type,
    duration: 2000
  });
};

const baseRequest = new ZZRequest({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  interceptors: {
    requestSuccessFn: (config) => {
      return config
    },
    requestFailureFn(error){
      console.log('请求失败', error);
      // 处理请求超时
      if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
        showMessage('请求超时', 'error');
      } else if (error.response) {
        // 处理HTTP状态错误
        const status = error.response.status;
        switch (status) {
          case 401:
            showMessage('未授权', 'error');
            // 可以在这里处理登录逻辑，如跳转到登录页
            break;
          case 403:
            showMessage('拒绝访问', 'error');
            break;
          case 404:
            showMessage('请求的资源不存在', 'error');
            break;
          case 500:
            showMessage('服务器错误', 'error');
            break;
          default:
            showMessage(`请求失败`, 'error');
        }
      } else if (error.request) {
        if (error.code === 'ERR_CANCELED') {
          return
        }
        // 请求发出后没有收到响应
        showMessage('网络错误，请检查网络连接', 'error');
      } else {
        // 请求配置出错
        showMessage('请求配置错误', 'error');
      }
      
      // 将错误继续抛出，以便在业务代码中可以继续捕获
      return Promise.reject(error);
    },
    responseSuccessFn(res) {
      return res
    },
    responseFailureFn(error){
      console.log('响应失败', error);
      
      // 处理请求超时
      if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
        showMessage('请求超时', 'error');
      } else if (error.response) {
        // 处理HTTP状态错误
        const status = error.response.status;
        switch (status) {
          case 401:
            showMessage(error.response.data.detail || '未授权', 'error');
            // 可以在这里处理登录逻辑，如跳转到登录页
            break;
          case 403:
            showMessage('拒绝访问', 'error');
            break;
          case 404:
            showMessage('请求的资源不存在', 'error');
            break;
          case 500:
            showMessage('服务器错误', 'error');
            break;
          default:
            showMessage(`请求失败`, 'error');
        }
      } else if (error.request) {
        if (error.code === 'ERR_CANCELED') {
          return
        }
        // 请求发出后没有收到响应
        showMessage('请检查网络连接', 'error');
      } else {
        // 请求配置出错
        showMessage('请求配置错误', 'error');
      }
      
      // 将错误继续抛出，以便在业务代码中可以继续捕获
      return Promise.reject(error);
    }
  },
  headers: {
  } as AxiosRequestHeaders
})

export { baseRequest }
