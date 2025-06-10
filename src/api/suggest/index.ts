import { taroGet } from '@/service'
import { getSuggestListURL } from '@/service/config'
import type { IResponseApi } from '../type'

export const getSuggestListAPI = (callback: (res: IResponseApi<any>) => void) => {
    taroGet({
        url: getSuggestListURL,
        success: (res) => {
            callback({
                success: true,
                data: res.data
            })
        },
        fail: (err) => {
            callback({
                success: false,
                data: err
            })
        }
    })
}