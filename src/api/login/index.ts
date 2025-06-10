import { taroPost } from '@/service'
import { loginByPhoneURL } from '@/service/config'
import type { IResponseApi } from '../type'

export const loginByPhoneAPI = (data: any, callback: (res: IResponseApi) => void) => {
    taroPost({
        url: loginByPhoneURL,
        data,
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
