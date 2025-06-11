import { taroPost } from '@/service'
import { loginByPhoneURL, loginURL } from '@/service/config'
import type { IResponseApi } from '../type'
import type { IUserInfo } from '@/redux/types/login'

export const loginByPhoneAPI = (data: any, callback: (res: IResponseApi<any>) => void) => {
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

export const loginAPI = (data: {
    type: number
    code: string
    state: string
}, callback: (res: IResponseApi<IUserInfo>) => void) => {
    taroPost({
        url: loginURL,
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
