import { useEffect, useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { useLoad, getSystemInfoSync, getMenuButtonBoundingClientRect, navigateBack, useRouter, showModal } from '@tarojs/taro'
import './orderDetail.scss'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { pxTransform, Image, Button, Divider, Tabs } from '@nutui/nutui-react-taro'
import { ArrowLeft, Search } from '@nutui/icons-react-taro'
import GoodList from '@/components/goodList'
import Card from '@/components/Card'

export interface IOrderDetail {
    id: number
    orderStatus: number
    tableNumber: number
    personNumber: number
    goodsList: any[]
    isUseCoupon: number
    couponList?: any[]
    totalPrice: number
    shopName?: string
}

export default function OrderDetail() {
    // 获取登录状态和用户信息
    const {
        login: {
            loginStatus,
            userInfo
        },
        order: {
            currentOrder
        }
    } = useAppSelector((state) => state)

    // const router = useRouter()
    // const { id } = router.params

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
            className='order-detail-page'
        >
            <View
                className='nav'
                style={{
                    height: pxTransform(navHeight),
                    backgroundColor: currentOrder?.orderStatus === 4 ? '#fff' : '#f5f5f5',
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
                    {
                        currentOrder?.orderStatus === 4 && (
                            <View
                                className='nav-middle'
                            >
                                <Text> 退款详情 </Text>
                            </View>
                        )
                    }
                </View>
            </View>
            <View
                className='content'
                style={{
                    height: currentOrder?.orderStatus !== 3 && currentOrder?.orderStatus !== 4 ? `calc(${pxTransform(viewHeight - windowHeight * 0.1)} - 20rpx)` : `calc(${pxTransform(viewHeight)} - 20rpx)`,
                }}
            >
                {
                    currentOrder?.orderStatus !== 4 && (
                        <View
                            className='top'
                        >
                            <View
                                style={{
                                    fontSize: pxTransform(windowHeight * 0.03),
                                    marginBottom: pxTransform(windowHeight * 0.01),
                                }}
                            >
                                {currentOrder?.orderStatus === 1 && '待支付'}
                                {currentOrder?.orderStatus === 2 && '已完成'}
                                {currentOrder?.orderStatus === 3 && '已取消'}
                            </View>
                            <View
                                style={{
                                    fontSize: pxTransform(windowHeight * 0.015),
                                    color: '#666666'
                                }}
                            >
                                {currentOrder?.orderStatus === 1 ? '支付成功后，完成菜品下单' : '期待您的下次光临'}
                            </View>
                        </View>
                    )
                }
                <View
                    className='order-content'
                >
                    <GoodList orderId={currentOrder?.orderStatus} />
                </View>
                {
                    currentOrder?.orderStatus !== 1 && currentOrder?.orderStatus !== 4 && (
                        <View
                            className='order-card'
                        >
                            <Card title='门店信息' contentList={[{
                                id: '1',
                                label: '门店名称',
                                value: '浙江某某某店'
                            }, {
                                id: '2',
                                label: '门店地址',
                                value: '浙江某某某店'
                            }]} />
                            <Card title='用餐信息' contentList={[{
                                id: '1',
                                label: '用餐方式',
                                value: '堂食'
                            }, {
                                id: '2',
                                label: '桌号',
                                value: '4'
                            }, {
                                id: '3',
                                label: '用餐人数',
                                value: '4人'
                            }]} />
                            <Card title='订单信息' contentList={[{
                                id: '1',
                                label: '订单编号',
                                value: '1234567890'
                            }, {
                                id: '2',
                                label: '下单时间',
                                value: '2021-01-01 12:00:00'
                            }, {
                                id: '3',
                                label: '支付方式',
                                value: '微信支付'
                            }]} />
                        </View>
                    )
                }
                {
                    currentOrder?.orderStatus === 4 && (
                        <View
                            className='order-card'
                        >
                            <Card title='退款详情' contentList={[{
                                id: '1',
                                label: '退款原因',
                                value: '不想要了/临时有事'
                            }, {
                                id: '2',
                                label: '退款编号',
                                value: '1234567890'
                            }, {
                                id: '3',
                                label: '退款时间',
                                value: '2021-01-01 12:00:00'
                            }]} />
                        </View>
                    )
                }
            </View>
            {
                currentOrder?.orderStatus !== 3 && currentOrder?.orderStatus !== 4 && (
                    <View
                        className='bottom'
                        style={{
                            padding: `0 ${pxTransform(windowWidth * 0.05)}`,
                            width: `calc(100% - ${pxTransform(windowWidth * 0.1)})`,
                            height: pxTransform(windowHeight * 0.1),
                            justifyContent: currentOrder?.orderStatus === 1 ? 'space-between' : 'flex-end',
                        }}
                    >
                        {
                            currentOrder?.orderStatus === 1 && (
                                <>
                                    <Button
                                        style={{
                                            borderRadius: pxTransform(windowHeight * 0.05),
                                            color: '#D61518',
                                            borderColor: '#D61518',
                                        }}
                                        onClick={() => {
                                            showModal({
                                                title: '提示',
                                                content: '确定取消订单吗？',
                                                success: (res) => {
                                                    if (res.confirm) {
                                                        console.log('用户点击了确定')
                                                    } else if (res.cancel) {
                                                        console.log('用户点击了取消')
                                                    }
                                                },
                                            })
                                        }}
                                    >
                                        取消订单
                                    </Button>
                                    <Button
                                        type='primary'
                                        style={{
                                            borderRadius: pxTransform(windowHeight * 0.05),
                                        }}
                                    >
                                        去支付
                                    </Button>
                                </>
                            )
                        }
                        {
                            currentOrder?.orderStatus === 2 && (
                                <Button
                                    style={{
                                        borderRadius: pxTransform(windowHeight * 0.05),
                                        color: '#D61518',
                                        borderColor: '#D61518',
                                    }}
                                >
                                    立即评价
                                </Button>
                            )
                        }
                    </View>
                )
            }

        </View>
    )
} 