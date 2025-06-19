import { useEffect, useState } from "react"
import { getLocation } from "@tarojs/taro"
import { IResponseApi } from "@/api/type"
import { IGroupGoodsList } from "@/redux/types/order"
import { setOrderTabsListAction, setGroupGoodsListAction } from "@/redux/modules/order"
import { setNowAddressAction } from "@/redux/modules/address"
import { setCurrentShopAction } from "@/redux/modules/address"
import { getGroupGoodsListAPI } from "@/api/order"
import { getShopListAPI } from "@/api/address"
import { useAppDispatch } from "@/hooks/useAppStore"
import QQMapWX from '@/libs/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js'
import { qqmapsdkKey } from "@/utils/constants"
import { IShopItem } from "@/redux/types/address"
import { IGoodsItem } from "@/redux/types/order"

export function useShopAndGoods() {
    const dispatch = useAppDispatch()
    const [finish, setFinish] = useState(false)

    const setOrderTabsList = (orderData: IGroupGoodsList[]) => {
        dispatch(setOrderTabsListAction({
            type: 'set',
            data: orderData,
        }))
    }

    const setGroupGoodsList = (orderData: IGroupGoodsList[]) => {
        dispatch(setGroupGoodsListAction({
            type: 'set',
            data: orderData
        }))
    }

    const setNowAddress = (address: any) => {
        dispatch(setNowAddressAction({
            type: 'set',
            data: address
        }))
    }

    const setCurrentShop = (shop: IShopItem) => {
        dispatch(setCurrentShopAction({
            type: 'set',
            data: shop
        }))
    }

    const handleGroupGoodsList = (res: IResponseApi<IGroupGoodsList[]>) => {
        if (res.success) {
            const orderData = res.data.sort((a, b) => a.classificationSorting - b.classificationSorting)
            setOrderTabsList(orderData)
            setGroupGoodsList(orderData)
            setFinish(true)
        } else {
            console.log('获取商品列表失败:', res)
        }
    }

    const handleAutoSelectShop = (res: IResponseApi<any>) => {
        if (res.success) {
            setNowAddress(res.data.result)
            getShopListAPI({
                cityId: Number(res.data.result.ad_info.adcode.substring(0, 4)),
                shopLongitude: res.data.result.ad_info.location.lng,
                shopLatitude: res.data.result.ad_info.location.lat,
                locationName: ''
            }, (res: IResponseApi<any>) => {
                if (res.success && res.data.shops && res.data.shops.length > 0) {
                    setCurrentShop(res.data.shops[0])
                    getGroupGoodsListAPI({
                        shopId: res.data.shops[0].shopId
                    }, handleGroupGoodsList)
                } else {
                    console.log('未找到附近的店铺')
                }
            })
        }
    }

    // 获取商品库存数
    const getGoodsQuantity = (goodsItem: IGoodsItem) => {
        if (goodsItem.mealQuantity && goodsItem.mealQuantity != null) {
            return goodsItem.mealQuantity
        } else if (goodsItem.mealSpecQuantity && goodsItem.mealSpecQuantity != null) {
            return goodsItem.mealSpecQuantity
        } else {
            return 0
        }
    }

    let qqmapsdk: any
    const getAddressByLocation = (latitude: number, longitude: number, callback: (res: IResponseApi<any>) => void) => {
        qqmapsdk = new QQMapWX({
            key: qqmapsdkKey
        })
        qqmapsdk.reverseGeocoder({
            location: {
                latitude,
                longitude
            },
            success(res) {
                // console.log('逆解析成功:', res.result);
                callback({
                    success: true,
                    data: res
                })
            },
            fail(err) {
                console.error('逆解析失败:', err);
                callback({
                    success: false,
                    data: err
                })
            }
        });
    };
    return {
        finish,
        handleGroupGoodsList,
        getAddressByLocation,
        handleAutoSelectShop,
        getGoodsQuantity
    }
}