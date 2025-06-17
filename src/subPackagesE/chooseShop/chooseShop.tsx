import { useEffect, useState } from 'react'
import { View, Text, ScrollView, Map, MapProps } from '@tarojs/components'
import { useLoad, useLaunch, getSystemInfoSync, getMenuButtonBoundingClientRect, navigateBack, getLocation, useRouter, switchTab, chooseLocation, choosePoi } from '@tarojs/taro'
import './chooseShop.scss'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { pxTransform, Image, Button, Divider, Tabs, SearchBar, Popover, Cascader, CascaderOption, Loading, Input } from '@nutui/nutui-react-taro'
import { ArrowLeft, Search, ArrowDown, Location } from '@nutui/icons-react-taro'
import { userNologin, locationLogo, routes } from '@/utils/constants'
import ShopCard from '@/components/shopCard'
import { setCurrentShopAction, setShopListAction, setNowAddressAction } from '@/redux/modules/address'
import { qqmapsdkKey } from '@/utils/constants'
import QQMapWX from '@/libs/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js'
import { getAreaDataAPI, getShopListAPI } from '@/api/address'
import type { IResponseApi } from '@/api/type'
import type { IShopItem } from '@/redux/types/address'

export default function ChooseShop() {
    // 获取登录状态和用户信息
    const {
        // login: {
        //     loginStatus,
        //     userInfo
        // },
        address: {
            shopList,
            nowAddress
        }
    } = useAppSelector((state) => state)
    const dispatch = useAppDispatch()
    let qqmapsdk: any

    const [markersList, setMarkersList] = useState<MapProps.marker[]>([])

    // 选择地址
    const [selectAddCascaderVis, setSelectAddCascaderVis] = useState(false)
    const [value, setValue] = useState<any>([])
    const [nowPath, setNowPath] = useState<any>([])
    const [isValueInit, setIsValueInit] = useState(false)

    // 门店名称搜索
    const [shopName, setShopName] = useState('')

    const loadCascaderItemData = (
        node: CascaderOption,
        level: number
    ): Promise<CascaderOption[]> => {
        // console.log(node, level);
        return new Promise((resolve) => {
            getAreaDataAPI({
                id: !node.text && level == 0 ? 0 : !node.text && level == 1 ? Number(node.value?.toString().substring(0, 2)) : Number(node.value)
            }, (res: IResponseApi<any>) => {
                if (res.success) {
                    const list = res.data.map(item => {
                        return {
                            value: item.id,
                            text: item.extName,
                            leaf: item.deep == 1
                        }
                    })
                    // console.log('list', list);
                    resolve(list)
                } else {
                    resolve([])
                }
            })
        })
    }
    const onChange = (value: any, path: any) => {
        // console.log(value, path);
        setValue(value)
        setNowPath(path)
        getShopListAPI({
            cityId: Number(path[1]?.value),
            shopLongitude: nowAddress.ad_info.location.lng,
            shopLatitude: nowAddress.ad_info.location.lat,
            locationName: shopName
        }, getShopList)
        // const address = path.map(item => item.text).join('')
        // getLocationByAddress(address)
    }

    // 分页相关状态
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(false)
    const [cursor, setCursor] = useState<number | null>(null)
    const [isInitialLoad, setIsInitialLoad] = useState(true)

    // 获取门店列表
    const getShopList = (res: IResponseApi<{
        shops: IShopItem[]
        hasMore: boolean
        nextCursor: number
        init: boolean
    }>) => {
        // console.log('门店列表', res);

        if (res.success) {
            setCursor(res.data.nextCursor)
            setHasMore(res.data.hasMore)
            if (res.data.init) {
                setMarkersList(res.data.shops.map(item => {
                    return {
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
                    }
                }))
                dispatch(setShopListAction({
                    type: 'set',
                    data: res.data.shops
                }))
            } else {
                const newShopList = markersList.concat(res.data.shops.map(item => {
                    return {
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
                    }
                }))
                setMarkersList(newShopList)
                dispatch(setShopListAction({
                    type: 'add',
                    data: res.data.shops
                }))
            }
            setLoading(false)
            // 初始化完成后设置可以显示加载更多提示
            setIsInitialLoad(false)
        } else {
            console.log('获取门店列表失败', res);
        }
    }

    // 逆解析经纬度获取地址信息
    const getAddressByLocation = (latitude, longitude, set = false) => {
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
                // if (set) {
                setValue([Number(res.result.ad_info.adcode.substring(0, 2)), Number(res.result.ad_info.adcode.substring(0, 4))])
                // }
                setIsValueInit(true)
                dispatch(setNowAddressAction({
                    type: 'set',
                    data: res.result
                }))
                getShopListAPI({
                    cityId: Number(res.result.ad_info.adcode.substring(0, 4)),
                    shopLongitude: res.result.ad_info.location.lng,
                    shopLatitude: res.result.ad_info.location.lat,
                    locationName: shopName
                }, getShopList)
            },
            fail(err) {
                console.error('逆解析失败:', err);
            }
        });
    };

    // 解析地址获取经纬度
    // const getLocationByAddress = (address) => {
    //     qqmapsdk = new QQMapWX({
    //         key: qqmapsdkKey
    //     })
    //     qqmapsdk.geocoder({
    //         address,
    //         success(res) {
    //             console.log('解析成功:', res.result);
    //             getAddressByLocation(res.result.location.lat, res.result.location.lng)
    //         },
    //         fail(err) {
    //             console.error('解析失败:', err);
    //         }
    //     });
    // };

    useLoad(() => {
        getLocation({
            type: 'wgs84',
            success: (res) => {
                if (!nowAddress) {
                    getAddressByLocation(res.latitude, res.longitude, true)
                } else {
                    setValue([Number(nowAddress.ad_info.adcode.substring(0, 2)), Number(nowAddress.ad_info.adcode.substring(0, 4))])
                    // }
                    setIsValueInit(true)
                    getShopListAPI({
                        cityId: Number(nowAddress.ad_info.adcode.substring(0, 4)),
                        shopLongitude: nowAddress.ad_info.location.lng,
                        shopLatitude: nowAddress.ad_info.location.lat,
                        locationName: shopName
                    }, getShopList)
                }
            },
            fail: (err) => {
                console.log(err)
                setIsInitialLoad(false)
            },
        }).catch(() => {
        })
    })

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

    // 加载更多门店
    const loadMoreShops = async () => {
        if (loading || !hasMore) return

        setLoading(true)
        try {
            // console.log('加载更多门店', { cursor, hasMore })
            getShopListAPI({
                locationName: shopName,
                cityId: nowPath.length > 0 ? nowPath[1]?.value : Number(nowAddress.ad_info.adcode.substring(0, 4)),
                shopLongitude: nowAddress.ad_info.location.lng,
                shopLatitude: nowAddress.ad_info.location.lat,
                pageSize: 5,
                cursorDistance: cursor
            }, getShopList)
        } catch (error) {
            console.error('加载门店失败:', error)
            setLoading(false)
        }
    }

    // 滚动到底部触发加载更多
    const handleScrollToLower = () => {
        loadMoreShops()
    }

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
                        longitude={shopList[0]?.shopLongitude}
                        latitude={shopList[0]?.shopLatitude}
                        // longitude={120.21201}
                        // latitude={30.2084}
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
                        className='search-address'
                    >
                        <View
                            className='custom-search-bar'
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: '#f5f5f5',
                                borderRadius: '10rpx',
                                padding: '8px 12px',
                                width: '100%',
                                boxSizing: 'border-box',
                            }}
                        >
                            <View
                                style={{
                                    fontSize: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginRight: '10px',
                                    flexShrink: 0,
                                }}
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    setSelectAddCascaderVis(true)
                                }}
                            >
                                {nowPath.length > 0 ? nowPath[1]?.text : nowAddress?.ad_info.city}
                                <ArrowDown size={12} style={{ marginLeft: '4px' }} />
                            </View>
                            <View
                                style={{
                                    borderLeft: '1px solid #ddd',
                                    height: '16px',
                                    marginRight: '10px',
                                    flexShrink: 0,
                                }}
                            />
                            <Input
                                style={{
                                    flex: 1,
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    fontSize: '14px',
                                    outline: 'none',
                                }}
                                placeholder="请输入门店名称"
                                value={shopName}
                                onChange={(value) => {
                                    setShopName(value)
                                    getShopListAPI({
                                        locationName: value,
                                        cityId: nowPath.length > 0 ? nowPath[1]?.value : Number(nowAddress.ad_info.adcode.substring(0, 4)),
                                        shopLongitude: nowAddress.ad_info.location.lng,
                                        shopLatitude: nowAddress.ad_info.location.lat,
                                    }, getShopList)
                                }}
                            />
                            <View
                                style={{
                                    borderLeft: '1px solid #ddd',
                                    height: '16px',
                                    marginRight: '10px',
                                    flexShrink: 0,
                                }}
                            />
                            <View
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginLeft: '8px',
                                    flexShrink: 0,
                                    padding: '4px',
                                }}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    e.preventDefault()
                                    setIsValueInit(false)

                                    // console.log('nowAddress', nowAddress);

                                    chooseLocation({
                                        latitude: nowAddress.ad_info.location.lat,
                                        longitude: nowAddress.ad_info.location.lng,
                                        success: (res) => {
                                            getAddressByLocation(res.latitude, res.longitude)
                                        }
                                    })
                                }}
                            >
                                <Location size={16} style={{ color: '#999' }} />
                            </View>
                        </View>
                    </View>
                    <View
                        className='shop-list-title'
                    >
                        可在线点单
                    </View>
                    <ScrollView
                        className='shop-list'
                        scrollY
                        onScrollToLower={handleScrollToLower}
                        lowerThreshold={50}
                        style={{
                            height: pxTransform(viewHeight * 0.35),
                        }}
                    >
                        {
                            shopList.map(item => (
                                <ShopCard
                                    key={item.shopId}
                                    shopItem={item}
                                    type={type}
                                />
                            ))
                        }

                        {/* 加载提示 */}
                        {!isInitialLoad && (
                            <View
                                className='load-more-tip'
                                style={{
                                    padding: pxTransform(windowHeight * 0.02),
                                    textAlign: 'center',
                                    color: '#999',
                                    fontSize: '14px'
                                }}
                            >
                                {loading ? (
                                    <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Loading type="spinner" />
                                        <Text style={{ marginLeft: '8px' }}>加载中...</Text>
                                    </View>
                                ) : hasMore ? (
                                    <Text>上滑加载更多门店</Text>
                                ) : (
                                    <Text>没有更多门店了</Text>
                                )}
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>
            {
                isValueInit && (
                    <Cascader
                        visible={selectAddCascaderVis}
                        defaultValue={value}
                        title="选择地址"
                        closeable
                        onClose={() => {
                            setSelectAddCascaderVis(false)
                        }}
                        onChange={onChange}
                        lazy
                        onLoad={loadCascaderItemData}
                    />
                )
            }
        </View>
    )
} 