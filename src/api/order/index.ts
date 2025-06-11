import { taroGet, taroPost } from '@/service'
import { getGroupGoodsListURL, getSetGoodURL, getOrderListURL, getRefundListURL } from '@/service/config'
import type { IResponseApi } from '../type'
import type { IGroupGoodsList, IOrderItem, IRefundItem } from '@/redux/types/order'

export const getGroupGoodsListAPI = (data: {
    shopId: number
}, callback: (res: IResponseApi<IGroupGoodsList[]>) => void) => {
    taroGet({
        url: getGroupGoodsListURL + '?shopId=' + data.shopId,
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

export const getSetGoodAPI = (callback: (res: IResponseApi<IGroupGoodsList[]>) => void) => {
    taroPost({
        url: getSetGoodURL,
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

export const getOrderListAPI = (data: {
    userId?: any
    openId: any
}, callback: (res: IResponseApi<IOrderItem[]>) => void) => {
    taroPost({
        data,
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

export const getRefundListAPI = (data: {
    id: any
}, callback: (res: IResponseApi<IRefundItem[]>) => void) => {
    taroGet({
        url: getRefundListURL + '?id=' + data.id,
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
