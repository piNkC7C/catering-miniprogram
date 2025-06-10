import { taroGet, taroPost } from '@/service'
import { getGroupGoodsListURL, getSetGoodURL } from '@/service/config'
import type { IResponseApi } from '../type'
import type { IGroupGoodsList } from '@/redux/types/order'

export const getGroupGoodsListAPI = (callback: (res: IResponseApi<IGroupGoodsList[]>) => void) => {
    taroPost({
        url: getGroupGoodsListURL,
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
