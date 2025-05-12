import type {
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosError
} from 'axios'

// 针对AxiosRequestConfig配置进行扩展
export interface ZZAxiosResponse<T = any> extends AxiosResponse {
  response?: any
}

export interface ZZInterceptors<T = ZZAxiosResponse> {
  requestSuccessFn?: (
    config: InternalAxiosRequestConfig
  ) => InternalAxiosRequestConfig
  requestFailureFn?: (err: any) => any
  responseSuccessFn?: (res: T) => T
  responseFailureFn?: (err: any) => any
  responseErrorFn?: (err: AxiosError) => any
}

export interface ZZRequestConfig<T = ZZAxiosResponse> extends InternalAxiosRequestConfig {
  // 拦截器
  interceptors?: ZZInterceptors<T>
}
