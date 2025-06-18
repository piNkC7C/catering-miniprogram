import { useEffect, useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { useLoad, getSystemInfoSync, getMenuButtonBoundingClientRect, navigateBack, requestPayment, showToast, reLaunch, showModal, navigateTo } from '@tarojs/taro'
import './confirmPayment.scss'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { pxTransform, Image, Button, Divider, Tabs, Price, Radio, RadioGroup } from '@nutui/nutui-react-taro'
import { ArrowLeft, Search, Clock, Scan } from '@nutui/icons-react-taro'
import { confirmPaymentAPI, getOrderDetailOrPrePayAPI } from '@/api/order'
import { routes } from '@/utils/constants'
import { setCurrentOrderAction } from '@/redux/modules/order'
import { IResponseApi } from '@/api/type'
import { cancelOrderAPI } from '@/api/order'

export default function ConfirmPayment() {
    const dispatch = useAppDispatch()

    // 获取用户信息和订单数据
    const {
        login: {
            loginStatus,
            userInfo,
            tableInfo
        },
        order: {
            checkoutOrder,
            payOrderInfo
        }
    } = useAppSelector((state) => state)

    // 支付倒计时 (15分钟)
    const [countdown, setCountdown] = useState(15 * 60)

    // 支付方式 (1: 微信支付, 2: 支付宝, 3: 银行卡)
    const [paymentMethod, setPaymentMethod] = useState('1')

    // 支付状态
    const [paying, setPaying] = useState(false)

    const { statusBarHeight, windowHeight, windowWidth } = getSystemInfoSync()
    const finalStatusBarHeight = statusBarHeight || 0
    // 获取胶囊按钮信息
    const { top: topMenuButton, height: heightMenuButton, width: widthMenuButton, left: leftMenuButton, right: rightMenuButton } = getMenuButtonBoundingClientRect()
    // 导航栏高度 = 胶囊按钮顶部位置 + (胶囊按钮高度 + 两边距离和)/2
    const navBarHeight = (topMenuButton - finalStatusBarHeight) * 2 + heightMenuButton
    // 总高度
    const navHeight = finalStatusBarHeight + navBarHeight + 5
    const viewHeight = windowHeight - navHeight

    // 倒计时效果
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    showToast({
                        title: '订单已超时，请重新下单',
                        icon: 'none'
                    })
                    setTimeout(() => {
                        navigateBack()
                    }, 2000)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    // 格式化倒计时显示
    const formatCountdown = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    // 处理支付
    const handlePayment = () => {
        if (!checkoutOrder) {
            showToast({
                title: '订单信息异常',
                icon: 'none'
            })
            return
        }

        setPaying(true)

        requestPayment({
            timeStamp: payOrderInfo?.timeStamp!,
            nonceStr: payOrderInfo?.nonceStr!,
            package: payOrderInfo?.packageValue!,
            signType: payOrderInfo?.signType!,
            paySign: payOrderInfo?.paySign!,
            success: () => {
                setPaying(false)
                showToast({
                    title: '支付成功',
                    icon: 'success'
                })
                intoOrderDetail()
            },
            fail: (err) => {
                setPaying(false)
                console.error('支付失败', err)
                showToast({
                    title: '支付失败',
                    icon: 'none'
                })
            }
        })
    }

    // 处理取消订单
    const handleCancelOrder = () => {
        showModal({
            title: '提示',
            content: '确定取消订单吗？',
            success: (res) => {
                if (res.confirm) {
                    cancelOrderAPI({
                        prepay_id: payOrderInfo?.prepayId!,
                    }, (res: IResponseApi<any>) => {
                        console.log('cancelOrderAPI res', res)
                        intoOrderDetail()
                    })
                }
            }
        })
    }

    const intoOrderDetail = () => {
        getOrderDetailOrPrePayAPI({
            id: payOrderInfo?.prepayId!,
        }, (res: IResponseApi<any>) => {
            console.log('getOrderDetailOrPrePayAPI res', res)
            dispatch(setCurrentOrderAction({
                type: 'set',
                data: res.data
            }))
            navigateTo({
                url: routes.find(route => route.name == 'orderDetail')?.path! + '?type=1',
            })
        })
    }

    return (
        <View
            className='confirm-payment-page'
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
                            width: pxTransform(widthMenuButton / 2),
                        }}
                    >
                        <ArrowLeft
                            size={pxTransform(windowWidth * 0.05)}
                            onClick={() => {
                                showModal({
                                    title: '提示',
                                    content: '您还未支付，确定返回吗？',
                                    confirmText: '继续支付',
                                    cancelText: '确认离开',
                                    success: (res) => {
                                        if (res.cancel) {
                                            intoOrderDetail()
                                        }
                                    }
                                })
                            }}
                        />
                    </View>
                    <View
                        className='nav-middle'
                    >
                        <Text> 支付 </Text>
                    </View>
                </View>
            </View>
            <View
                className='confirm-payment-content'
                style={{
                    height: pxTransform(viewHeight),
                }}
            >
                <ScrollView
                    scrollY
                    className='scroll-content'
                    style={{
                        height: `calc(100% - ${pxTransform(windowHeight * 0.12)})`
                    }}
                >
                    {/* 支付倒计时 */}
                    <View className='countdown-section'>
                        <View className='countdown-header'>
                            <Clock size={pxTransform(windowWidth * 0.05)} color='#fa2c19' />
                            <Text className='countdown-title'>支付剩余时间</Text>
                        </View>
                        <View className='countdown-time'>
                            <Text className='time-text'>{formatCountdown(countdown)}</Text>
                        </View>
                        <Text className='countdown-tip'>超时后订单将自动取消</Text>
                    </View>

                    {/* 支付金额 */}
                    <View className='amount-section'>
                        <View className='amount-header'>
                            <Text className='amount-title'>支付金额</Text>
                        </View>
                        <View className='amount-content'>
                            <Price
                                price={checkoutOrder?.checkoutOrderCouponedPrice || 0}
                                size='large'
                                thousands
                                symbol='¥'
                                className='payment-price'
                            />
                            {checkoutOrder?.checkoutOrderTotalPrice !== checkoutOrder?.checkoutOrderCouponedPrice && (
                                <View className='original-price'>
                                    <Text className='original-text'>原价：</Text>
                                    <Price
                                        price={checkoutOrder?.checkoutOrderTotalPrice || 0}
                                        size='small'
                                        thousands
                                        symbol='¥'
                                        className='original-price-text'
                                    />
                                </View>
                            )}
                        </View>
                    </View>

                    {/* 订单信息 */}
                    <View className='order-info-section'>
                        <View className='order-info-header'>
                            <Text className='order-info-title'>订单信息</Text>
                        </View>
                        <View className='order-info-content'>
                            <View className='info-row'>
                                <Text className='info-label'>桌号：</Text>
                                <Text className='info-value'>{tableInfo?.tableNum}号桌</Text>
                            </View>
                            <View className='info-row'>
                                <Text className='info-label'>人数：</Text>
                                <Text className='info-value'>{tableInfo?.peopleNum}人</Text>
                            </View>
                            <View className='info-row'>
                                <Text className='info-label'>商品数量：</Text>
                                <Text className='info-value'>{checkoutOrder?.checkoutOrderTotalCount}件</Text>
                            </View>
                        </View>
                    </View>

                    {/* 支付方式 */}
                    <View className='payment-method-section'>
                        <View className='payment-method-header'>
                            <Text className='payment-method-title'>支付方式</Text>
                        </View>
                        <RadioGroup value={paymentMethod} onChange={(value) => setPaymentMethod(String(value))}>
                            <View className='payment-options'>
                                <View className='payment-option'>
                                    <Radio value='1' className='payment-radio'>
                                        <View className='payment-option-content'>
                                            {/* <View className='payment-icon wechat-icon'>
                                                <Text className='icon-text'>微</Text>
                                            </View> */}
                                            <Text className='payment-name'>微信支付</Text>
                                        </View>
                                    </Radio>
                                </View>
                                {/* <View className='payment-option'>
                                    <Radio value='2' className='payment-radio'>
                                        <View className='payment-option-content'>
                                            <View className='payment-icon alipay-icon'>
                                                <Text className='icon-text'>支</Text>
                                            </View>
                                            <Text className='payment-name'>支付宝</Text>
                                        </View>
                                    </Radio>
                                </View>
                                <View className='payment-option'>
                                    <Radio value='3' className='payment-radio'>
                                        <View className='payment-option-content'>
                                            <View className='payment-icon bank-icon'>
                                                <Text className='icon-text'>卡</Text>
                                            </View>
                                            <Text className='payment-name'>银行卡支付</Text>
                                        </View>
                                    </Radio>
                                </View> */}
                            </View>
                        </RadioGroup>
                    </View>
                </ScrollView>

                {/* 底部按钮 */}
                <View className='payment-footer'>
                    <Button
                        className='cancel-button'
                        disabled={paying}
                        onClick={handleCancelOrder}
                        style={{
                            height: pxTransform(windowHeight * 0.05),
                            fontSize: pxTransform(windowWidth * 0.04),
                            borderRadius: pxTransform(windowHeight * 0.04),
                        }}
                    >
                        取消订单
                    </Button>
                    <Button
                        type='primary'
                        className='payment-button'
                        loading={paying}
                        disabled={countdown <= 0}
                        onClick={handlePayment}
                        style={{
                            height: pxTransform(windowHeight * 0.05),
                            fontSize: pxTransform(windowWidth * 0.04),
                            borderRadius: pxTransform(windowHeight * 0.04),
                        }}
                    >
                        {paying ? '支付中...' : `确认支付 ¥${checkoutOrder?.checkoutOrderCouponedPrice || 0}`}
                    </Button>
                </View>
            </View>
        </View>
    )
} 