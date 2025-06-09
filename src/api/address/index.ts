import { taroGet, taroPost, taroPut } from '@/service'
import { addAddressURL, getAddressListURL, editAddressURL } from '@/service/config'
import type { IResponseApi } from '../type'

export const getAddressListAPI = (callback: (res: IResponseApi) => void) => {
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

export const addAddressAPI = (data: any, callback: (res: IResponseApi) => void) => {
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

export const editAddressAPI = (data: any, callback: (res: IResponseApi) => void) => {
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
