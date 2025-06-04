import { useEffect, useState } from 'react'
import { View, Text, ScrollView, Map, MapProps } from '@tarojs/components'
import { useLoad, getSystemInfoSync, getMenuButtonBoundingClientRect, navigateBack, getLocation, useRouter, switchTab } from '@tarojs/taro'
import './chooseShop.scss'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { pxTransform, Image, Button, Divider, Tabs } from '@nutui/nutui-react-taro'
import { ArrowLeft, Search } from '@nutui/icons-react-taro'
import { userNologin, locationLogo, routes } from '@/utils/constants'
import ShopCard from '@/components/shopCard'
import { setCurrentShopAction } from '@/redux/modules/address'

export default function ChooseShop() {
    // 获取登录状态和用户信息
    const {
        login: {
            loginStatus,
            userInfo
        },
        address: {
            shopList
        }
    } = useAppSelector((state) => state)
    const dispatch = useAppDispatch()

    const router = useRouter()
    const { type } = router.params

    const { statusBarHeight, windowHeight, windowWidth } = getSystemInfoSync()
    const finalStatusBarHeight = statusBarHeight || 0
    // 获取胶囊按钮信息
    const { top: topMenuButton, height: heightMenuButton, width: widthMenuButton, left: leftMenuButton, right: rightMenuButton } = getMenuButtonBoundingClientRect()
    // 导航栏高度 = 胶囊按钮顶部位置 + (胶囊按钮高度 + 两边距离和)/2
    const navBarHeight = (topMenuButton - finalStatusBarHeight) * 2 + heightMenuButton
    // 总高度
    const navHeight = finalStatusBarHeight + navBarHeight + 5
    const viewHeight = windowHeight - navHeight

    const [markersList, setMarkersList] = useState<MapProps.marker[]>([])

    useEffect(() => {
        getLocation({
            type: 'wgs84',
            success: (res) => {
                console.log(res)
                setMarkersList(shopList.map(item => ({
                    id: item.shopId,
                    longitude: item.shopLongitude,
                    latitude: item.shopLatitude,
                    title: item.shopName,
                    iconPath: locationLogo,
                    width: pxTransform(windowWidth * 0.08),
                    height: pxTransform(windowWidth * 0.08),
                    callout: {
                        content: item.shopName + ' >',
                        color: '#333',
                        fontSize: 14,
                        anchorX: 0.5,
                        anchorY: 0.5,
                        borderRadius: 4,
                        bgColor: '#fff',
                        padding: 8,
                        display: 'ALWAYS',
                        borderWidth: 0,
                        borderColor: '#333',
                        textAlign: 'center',
                    }
                })))
            },
            fail: (err) => {
                console.log(err)
            },
        })
    }, [])

    return (
        <View
            className='choose-shop-page'
        >
            <View
                className='nav'
                style={{
                    height: pxTransform(navHeight),
                }}
            >
                <View
                    className='nav-content'
                    style={{
                        top: pxTransform(topMenuButton),
                        height: pxTransform(heightMenuButton),
                    }}
                >
                    <View
                        className='nav-left'
                        style={{
                            padding: `0 ${pxTransform(windowWidth * 0.02)}`,
                            left: pxTransform(windowWidth - widthMenuButton - leftMenuButton),
                            width: `calc(${pxTransform(widthMenuButton / 2)} - ${pxTransform(windowWidth * 0.04)})`,
                        }}
                    >
                        <ArrowLeft
                            size={pxTransform(windowWidth * 0.05)}
                            onClick={() => {
                                if (type && type === 'init') {
                                    switchTab({
                                        url: routes.find((route) => route.name === 'index')?.path || '',
                                    })
                                    return
                                }
                                navigateBack()
                            }}
                        />
                    </View>
                    <View
                        className='nav-middle'
                    >
                        <Text> 选择店铺 </Text>
                    </View>
                </View>
            </View>
            <View
                className='content'
                style={{
                    height: pxTransform(viewHeight),
                    width: pxTransform(windowWidth),
                }}
            >
                <View
                    className='page-map'
                    style={{
                        width: pxTransform(windowWidth),
                        height: pxTransform(viewHeight * 0.5),
                    }}
                >
                    <Map
                        className='map'
                        longitude={shopList[0].shopLongitude}
                        latitude={shopList[0].shopLatitude}
                        scale={16}
                        markers={markersList}
                        // showLocation
                        onError={() => {
                            console.log('地图加载失败')
                        }}
                    />
                </View>
                <View
                    className='page-list'
                    style={{
                        padding: `${pxTransform(windowHeight * 0.01)} ${pxTransform(windowWidth * 0.02)}`,
                        width: pxTransform(windowWidth * 0.96),
                        height: pxTransform(viewHeight * 0.55),
                        borderTopLeftRadius: pxTransform(viewHeight * 0.03),
                        borderTopRightRadius: pxTransform(viewHeight * 0.03),
                    }}
                >
                <View
                    className='shop-list-title'
                >
                    可在线点单
                </View>
                    <View
                        className='shop-list'
                    >
                        {
                            shopList.map(item => (
                                <ShopCard 
                                key={item.shopId} 
                                shopItem={item} 
                                />
                            ))
                        }
                    </View>
                </View>
            </View>
        </View>
    )
} 