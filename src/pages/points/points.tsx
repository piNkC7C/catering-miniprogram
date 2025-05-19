import { View, Text } from '@tarojs/components'
import { useLoad, getSystemInfoSync, getMenuButtonBoundingClientRect } from '@tarojs/taro'
import './points.scss'
import { useAppSelector } from '@/hooks/useAppStore'
import { pxTransform, Image, Button, Divider } from '@nutui/nutui-react-taro'
import pointsBg from '@/assets/points/points-bgi@2x.png'
import pointsNumber from '@/assets/points/points-num@2x.png'

export default function Mine() {
    // 获取登录状态和用户信息
    const {
        login: {
            loginStatus,
            userInfo
        }
    } = useAppSelector((state) => state)
    // useLoad(() => {
    //   console.log('Mine page loaded.')
    // })

    const { statusBarHeight, windowHeight, windowWidth } = getSystemInfoSync()
    const finalStatusBarHeight = statusBarHeight || 0
    // 获取胶囊按钮信息
    const { top: topMenuButton, height: heightMenuButton } = getMenuButtonBoundingClientRect()
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
                    top: `${pxTransform(topMenuButton)}`,
                    height: `${pxTransform(heightMenuButton)}`,
                }}
            ></View>
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
                ></View>
            </View>
        </View>
    )
} 