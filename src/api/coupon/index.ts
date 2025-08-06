import { taroGet, taroPost, taroDelete, adminTaroGet } from '@/service'
import { testMeiTuanSignURL } from '@/service/config'
import type { IResponseApi } from '../type'

// 测试美团签名
export const testMeiTuanSignAPI = (callback: (res: IResponseApi<any>) => void) => {
    taroGet({
        url: testMeiTuanSignURL,
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
