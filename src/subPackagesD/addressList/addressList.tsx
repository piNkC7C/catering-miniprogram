import { useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { useLoad, getSystemInfoSync, getMenuButtonBoundingClientRect, navigateBack, navigateTo, useDidShow, Snapshot } from '@tarojs/taro'
import './addressList.scss'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { pxTransform, Image, Button, Divider, Tabs, Empty } from '@nutui/nutui-react-taro'
import { ArrowLeft, Search } from '@nutui/icons-react-taro'
import AddressCard from '@/components/addressCard'
import { routes, noAddress } from '@/utils/constants'
import { setAddressListAction } from '@/redux/modules/address'
import { getAddressListAPI } from '@/api/address'
import type { IResponseApi } from '@/api/type'

export default function AddressList() {
    // 获取登录状态和用户信息
    const {
        login: {
            loginStatus,
            userInfo
        },
        address: {
            addressList
        }
    } = useAppSelector((state) => state)

    const dispatch = useAppDispatch()

    const getAddressList = (apiRes: IResponseApi<any>) => {
        if (apiRes.success) {
            dispatch(setAddressListAction({
                type: 'set',
                data: apiRes.data
            }))
        } else {
            console.log('获取地址列表出错：', apiRes.data);
        }
    }

    useDidShow(() => {
        getAddressListAPI(getAddressList)
    })

    const { statusBarHeight, windowHeight, windowWidth } = getSystemInfoSync()
    const finalStatusBarHeight = statusBarHeight || 0
    // 获取胶囊按钮信息
    const { top: topMenuButton, height: heightMenuButton, width: widthMenuButton, left: leftMenuButton, right: rightMenuButton } = getMenuButtonBoundingClientRect()
    // 导航栏高度 = 胶囊按钮顶部位置 + (胶囊按钮高度 + 两边距离和)/2
    const navBarHeight = (topMenuButton - finalStatusBarHeight) * 2 + heightMenuButton
    // 总高度
    const navHeight = finalStatusBarHeight + navBarHeight + 5
    const viewHeight = windowHeight - navHeight

    return (
        <View
            className='address-list-page'
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
                                navigateBack()
                            }}
                        />
                    </View>
                    <View
                        className='nav-middle'
                    >
                        <Text> 我的收货地址 </Text>
                    </View>
                </View>
            </View>
            <View
                className='content'
                style={{
                    padding: pxTransform(windowWidth * 0.04),
                    width: `calc(100% - ${pxTransform(windowWidth * 0.08)})`,
                    height: pxTransform(viewHeight * 0.9 - windowWidth * 0.08),
                }}
            >
                {
                    addressList.map((item) => (
                        <AddressCard key={item.id} addressItem={item} />
                    ))
                }
                {
                    addressList.length === 0 && (
                        <Empty
                            style={{
                                backgroundColor: 'transparent',
                            }}
                            image={
                                <Image
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                    }}
                                    src={noAddress}
                                />
                            }
                        />
                    )
                }
            </View>
            <View
                className='add-address'
                style={{
                    padding: pxTransform(windowWidth * 0.04),
                    width: `calc(100% - ${pxTransform(windowWidth * 0.08)})`,
                    height: pxTransform(viewHeight * 0.1 - windowWidth * 0.08),
                }}
            >
                <Button
                    type='primary'
                    size='normal'
                    style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: pxTransform(windowWidth * 0.06),
                    }}
                    onClick={() => {
                        navigateTo({
                            url: routes.find((route) => route.name === 'address')?.path || '',
                        })
                    }}
                >添加地址</Button>
            </View>
        </View>
    )
} 