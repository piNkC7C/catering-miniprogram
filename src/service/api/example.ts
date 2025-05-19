import { baseRequest } from '../index'
import type { AxiosRequestHeaders } from 'axios'

export const getExampleData = async () => {
  try {
    const getExampleDataRes = await baseRequest.get({
      url: '/sns/jscode2session',
      params:{
        appid: 'wxfdada48a00bccc70',
        secret: '034634bbfe59410434df935942425696',
        js_code: '0f1o6jml24f4Cf4Cxuml2ACrOS3o6jm',
        grant_type: 'authorization_code',
      },
      headers: {
      } as AxiosRequestHeaders,
    })
    console.log('getExampleDataRes', getExampleDataRes)
    return {
      success: true,
      data: getExampleDataRes.data,
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error,
    }
  }
}
