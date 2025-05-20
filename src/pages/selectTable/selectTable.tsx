import { useState, useEffect } from 'react'
import { View, Text, Span } from '@tarojs/components'
import { useLoad, getSystemInfoSync, getMenuButtonBoundingClientRect, navigateTo, switchTab } from '@tarojs/taro'
import './selectTable.scss'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { setLoginStatus, userInfoAction } from '@/redux/modules/login'
import { pxTransform, Button, Image, Grid, Popup, Checkbox, Space, Toast } from '@nutui/nutui-react-taro'
import { ArrowRight, Close, Home } from '@nutui/icons-react-taro'
import userNoLogin from '@/assets/index/user-nologin@2x.png'

export default function SelectTable() {
    // 获取登录状态和用户信息
    const {
        login: {
            loginStatus,
            userInfo
        }
    } = useAppSelector((state) => state)

    const { statusBarHeight, windowHeight, windowWidth } = getSystemInfoSync()
    const finalStatusBarHeight = statusBarHeight || 0
    // 获取胶囊按钮信息
    const { top: topMenuButton, height: heightMenuButton, width: widthMenuButton, left: leftMenuButton } = getMenuButtonBoundingClientRect()
    // 导航栏高度 = 胶囊按钮顶部位置 + (胶囊按钮高度 + 两边距离和)/2
    const navBarHeight = (topMenuButton - finalStatusBarHeight) * 2 + heightMenuButton
    // 总高度
    const navHeight = finalStatusBarHeight + navBarHeight + 5
    // 获取可视区域高度
    const viewHeight = windowHeight - navHeight

    return (
        <View
            className='select-table'
            style={{
                fontSize: pxTransform(16),
            }}
        >
            <View
                className='backIndex'
                style={{
                    width: pxTransform(windowWidth * 0.1),
                    height: pxTransform(windowWidth * 0.1),
                    borderRadius: pxTransform(windowWidth * 0.05),
                    top: topMenuButton,
                    left: windowWidth - widthMenuButton - leftMenuButton,
                }}
                onClick={() => {
                    navigateTo({
                        url: '/pages/index/index',
                    })
                }}
            >
                <Home />
            </View>
            <View
                className='content'
                style={{
                    padding: `0 ${pxTransform(windowWidth * 0.1)}`,
                    width: `calc(100% - ${pxTransform(windowWidth * 0.2)})`,
                }}
            >
                <View
                    className='icon'
                    style={{
                        fontSize: pxTransform(windowWidth * 0.045),
                    }}
                >
                    <Image
                        src={userNoLogin}
                        width={pxTransform(windowWidth * 0.1)}
                        height={pxTransform(windowWidth * 0.1)}
                    />
                    <Text
                        style={{
                            marginTop: pxTransform(windowWidth * 0.02),
                        }}
                    >欢迎光临某某某店</Text>
                    <Text
                        style={{
                            marginTop: pxTransform(windowWidth * 0.02),
                        }}
                    >祝您用餐愉快～</Text>
                </View>
                <View
                    className='table-list'
                    style={{
                        marginTop: pxTransform(windowWidth * 0.035),
                    }}
                >
                    <View
                    className='top'
                    >
                        <View
                            className='table-number'
                            style={{
                                fontSize: pxTransform(windowWidth * 0.045),
                            }}
                        >
                            桌号{5}
                        </View>
                    </View>
                    <View
                    className='bottom'
                    style={{
                    }}
                    ></View>
                </View>
            </View>
        </View>
    )
}
