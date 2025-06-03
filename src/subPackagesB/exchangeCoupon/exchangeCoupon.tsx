import { useEffect, useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { useLoad, getSystemInfoSync, getMenuButtonBoundingClientRect, navigateBack, scanCode } from '@tarojs/taro'
import './exchangeCoupon.scss'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { pxTransform, Image, Button, Divider, Tabs, Input } from '@nutui/nutui-react-taro'
import { ArrowLeft, Search, ArrowRight, IconFont } from '@nutui/icons-react-taro'
import { ScanIcon } from '@/utils/constants'

export default function ExchangeCoupon() {
    // 获取登录状态和用户信息
    const {
        login: {
            loginStatus,
            userInfo
        },
    } = useAppSelector((state) => state)

    // 当前选中的tab
    const [currentTabvalue, setCurrentTabvalue] = useState<string | number>('readme')

    const tabsList = [
        {
            label: '兑换码',
            value: 'readme',
        },
        {
            label: '兑换码和密钥',
            value: 'code',
        },
    ]

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
            className='exchange-coupon-page'
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
                        <Text> 兑换优惠券 </Text>
                    </View>
                </View>
            </View>
            <View
                className='content'
                style={{
                    height: pxTransform(viewHeight),
                }}
            >
                <Tabs
                    value={currentTabvalue}
                    onChange={(value) => {
                        // console.log('value', value)
                        setCurrentTabvalue(value)
                    }}
                    style={{
                        '--nutui-tabs-titles-background-color': '#fff',
                    } as any}
                >
                    {
                        tabsList.map((item) => (
                            <Tabs.TabPane title={item.label} value={item.value} />
                        ))
                    }
                </Tabs>
                <View
                    className='exchange'
                    style={{
                        margin: `${pxTransform(windowHeight * 0.01)} ${pxTransform(windowWidth * 0.05)}`,
                        height: pxTransform(windowHeight * 0.065),
                        width: `calc(100% - ${pxTransform(windowWidth * 0.1)})`,
                        borderRadius: pxTransform(windowWidth * 0.02),
                    }}
                >
                    <Input
                        placeholder="请输入兑换码"
                        style={{
                            marginLeft: pxTransform(windowWidth * 0.03),
                            flex: 1,
                            backgroundColor: 'transparent'
                        }}
                    />
                    <IconFont
                        size={windowWidth * 0.05}
                        style={{
                            marginRight: pxTransform(windowWidth * 0.03),
                        }}
                        name={ScanIcon}
                    // onClick={() => {
                    //     scanCode({
                    //         scanType: ['qrCode'],
                    //         success: (res) => {
                    //             console.log('res', res)
                    //         },
                    //         fail: (err) => {
                    //             console.log('err', err)
                    //         }
                    //     })
                    // }}
                    />
                </View>
                {
                    currentTabvalue === 'code' && (
                        <View
                            className='exchange'
                            style={{
                                margin: `${pxTransform(windowHeight * 0.01)} ${pxTransform(windowWidth * 0.05)}`,
                                height: pxTransform(windowHeight * 0.065),
                                width: `calc(100% - ${pxTransform(windowWidth * 0.1)})`,
                                borderRadius: pxTransform(windowWidth * 0.02),
                            }}
                        >
                            <Input
                                placeholder="请输入密钥"
                                style={{
                                    marginLeft: pxTransform(windowWidth * 0.03),
                                    flex: 1,
                                    backgroundColor: 'transparent'
                                }}
                            />
                            {/* <IconFont
                                size={windowWidth * 0.05}
                                style={{
                                    marginRight: pxTransform(windowWidth * 0.03),
                                }}
                                name={ScanIcon}
                            // onClick={() => {
                            //     scanCode({
                            //         scanType: ['qrCode'],
                            //         success: (res) => {
                            //             console.log('res', res)
                            //         },
                            //         fail: (err) => {
                            //             console.log('err', err)
                            //         }
                            //     })
                            // }}
                            /> */}
                        </View>
                    )
                }
            </View>
        </View>
    )
} 