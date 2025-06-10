import { View, Text, ScrollView } from '@tarojs/components'
import { useLoad, getSystemInfoSync, navigateTo, getMenuButtonBoundingClientRect, navigateBack } from '@tarojs/taro'
import './refundList.scss'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { Tabs, Image, Button, pxTransform, Empty, Cell, Tag, Price, Popup, Space, Checkbox, Toast } from '@nutui/nutui-react-taro'
import { ArrowRight, IconFont, ArrowLeft } from '@nutui/icons-react-taro'
import { useState, useEffect } from 'react'
import { noOrderList, logoSmall, userNologin } from '@/utils/constants'
import { setCurrentOrderAction } from '@/redux/modules/order'
import LoginPopup from '@/components/LoginPopup'
// 路由
import { routes, orderTagList } from '@/utils/constants'

export default function RefundList() {
    // 获取登录状态和用户信息
    const {
        login: {
            loginStatus,
            userInfo
        },
        order: {
            orderList,
            currentOrder
        }
    } = useAppSelector((state) => state)
    const dispatch = useAppDispatch()

    const filterOrderList = (tabValue: number) => {
        if (tabValue === 0) {
            return orderList
        }
        return orderList.filter((orderItem) => orderItem.orderType === tabValue)
    }

    // useLoad(() => {
    //   console.log('OrderList page loaded.')
    // })

    // 底部弹层
    const [showBottomPopup, setShowBottomPopup] = useState<boolean>(false)

    // 登录状态为0时，初始化显示底部弹层
    // useEffect(() => {
    //   if (loginStatus === 0) {
    //     setShowBottomPopup(true)
    //   }
    // }, [])

    const { windowWidth, windowHeight, statusBarHeight } = getSystemInfoSync()
    const finalStatusBarHeight = statusBarHeight || 0
    // 获取胶囊按钮信息
    const { top: topMenuButton, height: heightMenuButton, width: widthMenuButton, left: leftMenuButton, right: rightMenuButton } = getMenuButtonBoundingClientRect()
    // 导航栏高度 = 胶囊按钮顶部位置 + (胶囊按钮高度 + 两边距离和)/2
    const navBarHeight = (topMenuButton - finalStatusBarHeight) * 2 + heightMenuButton
    // 总高度
    const navHeight = finalStatusBarHeight + navBarHeight + 5
    const viewHeight = windowHeight - navHeight

    const tabsList = [
        {
            title: '全部订单',
            value: 0
        },
        {
            title: '门店订单',
            value: 1
        },
        {
            title: '外卖订单',
            value: 2
        },
        {
            title: '商城订单',
            value: 3
        }
    ]

    // 当前选中的tab
    const [tabvalue, setTabvalue] = useState<string | number>('all')

    return (
        <View className='refundlist-page'>
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
                        <Text> 退款记录 </Text>
                    </View>
                </View>
            </View>
            <View className='refundlist-content'
                style={{
                    height: pxTransform(viewHeight),
                }}
            >
                {
                    orderList.length > 0 && (
                        <>
                            {
                                orderList.map((orderItem) => (
                                    <View
                                        className='refundlist-item'
                                        style={{
                                            marginBottom: pxTransform(windowHeight * 0.015),
                                            padding: pxTransform(windowWidth * 0.025),
                                            height: pxTransform(windowHeight * 0.2),
                                            backgroundColor: '#fff',
                                            borderRadius: pxTransform(10),
                                        }}
                                        onClick={() => {
                                            navigateTo({
                                                url: (routes.find((route) => route.name === 'orderDetail')?.path || '') + `?id=${orderItem.orderId}`
                                            })
                                        }}
                                    >
                                        <View
                                            className='refundlist-item-top'
                                        >
                                            <View
                                                className='refundlist-item-top-left'
                                            >
                                                {/* <Tag background="#FA2400" plain>
                                                    {orderTagList.find((tag) => tag.value === orderItem.orderType)?.name || ''}
                                                </Tag> */}
                                                <Text
                                                    className='refundlist-item-top-left-text'
                                                    style={{
                                                        fontSize: pxTransform(viewHeight * 0.018),
                                                    }}
                                                >{orderItem.shopName}</Text>
                                            </View>
                                            <View
                                                className='refundlist-item-top-right'
                                                style={{
                                                    fontSize: pxTransform(viewHeight * 0.018),
                                                    color: orderItem.orderStatus === 1 ? '#D7181A' : '#676767'
                                                }}
                                            >
                                                {orderItem.orderStatus === 1 && '退款成功'}
                                                {orderItem.orderStatus === 2 && '退款中'}
                                                {orderItem.orderStatus === 3 && '退款失败'}
                                                {orderItem.orderStatus === 4 && '退款关闭'}
                                                {/* {orderItem.orderStatus === 5 && '退款中'} */}
                                            </View>
                                        </View>
                                        <View
                                            className='refundlist-item-middle'
                                            style={{
                                                padding: `${pxTransform(viewHeight * 0.015)} 0`,
                                            }}
                                            onClick={() => {
                                                if (orderItem.orderStatus === 1) {
                                                    return
                                                }
                                                dispatch(setCurrentOrderAction({
                                                    type: 'set',
                                                    data: orderItem
                                                }))
                                                navigateTo({
                                                    url: (routes.find((route) => route.name === 'orderDetail')?.path || '') + `?id=${orderItem.orderId}`
                                                })
                                            }}
                                        >
                                            <ScrollView
                                                scrollX
                                                className='refundlist-item-middle-left'
                                            >
                                                {
                                                    orderItem.goodsList.map((goodsItem) => (
                                                        <View
                                                            className='refundlist-item-middle-left-goods'
                                                            style={{
                                                                width: pxTransform(viewHeight * 0.09),
                                                                height: pxTransform(viewHeight * 0.09),
                                                            }}
                                                        >
                                                            <Image
                                                                src={goodsItem.mealImage}
                                                                mode='scaleToFill'
                                                                width={pxTransform(viewHeight * 0.08)}
                                                                height={pxTransform(viewHeight * 0.06)}
                                                                style={{
                                                                    borderRadius: pxTransform(windowWidth * 0.01),
                                                                }}
                                                            />
                                                            <Text
                                                                className='refundlist-item-middle-left-goods-name'
                                                                style={{
                                                                    // width: pxTransform(windowHeight * 0.12),
                                                                    width: '4rem',
                                                                    height: pxTransform(viewHeight * 0.02),
                                                                    fontSize: pxTransform(viewHeight * 0.015),
                                                                    marginTop: pxTransform(viewHeight * 0.005),
                                                                }}
                                                            >{goodsItem.mealName}</Text>
                                                        </View>
                                                    ))
                                                }
                                            </ScrollView>
                                            <View
                                                className='refundlist-item-middle-right'
                                            >
                                                <View
                                                    className='refundlist-item-middle-right-top'
                                                >
                                                    <Price
                                                        color="gray"
                                                        price={orderItem.totalPrice}
                                                        size="normal"
                                                        thousands
                                                        style={{
                                                            fontWeight: 'bold',
                                                            '--nutui-price-color': '#333',
                                                        } as any}
                                                    />
                                                </View>
                                                <View
                                                    className='refundlist-item-middle-right-bottom'
                                                    style={{
                                                        fontSize: pxTransform(viewHeight * 0.015),
                                                    }}
                                                >
                                                    共{orderItem.totalCount}件
                                                </View>
                                            </View>
                                        </View>
                                        {/* <View
                                            className='refundlist-item-table'
                                            style={{
                                                borderRadius: pxTransform(10),
                                                fontSize: pxTransform(windowHeight * 0.02),
                                            }}
                                        >
                                            桌号&nbsp;&nbsp;<Text
                                                style={{
                                                    fontWeight: 'bold',
                                                    color: '#333',
                                                }}
                                            >{orderItem.tableNumber}</Text>
                                        </View> */}
                                        <View
                                            className='refundlist-item-bottom'
                                        >
                                            <View className='refund-status1'>
                                                退款合计：<Price
                                                    color="gray"
                                                    price={orderItem.totalPrice}
                                                    size="normal"
                                                    thousands
                                                    style={{
                                                        fontWeight: 'bold',
                                                        '--nutui-price-color': '#333',
                                                    } as any}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                ))
                            }
                        </>
                    )
                }
            </View>
        </View>
    )
} 