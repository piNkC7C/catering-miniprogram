import { useEffect, useState } from 'react'
import { View, Text, ScrollView, Map, MapProps } from '@tarojs/components'
import { useLoad, getSystemInfoSync, getMenuButtonBoundingClientRect, navigateBack, getLocation, useRouter, switchTab, chooseLocation, choosePoi } from '@tarojs/taro'
import './chooseShop.scss'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { pxTransform, Image, Button, Divider, Tabs, SearchBar, Popover, Cascader, CascaderOption } from '@nutui/nutui-react-taro'
import { ArrowLeft, Search, ArrowDown } from '@nutui/icons-react-taro'
import { userNologin, locationLogo, routes } from '@/utils/constants'
import ShopCard from '@/components/shopCard'
import { setCurrentShopAction } from '@/redux/modules/address'
import { qqmapsdkKey } from '@/utils/constants'
import QQMapWX from '@/libs/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js'
import { getAreaDataAPI } from '@/api/address'
import { IResponseApi } from '@/api/type'

export default function ChooseShop() {
    // 获取登录状态和用户信息
    const {
        // login: {
        //     loginStatus,
        //     userInfo
        // },
        address: {
            shopList
        }
    } = useAppSelector((state) => state)
    const dispatch = useAppDispatch()

    const [nowAddress, setNowAddress] = useState<any>(null)
    const [markersList, setMarkersList] = useState<MapProps.marker[]>([])

    let qqmapsdk: any

    // 逆解析经纬度获取地址信息
    const getAddressByLocation = (latitude, longitude) => {
        qqmapsdk.reverseGeocoder({
            location: {
                latitude,
                longitude
            },
            success(res) {
                console.log('逆解析成功:', res.result);
                setNowAddress(res.result)
            },
            fail(err) {
                console.error('逆解析失败:', err);
            }
        });
    };

    useLoad(() => {
        qqmapsdk = new QQMapWX({
            key: qqmapsdkKey
        })

        getLocation({
            type: 'wgs84',
            success: (res) => {
                // console.log(res)
                getAddressByLocation(res.latitude, res.longitude)
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

    // 选择地址
    const [selectAddCascaderVis, setSelectAddCascaderVis] = useState(false)
    const [value, setValue] = useState<any>([0, 33, 3301])

    const loadCascaderItemData = (
        node: CascaderOption,
        level: number
    ): Promise<CascaderOption[]> => {
        return new Promise((resolve) => {
            if (level == 0) {
                resolve([
                    {
                        value: 0,
                        text: '中国',
                        leaf: false
                    }
                ])
            } else {
                getAreaDataAPI({
                    id: value[level - 1]
                }, (res: IResponseApi<any>) => {
                    if (res.success) {
                        const list = res.data.map(item => {
                            return {
                                value: item.id,
                                text: item.extName,
                                leaf: item.deep == 2
                            }
                        })
                        console.log('list', list);
                        resolve(list)
                    } else {
                        resolve([])
                    }
                })
            }
        })
    }
    const onChange = (value: any, path: any) => {
        setValue(value)
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
                        className='search-address'
                    >
                        <View
                            className='custom-search-bar'
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: '#f5f5f5',
                                borderRadius: '20px',
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
                                {nowAddress?.address_component.city}
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
                            <View
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: '#999',
                                    fontSize: '14px',
                                }}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    e.preventDefault()

                                    chooseLocation({
                                        latitude: nowAddress.ad_info.lat,
                                        longitude: nowAddress.ad_info.lng,
                                        success: (res) => {
                                            getAddressByLocation(res.latitude, res.longitude)
                                        }
                                    })
                                }}
                            >
                                {/* <Search size={16} style={{ marginRight: '8px', color: '#999' }} /> */}
                                {nowAddress?.formatted_addresses.recommend || ''}
                            </View>
                        </View>
                    </View>
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
                                    type={type}
                                />
                            ))
                        }
                    </View>
                </View>
            </View>
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
        </View>
    )
} 