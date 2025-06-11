import { useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { useLoad, getSystemInfoSync, getMenuButtonBoundingClientRect, navigateBack } from '@tarojs/taro'
import './pointsDetail.scss'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { pxTransform, Image, Button, Divider, Tabs } from '@nutui/nutui-react-taro'
import { ArrowLeft, Search } from '@nutui/icons-react-taro'
import { pointsListAction, pointsDetailListAction } from '@/redux/modules/points'

export default function PointsDetail() {
    // 获取登录状态和用户信息
    const {
        points: {
            pointsDetailList
        }
    } = useAppSelector((state) => state)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(pointsDetailListAction({
            type: 'set',
            data: [
                {
                    id: 1,
                    name: '兑换使用',
                    points: 1000,
                    time: '2025-01-01 12:00:00',
                    type: 0,
                    left: 0,
                },
                {
                    id: 2,
                    name: '消费增加',
                    points: 300,
                    time: '2024-01-01 12:00:00',
                    type: 1,
                    left: 1000,
                },
                {
                    id: 3,
                    name: '消费增加',
                    points: 400,
                    time: '2023-01-01 12:00:00',
                    type: 1,
                    left: 700,
                },
                {
                    id: 4,
                    name: '消费增加',
                    points: 300,
                    time: '2022-01-01 12:00:00',
                    type: 1,
                    left: 300,
                }
            ]
        }))
    }, [])

    const { statusBarHeight, windowHeight, windowWidth } = getSystemInfoSync()
    const finalStatusBarHeight = statusBarHeight || 0
    // 获取胶囊按钮信息
    const { top: topMenuButton, height: heightMenuButton, width: widthMenuButton, left: leftMenuButton } = getMenuButtonBoundingClientRect()
    // 导航栏高度 = 胶囊按钮顶部位置 + (胶囊按钮高度 + 两边距离和)/2
    const navBarHeight = (topMenuButton - finalStatusBarHeight) * 2 + heightMenuButton
    // 总高度
    const navHeight = finalStatusBarHeight + navBarHeight + 5
    const viewHeight = windowHeight - navHeight

    return (
        <View
            className='points-detail-page'
        >
            <View
                className='points-detail-nav'
                style={{
                    height: navHeight,
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
                        <Text>积分明细</Text>
                    </View>
                </View>
            </View>
            <View
                className='points-detail-list'
                style={{
                    height: viewHeight,
                }}
            >
                {
                    pointsDetailList && pointsDetailList.length && pointsDetailList.map((item) => (
                        <View
                            key={item.id}
                            className='detail-item'
                            style={{
                                padding: pxTransform(windowHeight * 0.02),
                                height: pxTransform(windowHeight * 0.06),
                                width: `calc(100% - ${pxTransform(windowHeight * 0.04)})`,
                            }}
                        >
                            <View
                                className='top item'
                                style={{
                                    fontSize: pxTransform(windowHeight * 0.025),
                                }}
                            >
                                <Text>{item.name}</Text>
                                <Text>{item.type === 0 ? '-' : '+'}{item.points}</Text>
                            </View>
                            <View
                                className='bottom item'
                                style={{
                                    fontSize: pxTransform(windowHeight * 0.015),
                                }}
                            >
                                <Text>{item.time}</Text>
                                <Text>剩余{item.left}</Text>
                            </View>
                        </View>
                    ))
                }
            </View>
        </View>
    )
} 