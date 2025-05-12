import { baseRequest } from '../index'
import type { AxiosRequestHeaders } from 'axios'

export const getExampleData = async () => {
  try {
    const getExampleDataRes = await baseRequest.get({
      url: '/example',
      headers: {
      } as AxiosRequestHeaders,
    })
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
