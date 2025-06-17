import { taroGet, taroPost, taroPut } from '@/service'
import { addAddressURL, getAddressListURL, editAddressURL, getAreaDataURL, getShopListURL, getShopDetailURL } from '@/service/config'
import type { IResponseApi } from '../type'
import type { IAddressItem, IShopItem } from '@/redux/types/address'

export const getAddressListAPI = (callback: (res: IResponseApi<IAddressItem[]>) => void) => {
    taroGet({
        url: getAddressListURL,
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

export const getShopListAPI = (data: {
    cityId: number
    shopLongitude: number
    shopLatitude: number
    locationName: string
    pageSize?: number
    cursorDistance?: any
}, callback: (res: IResponseApi<{
    shops: IShopItem[]
    hasMore: boolean
    nextCursor: number
    init: boolean
}>) => void) => {
    taroPost({
        url: getShopListURL,
        data,
        success: (res) => {
            callback({
                success: true,
                data: {
                    ...res.data,
                    init: !data.cursorDistance
                }
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

export const getShopDetailAPI = (data: {
    shopId: number
}, callback: (res: IResponseApi<IShopItem>) => void) => {
    taroGet({
        url: getShopDetailURL + '?shopId=' + data.shopId,
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
