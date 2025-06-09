import Taro  from '@tarojs/taro'

// 定义Taro请求配置接口
export interface TaroRequestConfig extends Taro.request.Option {
  // 拦截器配置
  interceptors?: TaroInterceptors
}

// 定义拦截器接口
export interface TaroInterceptors {
  requestSuccessFn?: (config: Taro.request.Option) => Taro.request.Option
  requestFailureFn?: (err: any) => any
  responseSuccessFn?: (res: any) => any
  responseFailureFn?: (err: any) => any
}

// 定义全局拦截器
export interface GlobalInterceptors {
  request: {
    success: ((config: Taro.request.Option) => Taro.request.Option)[]
    failure: ((err: any) => any)[]
  }
  response: {
    success: ((res: any) => any)[]
    failure: ((err: any) => any)[]
  }
}

// import type {
//   AxiosResponse,
//   InternalAxiosRequestConfig,
//   AxiosRequestHeaders,
//   AxiosError
// } from 'axios'

// // 针对AxiosRequestConfig配置进行扩展
// export interface ZZAxiosResponse<T = any> extends AxiosResponse {
//   response?: any
// }

// export interface ZZInterceptors<T = ZZAxiosResponse> {
//   requestSuccessFn?: (
//     config: InternalAxiosRequestConfig
//   ) => InternalAxiosRequestConfig
//   requestFailureFn?: (err: any) => any
//   responseSuccessFn?: (res: T) => T
//   responseFailureFn?: (err: any) => any
//   responseErrorFn?: (err: AxiosError) => any
// }

// export interface ZZRequestConfig<T = ZZAxiosResponse> extends InternalAxiosRequestConfig {
//   // 拦截器
//   interceptors?: ZZInterceptors<T>
// }
