import { useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { useLoad, getSystemInfoSync, getMenuButtonBoundingClientRect, navigateTo, navigateBack } from '@tarojs/taro'
import './points.scss'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { pxTransform, Image, Button, Divider, Tabs } from '@nutui/nutui-react-taro'
import { ArrowLeft, Search } from '@nutui/icons-react-taro'
import pointsBg from '@/assets/points/points-bgi@2x.png'
import pointsNumber from '@/assets/points/points-num@2x.png'
import { pointsListAction } from '@/redux/modules/points'
export default function Points() {
    // 获取登录状态和用户信息
    const {
        login: {
            loginStatus,
            userInfo
        },
        points: {
            pointsList
        }
    } = useAppSelector((state) => state)
    const dispatch = useAppDispatch()
    // useLoad(() => {
    //   console.log('Mine page loaded.')
    // })

    useEffect(() => {
        // dispatch(pointsListAction({
        //     type: 'set',
        //     data: []
        // }))
    }, [])

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
    const contentHeight = (windowHeight * 0.25 - navHeight) / 2 + navHeight

    return (
        <View
            className='points-page'
        >
            <View
                className='points-nav'
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
                        width: `calc(${pxTransform(widthMenuButton)} - ${pxTransform(windowWidth * 0.04)})`,
                    }}
                >
                    <ArrowLeft
                        size={pxTransform(windowWidth * 0.05)}
                        onClick={() => {
                            navigateBack()
                        }}
                    />
                    <Divider
                        direction="vertical"
                        style={{
                            margin: '0 15rpx',
                            borderColor: '#fff',
                        } as any}
                    />
                    <Search
                        size={pxTransform(windowWidth * 0.045)}
                    />
                </View>
                <View
                    className='nav-middle'
                >
                    <Text>积分商城</Text>
                </View>
            </View>
            <View
                className='points-content'
            >
                <View
                    className='content-top'
                >
                    <Image
                        src={pointsBg}
                    ></Image>
                    <View
                        className='top-content'
                        style={{
                            height: `calc(100% - ${pxTransform(navHeight)})`,
                        }}
                    >
                        <View
                            className='points-number'
                        >
                            <Image
                                mode='scaleToFill'
                                src={pointsNumber}
                                width={pxTransform(windowWidth * 0.1)}
                                height={pxTransform(windowWidth * 0.1)}
                            ></Image>
                            <Text
                                style={{
                                    marginLeft: pxTransform(windowWidth * 0.02),
                                    fontSize: pxTransform(windowWidth * 0.08),
                                    // fontWeight: 'bold',
                                    color: '#fff',
                                }}
                            >100</Text>
                        </View>
                        <View
                            className='points-list'
                            style={{
                                fontSize: pxTransform(windowWidth * 0.03),
                            }}
                        >
                            <Text
                                className='points-list-item'
                                onClick={() => {
                                    navigateTo({
                                        url: '/pages/pointsDetail/pointsDetail',
                                    })
                                }}
                            >积分明细</Text>
                            <Divider
                                direction="vertical"
                                style={{
                                    margin: '0 25rpx',
                                    borderColor: '#fff',
                                } as any}
                            />
                            <Text
                                className='points-list-item'
                            >积分规则</Text>
                            <Divider
                                direction="vertical"
                                style={{
                                    margin: '0 25rpx',
                                    borderColor: '#fff',
                                } as any}
                            />
                            <Text
                                className='points-list-item'
                            >兑换记录</Text>
                        </View>
                    </View>
                </View>
                <View
                    className='content-bottom'
                >
                    <View
                        className='points-list-tabs'
                    >
                        <Tabs
                            align='left'
                            value='全部'
                            defaultValue='全部'
                        >
                            <Tabs.TabPane
                                title="全部"
                                value='全部'
                            />
                        </Tabs>
                    </View>
                    <View
                        className='points-list-content'
                        style={{
                            margin: `${pxTransform(windowHeight * 0.02)} ${pxTransform(windowWidth * 0.05)}`,
                            width: `calc(100% - ${pxTransform(windowWidth * 0.1)})`,
                            height: `calc(95% - ${pxTransform(windowHeight * 0.05)})`,
                        }}
                    >
                        {
                            pointsList && pointsList.length && pointsList.map((item) => (
                                <View
                                    key={item.id}
                                    className='points-list-item'
                                    style={{
                                        padding: pxTransform(windowWidth * 0.025),
                                        height: `calc(${pxTransform(windowHeight * 0.3)} - ${pxTransform(windowWidth * 0.05)})`,
                                        width: `calc(48% - ${pxTransform(windowWidth * 0.05)})`,
                                    }}
                                    onClick={() => {
                                        navigateTo({
                                            url: `/pages/exchangeDetail/exchangeDetail?id=${item.id}`,
                                        })
                                    }}
                                >
                                    <Image
                                        style={{
                                            backgroundColor: '#f5f5f5',
                                        }}
                                        src={item.img}
                                        width='100%'
                                        height='65%'
                                    ></Image>
                                    <Text
                                        style={{
                                            marginTop: pxTransform(windowHeight * 0.01),
                                            fontSize: pxTransform(windowWidth * 0.035),
                                        }}
                                    >{item.name}</Text>
                                    <Text
                                        style={{
                                            fontSize: pxTransform(windowWidth * 0.025),
                                            color: '#A2A6A9',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: pxTransform(windowWidth * 0.035),
                                                color: '#D61518',
                                                marginRight: pxTransform(windowWidth * 0.01),
                                            }}
                                        >{item.cost}</Text>
                                        积分
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: pxTransform(windowWidth * 0.025),
                                            color: '#A2A6A9',
                                        }}
                                    >剩余{item.left}件</Text>
                                </View>
                            ))
                        }
                    </View>
                </View>
            </View>
        </View>
    )
} 