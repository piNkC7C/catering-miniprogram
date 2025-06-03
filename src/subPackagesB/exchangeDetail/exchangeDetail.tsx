import { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { useLoad, getSystemInfoSync, getMenuButtonBoundingClientRect, navigateBack, useRouter } from '@tarojs/taro'
import './exchangeDetail.scss'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { pxTransform, Swiper, Image, Button } from '@nutui/nutui-react-taro'
import { ArrowLeft } from '@nutui/icons-react-taro'

export default function ExchangeDetail() {
    // 获取登录状态和用户信息
    const {
        login: {
            loginStatus,
            userInfo
        },
        points: {
            pointsDetailList,
            pointsList,
            pointsNumber
        }
    } = useAppSelector((state) => state)
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { id } = router.params
    const [pointsDetail, setPointsDetail] = useState(() => {
        const detail = pointsList.find((item) => item.id === 1)
        return detail
    })

    const { statusBarHeight, windowHeight, windowWidth } = getSystemInfoSync()
    const finalStatusBarHeight = statusBarHeight || 0
    // 获取胶囊按钮信息
    const { top: topMenuButton, height: heightMenuButton, width: widthMenuButton, left: leftMenuButton } = getMenuButtonBoundingClientRect()
    // 导航栏高度 = 胶囊按钮顶部位置 + (胶囊按钮高度 + 两边距离和)/2
    const navBarHeight = (topMenuButton - finalStatusBarHeight) * 2 + heightMenuButton
    // 总高度
    const navHeight = finalStatusBarHeight + navBarHeight + 5
    const viewHeight = windowHeight - navHeight

    // 轮播图
    const [current, setCurrent] = useState(0)
    const list = [
        'https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg',
        'https://storage.360buyimg.com/jdc-article/NutUItaro2.jpg',
        'https://storage.360buyimg.com/jdc-article/welcomenutui.jpg',
        'https://storage.360buyimg.com/jdc-article/fristfabu.jpg',
    ]

    return (
        <View
            className='exchange-detail-page'
        >
            <View
                className='exchange-detail-nav'
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
                        <Text>兑换详情</Text>
                    </View>
                </View>
            </View>
            <View
                className='exchange-detail-content'
                style={{
                    height: viewHeight,
                }}
            >
                <View
                    className='content-swiper'
                >
                    <Swiper
                        defaultValue={0}
                        onChange={(e) => {
                            setCurrent(e.detail.current)
                        }}
                        width='100%'
                        height='100%'
                        indicator={
                            <View
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    position: 'absolute',
                                    left: '85%',
                                    bottom: pxTransform(25),
                                    width: pxTransform(46),
                                    height: pxTransform(22),
                                    backgroundColor: 'rgba(0, 0, 0, 0.33)',
                                    borderRadius: pxTransform(22),
                                    textAlign: 'center',
                                    fontSize: pxTransform(14),
                                    zIndex: 1,
                                }}
                            >
                                <Text style={{ color: '#fff' }}>
                                    {current + 1}/{list.length}
                                </Text>
                            </View>
                        }
                    >
                        {list.map((item) => (
                            <Swiper.Item
                                key={item}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Image
                                    mode='scaleToFill'
                                    src={item}
                                    width='100%'
                                    height='100%'
                                />
                            </Swiper.Item>
                        ))}
                    </Swiper>
                </View>
                <View
                    className='content-title'
                    style={{
                        padding: pxTransform(windowWidth * 0.02),
                        width: `calc(100% - ${pxTransform(windowWidth * 0.04)})`,
                        height: `calc(8% - ${pxTransform(windowWidth * 0.04)})`,
                        backgroundColor: '#fff',
                    }}
                >
                    <View
                        className='top'
                        style={{
                            fontSize: pxTransform(windowWidth * 0.04),
                            fontWeight: 'bold',
                        }}
                    >
                        {pointsDetail?.name}
                    </View>
                    <View
                        className='bottom'
                        style={{
                            fontSize: pxTransform(windowWidth * 0.025),
                            color: '#A2A6A9',
                        }}
                    >
                        <Text>
                            <Text
                                style={{
                                    marginRight: pxTransform(windowWidth * 0.01),
                                    fontSize: pxTransform(windowWidth * 0.03),
                                    fontWeight: 'bold',
                                    color: '#D61518'
                                }}
                            >
                                {pointsDetail?.cost}
                            </Text>积分
                        </Text>
                        <Text>
                            剩余<Text
                                style={{
                                    color: '#D61518',
                                }}
                            >
                                {pointsDetail?.left}
                            </Text>件
                        </Text>
                    </View>
                </View>
                <View
                    className='content-detail'
                    style={{
                        padding: pxTransform(windowWidth * 0.02),
                        width: `calc(100% - ${pxTransform(windowWidth * 0.04)})`,
                        height: `calc(40% - ${pxTransform(windowWidth * 0.04)})`
                    }}
                >
                    <View
                        className='top'
                        style={{
                            fontSize: pxTransform(windowWidth * 0.04)
                        }}
                    >
                        商品详情
                    </View>
                    <View
                        className='bottom'
                        style={{
                            fontSize: pxTransform(windowWidth * 0.03),
                        }}
                    >
                        <Text>{
                            '兑换说明：\n1)\n1)\n1)\n1)\n【券有效期】\n【券有效期】\n【券有效期】\n【券有效期】\n【券有效期】\n【券有效期】\n【券有效期】\n【券有效期】\n【券有效期】\n【券有效期】\n【券有效期】\n【券有效期】\n【券有效期】\n【券有效期】\n【券有效期】\n【券有效期】\n【券有效期】\n【券有效期】\n【券有效期】\n'
                        }</Text>
                    </View>
                </View>
                <View
                    className='content-button'
                    style={{
                        padding: `0 ${pxTransform(windowWidth * 0.02)}`,
                        width: `calc(100% - ${pxTransform(windowWidth * 0.04)})`
                    }}
                >
                    {
                        loginStatus === 0 && (
                            <Button
                                type='primary'
                                className='button'
                                style={{
                                    width: '100%',
                                    height: '60%',
                                    borderRadius: pxTransform(25)
                                }}
                            >
                                登录授权
                            </Button>
                        )
                    }
                    {
                        loginStatus === 1 && pointsNumber >= pointsDetail?.cost && (
                            <Button
                                type='primary'
                                className='button'
                                style={{
                                    width: '100%',
                                    height: '60%',
                                    borderRadius: pxTransform(25)
                                }}
                            >
                                确认兑换
                            </Button>
                        )
                    }
                    {
                        loginStatus === 1 && pointsNumber < pointsDetail?.cost && (
                            <Button
                                type='default'
                                fill='none'
                                className='button'
                                disabled
                                style={{
                                    width: '100%',
                                    height: '60%',
                                    borderRadius: pxTransform(25),
                                    backgroundColor: `#f2f3f5`,
                                    color: `#888b94`,
                                }}
                            >
                                积分不足
                            </Button>
                        )
                    }
                </View>
            </View>
        </View>
    )
}