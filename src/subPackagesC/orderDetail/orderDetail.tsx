import { useEffect, useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { useLoad, getSystemInfoSync, getMenuButtonBoundingClientRect, navigateBack, useRouter, showModal, switchTab, useDidShow, navigateTo } from '@tarojs/taro'
import './orderDetail.scss'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { pxTransform, Image, Button, Divider, Tabs, Steps, Step, Price } from '@nutui/nutui-react-taro'
import { ArrowLeft, Home, Search } from '@nutui/icons-react-taro'
import GoodList from '@/components/goodList'
import Card from '@/components/Card'
import dayjs from 'dayjs'
import { routes } from '@/utils/constants'
import { setCurrentOrderAction, setPayOrderInfoAction } from '@/redux/modules/order'
import { getOrderDetailOrPrePayAPI, cancelOrderAPI } from '@/api/order'
import { IResponseApi } from '@/api/type'

export default function OrderDetail() {
    // 获取登录状态和用户信息
    const {
        order: {
            currentOrder,
            currentRefund
        }
    } = useAppSelector((state) => state)
    const dispatch = useAppDispatch()

    // useDidShow(() => {
    //     console.log('useDidShow', currentOrder);
    // })

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
                                if (type && type == '1') {
                                    switchTab({
                                        url: routes.find(route => route.name == 'orderList')?.path!
                                    })
                                } else {
                                    navigateBack()
                                }
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
                    height: currentOrder?.orderStatus !== 2 && currentOrder?.orderStatus !== 4 ? `calc(${pxTransform(viewHeight - windowHeight * 0.1)} - 20rpx)` : `calc(${pxTransform(viewHeight)} - 20rpx)`,
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
                                {currentOrder?.orderStatus === 2 && '已取消'}
                                {currentOrder?.orderStatus === 3 && '已完成'}
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
                {
                    currentOrder?.orderStatus === 4 && (
                        <View
                            className='refund-step'
                            style={{
                                padding: pxTransform(windowHeight * 0.015),
                                margin: `0 ${pxTransform(windowHeight * 0.015)}`,
                                marginTop: pxTransform(windowHeight * 0.015),
                                borderRadius: pxTransform(windowHeight * 0.015),
                            }}
                        >
                            <View
                                className='refund-status'
                            >
                                <View
                                    style={{
                                        fontSize: pxTransform(windowHeight * 0.02),
                                        marginBottom: pxTransform(windowHeight * 0.01),
                                    }}
                                >
                                    {
                                        (currentRefund?.refundStatus === 1) || (currentRefund?.refundStatus == 11) || (currentRefund?.refundStatus == 14) ? '已提交退款申请' :
                                            (currentRefund?.refundStatus == 2) || (currentRefund?.refundStatus == 13) ? '商家已退款' : currentRefund?.refundStatus == 3 ? '部分退款失败' : '商家拒绝退款'
                                    }
                                </View>
                                <View
                                    className='refund-price'
                                    style={{
                                        fontSize: pxTransform(windowHeight * 0.015),
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: '#999'
                                        }}
                                    >退款总金额：</Text>
                                    <Price
                                        color='gray'
                                        price={Number(currentRefund?.refundPrice)}
                                        size="normal"
                                        thousands
                                    />
                                </View>
                            </View>
                            <View
                                className='refund-text'
                            >
                                <Text>退款进度</Text>
                            </View>
                            <Steps
                                direction="vertical"
                                type="dot"
                                status="enhanced"
                                value={(currentRefund?.refundStatus === 1) || (currentRefund?.refundStatus == 11) || (currentRefund?.refundStatus == 14) ? 1 : 2}
                            >
                                <Step
                                    value={1}
                                    title="提交退款申请"
                                    description="已经提交了商品退款请求，商家正在处理您的退款，按支付方式原路返回，如有疑问请联系我们"
                                />
                                <Step
                                    value={2}
                                    title={
                                        (currentRefund?.refundStatus == 2) || (currentRefund?.refundStatus == 13) || (currentRefund?.refundStatus === 1) || (currentRefund?.refundStatus == 11) || (currentRefund?.refundStatus == 14) ? '商家已退款' : currentRefund?.refundStatus == 3 ? '部分退款失败' : '商家拒绝退款'
                                    }
                                    description={
                                        (currentRefund?.refundStatus == 2) || (currentRefund?.refundStatus == 13) || (currentRefund?.refundStatus === 1) || (currentRefund?.refundStatus == 11) || (currentRefund?.refundStatus == 14) ? "商家已处理您的退款，按支付方式原路返回，将在1-7个工作日内到账，如有疑问请联系我们" : currentRefund?.refundStatus == 3 ? '部分退款失败' : "商家拒绝了您的退款，如有疑问请联系我们"
                                    }
                                />
                            </Steps>
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
                                value: currentOrder?.shopName
                            }, {
                                id: '2',
                                label: '门店地址',
                                value: (currentOrder?.shopAddressProvince || '') + (currentOrder?.shopAddressCity || '') + (currentOrder?.shopAddressArea || '') + (currentOrder?.shopAddressStreet || '') + (currentOrder?.shopAddressDetail || '')
                            }]} />
                            <Card title='用餐信息' contentList={[{
                                id: '1',
                                label: '用餐方式',
                                value: currentOrder?.orderType == 2 ? '外卖' : '堂食'
                            }, {
                                id: '2',
                                label: '桌号',
                                value: currentOrder?.tableNumber
                            }, {
                                id: '3',
                                label: '用餐人数',
                                value: currentOrder?.personNumber + '人'
                            }]} />
                            <Card title='订单信息' contentList={[{
                                id: '1',
                                label: '订单编号',
                                value: currentOrder?.orderIdentifier
                            }, {
                                id: '2',
                                label: '下单时间',
                                value: dayjs(currentOrder?.orderTime).format('YYYY-MM-DD HH:mm:ss')
                            }, {
                                id: '3',
                                label: '支付方式',
                                value: currentOrder?.orderPayType == 1 ? '微信支付' : '支付宝支付'
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
                                value: currentRefund?.refundReason
                            }, {
                                id: '2',
                                label: '退款编号',
                                value: currentRefund?.refundNumber
                            }, {
                                id: '3',
                                label: '退款时间',
                                value: dayjs(currentRefund?.refundTime).format('YYYY-MM-DD HH:mm:ss')
                            }]} />
                        </View>
                    )
                }
            </View>
            {
                currentOrder?.orderStatus !== 2 && currentOrder?.orderStatus !== 4 && (
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
                                                        // console.log('用户点击了确定')
                                                        cancelOrderAPI({
                                                            id: currentOrder?.orderId
                                                        }, (res: IResponseApi<any>) => {
                                                            // console.log('cancelOrderAPI res', res)
                                                            if (res.success) {
                                                                dispatch(setCurrentOrderAction({
                                                                    type: 'set',
                                                                    data: {
                                                                        ...currentOrder,
                                                                        orderStatus: 2
                                                                    }
                                                                }))
                                                            }
                                                        })
                                                    } else if (res.cancel) {
                                                        // console.log('用户点击了取消')
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
                                        onClick={() => {
                                            if (type && type == '1') {
                                                navigateBack()
                                            } else {
                                                getOrderDetailOrPrePayAPI({
                                                    id: currentOrder?.orderId.toString()
                                                }, (res: IResponseApi<any>) => {
                                                    // console.log('getOrderDetailOrPrePayAPI res', res)
                                                    dispatch(setPayOrderInfoAction({
                                                        type: 'set',
                                                        data: {
                                                            timeStamp: res.data.timeStamp,
                                                            nonceStr: res.data.nonceStr,
                                                            packageValue: res.data.packageValue,
                                                            signType: res.data.signType,
                                                            paySign: res.data.paySign,
                                                            prepayId: res.data.packageValue.substring(10, res.data.packageValue.length - 1),
                                                        }
                                                    }))
                                                    navigateTo({
                                                        url: routes.find(route => route.name == 'confirmPayment')?.path!
                                                    })
                                                })
                                            }
                                        }}
                                    >
                                        去支付
                                    </Button>
                                </>
                            )
                        }
                        {
                            currentOrder?.orderStatus === 3 && (
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