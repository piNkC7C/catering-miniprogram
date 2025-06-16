import { taroGet, taroPost, taroDelete } from '@/service'
import { getGroupGoodsListURL, getSetGoodURL, getOrderListURL, getRefundListURL, getSetGoodDetailURL, addCartGoodURL, getCartListURL, deleteCartGoodURL, clearCartURL, selectedCartURL } from '@/service/config'
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

export const getSetGoodDetailAPI = (data: {
    id: any
}, callback: (res: IResponseApi<any>) => void) => {
    taroGet({
        url: getSetGoodDetailURL + '?id=' + data.id,
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

export const addCartGoodAPI = (data: any, callback: (res: IResponseApi<any>) => void) => {
    taroPost({
        url: addCartGoodURL,
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

export const deleteCartGoodAPI = (data: {
    commodityId: number
    isSet?: boolean
    deskId: number | null
    shopId: number
    openId: string
}, callback: (res: IResponseApi<any>) => void) => {
    taroDelete({
        url: deleteCartGoodURL + `?commodityId=${data.commodityId}&isSet=${data.isSet}&deskId=${data.deskId}&shopId=${data.shopId}&openId=${data.openId}`,
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

export const clearCartAPI = (data: {
    isSet?: boolean
    deskId: number | null
    shopId: number
    openId: string
}, callback: (res: IResponseApi<any>) => void) => {
    taroDelete({
        url: clearCartURL + `?openId=${data.openId}&deskId=${data.deskId}&shopId=${data.shopId}`,
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

export const getCartListAPI = (data: {
    shopId: number
    deskId: number | null
    openId: string
}, callback: (res: IResponseApi<any>) => void) => {
    taroGet({
        url: getCartListURL + `?shopId=${data.shopId}&deskId=${data.deskId}&openId=${data.openId}`,
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

export const selectedCartAPI = (data: any, callback: (res: IResponseApi<any>) => void) => {
    taroPost({
        url: selectedCartURL,
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
