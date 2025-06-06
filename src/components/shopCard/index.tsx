import { useEffect, useState, memo } from 'react'
import { View, Text, ScrollView, Map, MapProps } from '@tarojs/components'
import { useLoad, getSystemInfoSync, getMenuButtonBoundingClientRect, navigateBack, getLocation, makePhoneCall, openLocation, switchTab } from '@tarojs/taro'
import './index.scss'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { pxTransform, Image, Button, Divider, Tabs, ActionSheet } from '@nutui/nutui-react-taro'
import { ArrowLeft, Search, IconFont } from '@nutui/icons-react-taro'
import { userNologin, locationLogo, callmeIcon, getLocationIcon, routes } from '@/utils/constants'
import { formatDistance } from '@/utils/formatUtils'
import { IShopItem } from '@/redux/types/address'
import equal from 'fast-deep-equal'
import { setCurrentShopAction, setAddSuggestChooseShopAction } from '@/redux/modules/address'

function ShopCard({ shopItem, type }: { shopItem: IShopItem, type?: string }) {
    // 获取登录状态和用户信息
    const {
        login: {
            loginStatus,
            userInfo
        },
        address: {
            addSuggestChooseShop
        }
    } = useAppSelector((state) => state)
    const dispatch = useAppDispatch()

    const { statusBarHeight, windowHeight, windowWidth } = getSystemInfoSync()
    const finalStatusBarHeight = statusBarHeight || 0
    // 获取胶囊按钮信息
    const { top: topMenuButton, height: heightMenuButton, width: widthMenuButton, left: leftMenuButton, right: rightMenuButton } = getMenuButtonBoundingClientRect()
    // 导航栏高度 = 胶囊按钮顶部位置 + (胶囊按钮高度 + 两边距离和)/2
    const navBarHeight = (topMenuButton - finalStatusBarHeight) * 2 + heightMenuButton
    // 总高度
    const navHeight = finalStatusBarHeight + navBarHeight + 5
    const viewHeight = windowHeight - navHeight

    // 联系电话弹窗
    const [isVisible, setIsVisible] = useState(false)
    const handleSelect = (option: any) => {
        makePhoneCall({
            phoneNumber: option.name,
            success: () => {
                console.log('拨打电话成功')
            },
            fail: () => {
                console.log('拨打电话失败')
            }
        })
        setIsVisible(false)
    }

    // 是否点击了门店
    const [isClickShop, setIsClickShop] = useState(false)

    return (
        <View
            className='shop-card'
            style={{
                padding: pxTransform(windowWidth * 0.02),
                marginBottom: pxTransform(windowHeight * 0.01),
                // width: `calc(100% - ${pxTransform(windowWidth * 0.04)} - 4px)`,
                borderRadius: pxTransform(windowWidth * 0.015),
                borderColor: isClickShop ? '#FA2400' : '#CCC',
            }}
            onClick={() => {
                if (type && type === 'suggest') {
                    dispatch(setAddSuggestChooseShopAction({
                        type: 'set',
                        data: shopItem
                    }))
                    navigateBack()
                    return
                }
                setIsClickShop(true)
                dispatch(setCurrentShopAction({
                    type: 'set',
                    data: shopItem
                }))
                setTimeout(() => {
                    switchTab({
                        url: (routes.find((route) => route.name === 'order')?.path || ''),
                    })
                }, 300)
            }}
        >
            <View className='shop-card-left'>
                <Text
                    className='shop-card-left-name shop-card-left-text'
                >{shopItem.shopName}</Text>
                <Text
                    className='shop-card-left-address shop-card-left-text'
                >{shopItem.shopProvince}{shopItem.shopCity}{shopItem.shopArea}{shopItem.shopStreet}{shopItem.shopDetail}</Text>
                <Text
                    className='shop-card-left-time'
                >{shopItem.businessStartTime}-{shopItem.businessEndTime}</Text>
            </View>
            <View className='shop-card-right'>
                <Text
                    className='shop-card-right-distance'
                >{formatDistance(shopItem.shopDistance)}</Text>
                <View
                    className='shop-card-right-operation'
                >
                    <IconFont
                        size={30}
                        style={{ width: 30, height: 30, marginRight: '25rpx' }}
                        name={callmeIcon}
                        onClick={() => setIsVisible(true)}
                    />
                    <IconFont
                        size={30}
                        style={{ width: 30, height: 30 }}
                        name={getLocationIcon}
                        onClick={() => {
                            openLocation({
                                latitude: shopItem.shopLatitude,
                                longitude: shopItem.shopLongitude,
                                name: shopItem.shopName,
                                address: shopItem.shopProvince + shopItem.shopCity + shopItem.shopArea + shopItem.shopStreet + shopItem.shopDetail,
                                success: () => {
                                    console.log('获取位置成功')
                                },
                            })
                        }}
                    />
                </View>
            </View>
            <ActionSheet
                visible={isVisible}
                cancelText="取消"
                options={[
                    {
                        name: '010-2558965',
                    }
                ]}
                onSelect={handleSelect}
                onCancel={() => setIsVisible(false)}
            />
        </View>
    )
}

export default memo(ShopCard, (prevProps, nextProps) => {
    if (!equal(prevProps.shopItem, nextProps.shopItem)) {
        return false
    }
    if (prevProps.type !== nextProps.type) {
        return false
    }
    return true
})