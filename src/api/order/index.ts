import { taroGet, taroPost, taroDelete, adminTaroGet } from '@/service'
import { getGroupGoodsListURL, getSetGoodURL, getOrderListURL, getRefundListURL, getSetGoodDetailURL, addCartGoodURL, getCartListURL, deleteCartGoodURL, clearCartURL, selectedCartURL, addSharedCartGoodsURL, confirmPaymentURL, clearSelectedCartURL, payOrderURL, cancelOrderURL, getOrderDetailByPrePayURL, getPrePayByOrderIdURL, getIsOrderRefundURL, getOrderRefundRecordURL, getGoodsRefundRecordURL, getGoodsRefundRecordDetailsURL } from '@/service/config'
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
            err.catch((errMsg) => {
                callback({
                    success: false,
                    data: errMsg
                })
            })
        }
    }).catch(() => {
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
    })
}

export const addSharedCartGoodsAPI = (data: any, callback: (res: IResponseApi<any>) => void) => {
    taroPost({
        url: addSharedCartGoodsURL,
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

export const confirmPaymentAPI = (data: any, callback: (res: IResponseApi<any>) => void) => {
    taroPost({
        url: confirmPaymentURL,
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

export const clearSelectedCartAPI = (data: any, callback: (res: IResponseApi<any>) => void) => {
    taroDelete({
        url: clearSelectedCartURL,
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

export const payOrderAPI = (data: any, callback: (res: IResponseApi<any>) => void) => {
    taroPost({
        url: payOrderURL,
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

export const cancelOrderAPI = (data: {
    id: number
}, callback: (res: IResponseApi<any>) => void) => {
    taroDelete({
        url: cancelOrderURL + '?id=' + data.id,
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

export const getOrderDetailByPrePayAPI = (data: {
    id: string
}, callback: (res: IResponseApi<any>) => void) => {
    taroGet({
        url: getOrderDetailByPrePayURL + '?id=' + data.id,
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

export const getPrePayByOrderIdAPI = (data: {
    id: string
}, callback: (res: IResponseApi<any>) => void) => {
    taroGet({
        url: getPrePayByOrderIdURL + '?id=' + data.id,
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
    })
}

export const getIsOrderRefundAPI = (data: {
    orderId: number
}, callback: (res: IResponseApi<any>) => void) => {
    adminTaroGet({
        url: getIsOrderRefundURL + '?orderId=' + data.orderId,
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
    })
}

export const getOrderRefundRecordAPI = (data: {
    orderId: number
}, callback: (res: IResponseApi<any>) => void) => {
    taroGet({
        url: getOrderRefundRecordURL + '?orderId=' + data.orderId,
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
    })
}

/**
 * 获取商品级退款记录
 */
export const getGoodsRefundRecordAPI = (data: {
    orderId: number
}, callback: (res: IResponseApi<any>) => void) => {
    taroGet({
        url: getGoodsRefundRecordURL + '?orderId=' + data.orderId,
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
    })
}

// 获取商品级退款记录详情
export const getGoodsRefundRecordDetailsAPI = (data: {
    id: number
}, callback: (res: IResponseApi<any>) => void) => {
    taroGet({
        url: getGoodsRefundRecordDetailsURL + '?id=' + data.id,
        success: (res) => {
            callback({
                success: true,
                data: res.data
            })
        },
        fail: (err) => {
            if (err instanceof Promise) {
                err.catch((errMsg) => {
                })
            } else {
                callback({
                    success: false,
                    data: err
                })
            }
        }
    })
}
