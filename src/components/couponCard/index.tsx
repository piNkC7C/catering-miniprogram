import { View, Text } from '@tarojs/components'
import { memo, useState } from 'react'
import { getSystemInfoSync, getMenuButtonBoundingClientRect } from '@tarojs/taro'
import { pxTransform, Price, Image, Tag, Divider, Button, Dialog, Checkbox } from '@nutui/nutui-react-taro'
import { Ask } from '@nutui/icons-react-taro'
import { useAppSelector } from '@/hooks/useAppStore'
import './index.scss'
import { ICouponItem } from '@/redux/types/order'
import equal from 'fast-deep-equal'

interface ICouponCardProps {
    couponItem: ICouponItem
    type: 'payment' | 'coupon'
    selectedCoupon: number | null
    setSelectedCoupon: (coupon: number | null) => void
}

function CouponCard({ couponItem, type, selectedCoupon, setSelectedCoupon }: ICouponCardProps) {
    const {
        order: {
            checkoutOrder
        }
    } = useAppSelector((state) => state)

    const [showCouponDescriptionDialog, setShowCouponDescriptionDialog] = useState(false)
    const [couponDescriptionDialogItem, setCouponDescriptionDialogItem] = useState('')

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
        <>
            <View
                className='coupon-item'
                style={{
                    marginBottom: pxTransform(windowHeight * 0.01),
                    padding: pxTransform(windowWidth * 0.04),
                    height: pxTransform(windowHeight * 0.1),
                    width: `calc(100% - ${pxTransform(windowWidth * 0.08)})`,
                    borderRadius: pxTransform(windowWidth * 0.03),
                }}
            >
                <View
                    className='coupon-item-top'
                    style={{
                        height: `calc(80% - ${pxTransform(windowHeight * 0.01)})`,
                    }}
                >
                    <View
                        className='coupon-item-top-left'
                    >
                        <Price
                            color='gray'
                            price={couponItem.couponDiscount}
                            size="xlarge"
                            thousands
                            digits={0}
                            style={{
                                fontWeight: 'bold',
                                '--nutui-price-color': '#F56C6C',
                                '--nutui-price-symbol-xlarge-size': pxTransform(viewHeight * 0.02),
                                '--nutui-price-integer-xlarge-size': pxTransform(viewHeight * 0.05),
                            } as any}
                        />
                        <Text
                            style={{
                                fontSize: pxTransform(viewHeight * 0.015),
                                color: '#999',
                            }}
                        >
                            满{couponItem.couponPrice}减{couponItem.couponDiscount}元
                        </Text>
                    </View>
                    <View
                        className='coupon-item-top-right'
                    >
                        <View
                            className='coupon-item-top-right-left'
                        >
                            <Text
                                style={{
                                    fontSize: pxTransform(viewHeight * 0.02),
                                    color: '#333',
                                }}
                            >{couponItem.couponName}</Text>
                            <Text
                                style={{
                                    fontSize: pxTransform(viewHeight * 0.015),
                                    color: '#999',
                                }}
                            >{couponItem.couponStartTime}&nbsp;-&nbsp;{couponItem.couponEndTime}</Text>
                            <Tag background="#FA2400" plain>
                                {couponItem.couponTag}
                            </Tag>
                        </View>
                        <View
                            className='coupon-item-top-right-right'
                        >
                            {
                                type === 'coupon' && (
                                    <>
                                        {
                                            couponItem.couponStatus === 1 && (
                                                <Button
                                                    type='primary'
                                                    size='normal'
                                                    style={{
                                                        borderRadius: pxTransform(windowWidth * 0.05),
                                                    }}
                                                >去使用</Button>
                                            )
                                        }
                                        {
                                            couponItem.couponStatus === 2 && (
                                                <Button
                                                    type='primary'
                                                    size='normal'
                                                    disabled
                                                    style={{
                                                        borderRadius: pxTransform(windowWidth * 0.05),
                                                    }}
                                                >已使用</Button>
                                            )
                                        }
                                        {
                                            couponItem.couponStatus === 3 && (
                                                <Button
                                                    type='default'
                                                    size='normal'
                                                    disabled
                                                    style={{
                                                        borderRadius: pxTransform(windowWidth * 0.05),
                                                    }}
                                                >已过期</Button>
                                            )
                                        }
                                    </>
                                )
                            }
                            {
                                type === 'payment' && (
                                    <Checkbox 
                                    value={couponItem.couponId} 
                                    checked={selectedCoupon === couponItem.couponId}
                                    onChange={(value) => {
                                        if (value) {
                                            setSelectedCoupon(couponItem.couponId)
                                        } else {
                                            if (selectedCoupon === couponItem.couponId) {
                                                setSelectedCoupon(null)
                                            }
                                        }
                                    }}
                                    />
                                )
                            }
                        </View>
                    </View>
                </View>
                <Divider
                    style={{
                        borderStyle: 'dashed',
                        '--nutui-divider-margin': `${pxTransform(windowHeight * 0.01)} 0`,
                        '--nutui-divider-border-color': '#DEDEDB'
                    } as any}
                />
                <View
                    className='coupon-item-bottom'
                    style={{
                        height: `calc(20% - ${pxTransform(windowHeight * 0.01)})`,
                        fontSize: pxTransform(viewHeight * 0.015),
                    }}
                >
                    <Text>{couponItem.couponTip}</Text>
                    <Ask
                        size={windowWidth * 0.035}
                        color='#A8A8A8'
                        onClick={() => {
                            setCouponDescriptionDialogItem(couponItem.couponDesc)
                            setShowCouponDescriptionDialog(true)
                        }}
                    />
                </View>
            </View>
            <Dialog
                title="使用说明"
                visible={showCouponDescriptionDialog}
                confirmText="我知道了"
                hideCancelButton
                onConfirm={() => setShowCouponDescriptionDialog(false)}
            >
                <Text>{couponDescriptionDialogItem}</Text>
            </Dialog>
        </>
    )
}

export default memo(CouponCard, (prevProps, nextProps) => {
    if (!equal(prevProps.couponItem, nextProps.couponItem)) {
        return false
    }
    if (prevProps.type !== nextProps.type) {
        return false
    }
    if (prevProps.selectedCoupon !== nextProps.selectedCoupon) {
        return false
    }
    if (!equal(prevProps.setSelectedCoupon, nextProps.setSelectedCoupon)) {
        return false
    }
    return true
})