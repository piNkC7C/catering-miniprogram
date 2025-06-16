import { BASE_URL, TIME_OUT } from './config'
import TaroRequest from './request'

// 创建Taro请求实例
export const taroRequest = new TaroRequest({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  header: {
    'Authorization': `Bearer test1`,
    'tenant-id': '1'
  },
  interceptors: {
    requestSuccessFn: (config) => {
      return config
    },
    requestFailureFn: (error) => {
      console.log('Taro请求失败', error)
      return error
      // return Promise.reject(error)
    },
    responseSuccessFn: (res) => {
      // 统一处理响应数据
      if (res.statusCode === 200) {
        if (res.data.code == 0) {
          return res.data
        } else {
          throw res.data
        }
      } else {
        throw res
      }
    },
    responseFailureFn: (error) => {
      console.log('Taro响应失败', error)
      return error
      // return Promise.reject(error)
    }
  }
})

// 简化的请求方法，可以直接替换原生Taro.request
export const taroHttpRequest = taroRequest.request.bind(taroRequest)
export const taroGet = taroRequest.get.bind(taroRequest)
export const taroPost = taroRequest.post.bind(taroRequest)
export const taroPut = taroRequest.put.bind(taroRequest)
export const taroDelete = taroRequest.delete.bind(taroRequest)

// import Taro from '@tarojs/taro'
// import { AxiosRequestHeaders, AxiosError } from 'axios'
// import ZZRequest from './request'

// // 封装消息提示函数，只使用Taro原生API
// const showMessage = (message: string, type: 'success' | 'error' | 'loading' | 'none' = 'none') => {
//   // 使用Taro原生API显示提示
//   Taro.showToast({
//     title: message,
//     icon: type,
//     duration: 2000
//   });
// };

// const baseRequest = new ZZRequest({
//   baseURL: BASE_URL,
//   timeout: TIME_OUT,
//   interceptors: {
//     requestSuccessFn: (config) => {
//       return config
//     },
//     requestFailureFn(error){
//       console.log('请求失败', error);
//       // 处理请求超时
//       if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
//         showMessage('请求超时', 'error');
//       } else if (error.response) {
//         // 处理HTTP状态错误
//         const status = error.response.status;
//         switch (status) {
//           case 401:
//             showMessage('未授权', 'error');
//             // 可以在这里处理登录逻辑，如跳转到登录页
//             break;
//           case 403:
//             showMessage('拒绝访问', 'error');
//             break;
//           case 404:
//             showMessage('请求的资源不存在', 'error');
//             break;
//           case 500:
//             showMessage('服务器错误', 'error');
//             break;
//           default:
//             showMessage(`请求失败`, 'error');
//         }
//       } else if (error.request) {
//         if (error.code === 'ERR_CANCELED') {
//           return
//         }
//         // 请求发出后没有收到响应
//         showMessage('网络错误，请检查网络连接', 'error');
//       } else {
//         // 请求配置出错
//         showMessage('请求配置错误', 'error');
//       }
      
//       // 将错误继续抛出，以便在业务代码中可以继续捕获
//       return Promise.reject(error);
//     },
//     responseSuccessFn(res) {
//       return res
//     },
//     responseFailureFn(error){
//       console.log('响应失败', error);
      
//       // 处理请求超时
//       if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
//         showMessage('请求超时', 'error');
//       } else if (error.response) {
//         // 处理HTTP状态错误
//         const status = error.response.status;
//         switch (status) {
//           case 401:
//             showMessage(error.response.data.detail || '未授权', 'error');
//             // 可以在这里处理登录逻辑，如跳转到登录页
//             break;
//           case 403:
//             showMessage('拒绝访问', 'error');
//             break;
//           case 404:
//             showMessage('请求的资源不存在', 'error');
//             break;
//           case 500:
//             showMessage('服务器错误', 'error');
//             break;
//           default:
//             showMessage(`请求失败`, 'error');
//         }
//       } else if (error.request) {
//         if (error.code === 'ERR_CANCELED') {
//           return
//         }
//         // 请求发出后没有收到响应
//         showMessage('请检查网络连接', 'error');
//       } else {
//         // 请求配置出错
//         showMessage('请求配置错误', 'error');
//       }
      
//       // 将错误继续抛出，以便在业务代码中可以继续捕获
//       return Promise.reject(error);
//     }
//   },
//   headers: {
//   } as AxiosRequestHeaders
// })

// export { baseRequest }
