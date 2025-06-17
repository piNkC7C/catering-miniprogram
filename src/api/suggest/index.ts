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
            if (err instanceof Promise) {
                err.catch((errMsg) => {
                    callback({
                        success: false,
                        data: errMsg
                    })
                })
            } else {
                callback({
                    success: false,
                    data: err
                })
            }
        }
    }).catch(() => {
    })
}