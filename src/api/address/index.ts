import { taroGet, taroPost, taroPut } from '@/service'
import { addAddressURL, getAddressListURL, editAddressURL, getAreaDataURL } from '@/service/config'
import type { IResponseApi } from '../type'

export const getAddressListAPI = (callback: (res: IResponseApi<any>) => void) => {
    taroGet({
        url: getAddressListURL,
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

export const addAddressAPI = (data: any, callback: (res: IResponseApi<any>) => void) => {
    taroPost({
        url: addAddressURL,
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

export const editAddressAPI = (data: any, callback: (res: IResponseApi<any>) => void) => {
    taroPut({
        url: editAddressURL,
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

export const getAreaDataAPI = (data: {
    id: number
}, callback: (res: IResponseApi<any>) => void) => {
    taroGet({
        url: getAreaDataURL + '?id=' + data.id,
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
