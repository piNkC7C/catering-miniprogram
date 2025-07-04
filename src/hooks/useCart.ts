import { IResponseApi } from "@/api/type"
import { ICartItem, IGoodsItem, ICartRequest } from "@/redux/types/order"
import { setCartListAction } from "@/redux/modules/order"
import { useAppDispatch, useAppSelector } from "./useAppStore"
import { useMemo } from "react"
import { addCartGoodAPI, getCartListAPI, deleteCartGoodAPI, selectedCartAPI, clearCartAPI, batchAddCartGoodsAPI, getOrderGoodsListAPI, getGroupGoodsListAPI } from "@/api/order"
import { getShopDetailAPI, getShopListAPI } from "@/api/address"
import { useShopAndGoods } from "./useShopAndGoods"
import { navigateBack, navigateTo, showToast, switchTab } from "@tarojs/taro"
import { routes } from "@/utils/constants"
import { getLocation } from "@tarojs/taro"
import { setTableInfo } from "@/redux/modules/login"

export function useCart() {
    const dispatch = useAppDispatch()
    const {
        order: {
            cartList,
        },
        address: {
            currentShop,
        },
        login: {
            userInfo,
            tableInfo,
        }
    } = useAppSelector((state) => state)
    const { getGoodsQuantity, getAddressByLocation, setCurrentShop, handleGroupGoodsList } = useShopAndGoods()

    // 设置桌号
    const setTableInfoAction = (data: any) => {
        dispatch(setTableInfo(data))
    }

    // 获取购物车选中的列表
    const cartSelectedList = useMemo(() => {
        return cartList.filter((cartItem) => cartItem.selected)
    }, [cartList])
    // 获取购物车中的某个商品
    const getCartGood = (commodityId: number | undefined) => {
        if (!commodityId) {
            return null
        }
        return cartList.find((findItem) => {
            return findItem.commodityId === commodityId
        })
    }

    // 获取购物车中的某个商品的购买数量
    const getCartGoodCount = (commodityId: number) => {
        return cartList.find((findItem) => {
            return findItem.commodityId === commodityId
        })?.count
    }

    // 获取购物车列表
    const getCartList = () => {
        getCartListAPI({
            "deskId": tableInfo?.tableId || 0,
            "shopId": currentShop?.shopId!,
            "openId": userInfo?.openid!,
        }, (res: IResponseApi<any>) => {
            if (res.success) {
                dispatch(setCartListAction({
                    type: 'set',
                    data: res.data
                }))
            }
        })
    }

    // 修改购物车
    const modifyCart = (data: {
        commodityId: number,
        count: number,
        isSet: boolean,
        isAdd: Boolean,
        selected: boolean,
        classificationId: number,
        minimumPurchaseQuantity: number,
        purchaseQuantityLimit: number,
        standardPrice: number,
        mealQuantity: number,
        cartModifyReqVOList: any[],
    }) => {
        console.log('data', data);

        const queryData = {
            "commodityId": data.commodityId,
            "count": data.count,
            "isSet": data.isSet,
            "isAdd": data.isAdd,
            "selected": data.selected,
            "deskId": tableInfo?.tableId || 0,
            "shopId": currentShop?.shopId!,
            "openId": userInfo?.openid!,
            "classificationId": data.classificationId,
            "cartModifyReqVOList": data.cartModifyReqVOList,
            "minimumPurchaseQuantity": data.minimumPurchaseQuantity,
            "purchaseQuantityLimit": data.purchaseQuantityLimit,
            "standardPrice": data.standardPrice,
            "mealQuantity": data.mealQuantity,
        } as ICartRequest

        addCartGoodAPI(queryData, (res: IResponseApi<any>) => {
            if (res.success) {
                getCartList()
                if (data.isSet) {
                    navigateBack()
                }
            }
        })
    }

    // 批量添加购物车
    const batchAddCart = (goodsList: ICartItem[], shopId: number) => {
        const queryData = goodsList.map((item) => {
            return {
                "commodityId": item.commodityId,
                "count": item.count,
                "isSet": item.isSet,
                "isAdd": true,
                "selected": true,
                "deskId": 0,
                "shopId": shopId,
                "openId": userInfo?.openid!,
                "classificationId": item.classificationId,
                "cartModifyReqVOList": item.cartDOS || [],
                "minimumPurchaseQuantity": item.minimumPurchaseQuantity,
                "purchaseQuantityLimit": item.purchaseQuantityLimit,
                "standardPrice": item.price,
                "mealQuantity": getGoodsQuantity(item as any),
            } as ICartRequest
        })
        batchAddCartGoodsAPI(queryData, (res: IResponseApi<any>) => {
            if (res.success) {
                getCartListAPI({
                    "deskId": 0,
                    "shopId": shopId,
                    "openId": userInfo?.openid!,
                }, (res: IResponseApi<any>) => {
                    if (res.success) {
                        dispatch(setCartListAction({
                            type: 'set',
                            data: res.data
                        }))
                        switchTab({
                            url: routes.find((route) => route.name === 'order')?.path || ''
                        })
                    }
                })
            } else {
            }
        })
    }


    // 再来一单
    const againOrder = (orderId: number, shopId: number) => {
        // 获取店铺详情
        getShopDetailAPI({
            shopId: shopId
        }, (res: IResponseApi<any>) => {
            if (res.success) {
                // 获取商品列表
                getGroupGoodsListAPI({
                    shopId: shopId
                }, handleGroupGoodsList)
                // 如果店铺id不一致，则清空桌号，并设置当前店铺
                if (currentShop?.shopId !== shopId) {
                    setTableInfoAction(null)
                    setCurrentShop(res.data)
                }
                getOrderGoodsListAPI({
                    orderId: orderId
                }, (res: IResponseApi<any>) => {
                    if (res.success) {
                        batchAddCart(res.data, shopId)
                    } else {
                        showToast({
                            title: '操作失败',
                            icon: 'none'
                        })
                    }
                })
            }
        })
        // getLocation({
        //     type: 'wgs84',
        //     success: (res) => {
        //         getAddressByLocation(res.latitude, res.longitude, (res: IResponseApi<any>) => {
        //             if (res.success) {
        //                 getShopListAPI({
        //                     cityId: Number(res.data.result.ad_info.adcode.substring(0, 4)),
        //                     shopLongitude: res.data.result.ad_info.location.lng,
        //                     shopLatitude: res.data.result.ad_info.location.lat,
        //                     locationName: ''
        //                 }, (res: IResponseApi<any>) => {
        //                     if (res.success && res.data.shops && res.data.shops.length > 0) {

        //                     } else {
        //                         console.log('未找到附近的店铺')
        //                     }
        //                 })
        //             }
        //         })
        //     },
        //     fail: (err) => {
        //         console.log(err)
        //     },
        // }).catch(() => {
        // })
    }

    // 删除购物车某个商品
    const deleteCart = (commodityId: number) => {
        deleteCartGoodAPI({
            "commodityId": commodityId,
            "isSet": false,
            "deskId": tableInfo?.tableId || 0,
            "shopId": currentShop?.shopId!,
            "openId": userInfo?.openid!,
        }, (res: IResponseApi<any>) => {
            if (res.success) {
                getCartList()
            }
        })
    }

    // 清空购物车
    const clearCart = () => {
        clearCartAPI({
            "deskId": tableInfo?.tableId || 0,
            "shopId": currentShop?.shopId!,
            "openId": userInfo?.openid!,
        }, (res: IResponseApi<any>) => {
            if (res.success && res.data) {
                dispatch(setCartListAction({ type: 'clear' }))
            }
        })
    }


    // 购物车选中状态修改，传入购物车列表和状态
    const modifyCartSelected = (list: ICartItem[], state: boolean) => {
        const queryDataList = list.map((item) => ({
            ...item,
            selected: state,
            shopId: currentShop?.shopId!,
            deskId: tableInfo?.tableId || 0,
            openId: userInfo?.openid!,
        }))
        selectedCartAPI(queryDataList, (res: IResponseApi<any>) => {
            if (res.success) {
                getCartList()
            }
        })
    }

    return {
        cartSelectedList,
        getCartGood,
        getCartGoodCount,
        getCartList,
        modifyCart,
        deleteCart,
        modifyCartSelected,
        clearCart,
        batchAddCart,
        againOrder,
    }
}