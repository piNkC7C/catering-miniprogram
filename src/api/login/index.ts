import { taroPost, taroGet, taroPut } from '@/service'
import { getUserInfoURL, loginByPhoneURL, loginURL, getVipCodeURL } from '@/service/config'
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

export const getUserInfoAPI = (data: {
    openid: string
}, callback: (res: IResponseApi<any>) => void) => {
    taroGet({
        url: getUserInfoURL + '?openid=' + data.openid,
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

export const getVipCodeAPI = (callback: (res: IResponseApi<any>) => void) => {
    taroPut({
        url: getVipCodeURL,
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
