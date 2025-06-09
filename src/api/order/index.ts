import { taroGet, taroPost } from '@/service'
import { getOrderTabsListURL, getOrderListURL } from '@/service/config'
import type { IResponseApi } from '../type'

export const getOrderTabsListAPI = (callback: (res: IResponseApi) => void) => {
    taroPost({
        url: getOrderTabsListURL,
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

export const getOrderListAPI = (callback: (res: IResponseApi) => void) => {
    taroPost({
        url: getOrderListURL,
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