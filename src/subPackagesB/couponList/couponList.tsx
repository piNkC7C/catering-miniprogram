import { useEffect, useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { useLoad, getSystemInfoSync, getMenuButtonBoundingClientRect, navigateBack, useRouter, navigateTo } from '@tarojs/taro'
import './couponList.scss'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { pxTransform, Image, Button, Divider, Tabs, ConfigProvider, Price, Tag, Dialog } from '@nutui/nutui-react-taro'
import { ArrowLeft, Search, IconFont, ArrowRight, Ask } from '@nutui/icons-react-taro'
import { exchangeIcon } from '@/utils/constants'
import { ICouponItem } from '@/redux/types/order'
// 路由
import { routes } from '@/utils/constants'

export default function CouponList() {
    // 获取登录状态和用户信息
    const {
        points: {
            couponList,
            exchangeList
        }
    } = useAppSelector((state) => state)

    const router = useRouter()
    const { type } = router.params

    const tabsList = type === 'all' ?
        [
            {
                label: '全部',
                value: 'allCoupon',
                status: 0
            },
            {
                label: '未使用',
                value: 'unUsed',
                status: 1
            },
            {
                label: '已使用',
                value: 'used',
                status: 2
            },
            {
                label: '已过期',
                value: 'expired',
                status: 3
            },
        ] : [
            {
                label: '全部',
                value: 'allExchange',
                status: 0
            },
            {
                label: '待发货',
                value: 'pending',
                status: 1
            },
            {
                label: '待收货',
                value: 'unReceived',
                status: 2
            },
            {
                label: '已完成',
                value: 'completed',
                status: 3
            },
            {
                label: '已取消',
                value: 'canceled',
                status: 4
            },
        ]

    // 当前选中的tab
    const [currentTabvalue, setCurrentTabvalue] = useState<string | number>(type === 'all' ? 'allCoupon' : 'allExchange')

    const filterCouponList: (status: number) => ICouponItem[] = (status: number) => {
        if (status === 0) {
            return type === 'all' ? couponList : exchangeList
        }
        if (type === 'all') {
            return couponList.filter((couponItem) => {
                return couponItem.couponStatus === status
            })
        } else {
            return exchangeList.filter((item) => {
                return item.exchangeStatus === status
            })
        }
    }

    // 显示使用说明弹窗
    const [showCouponDescriptionDialog, setShowCouponDescriptionDialog] = useState<boolean>(false)
    const [couponDescriptionDialogItem, setCouponDescriptionDialogItem] = useState<string>('')

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
            className='coupon-list-page'
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
                        <Text> {type === 'all' ? '优惠券列表' : '兑换记录'} </Text>
                    </View>
                </View>
            </View>
            <View
                className='content'
                style={{
                    height: pxTransform(viewHeight),
                }}
            >
                <Tabs
                    value={currentTabvalue}
                    onChange={(value) => {
                        console.log('value', value)
                        setCurrentTabvalue(value)
                    }}
                    style={{
                        '--nutui-tabs-titles-background-color': '#fff',
                    } as any}
                >
                    {
                        tabsList.map((item) => (
                            <Tabs.TabPane title={item.label} value={item.value} />
                        ))
                    }
                </Tabs>
                {
                    type === 'all' && (
                        <View
                            className='exchange'
                            style={{
                                margin: `${pxTransform(windowHeight * 0.01)} ${pxTransform(windowWidth * 0.05)}`,
                                height: pxTransform(windowHeight * 0.05),
                                width: `calc(100% - ${pxTransform(windowWidth * 0.1)})`,
                                borderRadius: pxTransform(windowWidth * 0.05),
                            }}
                            onClick={() => {
                                navigateTo({
                                    url: routes.find((route) => route.name === 'exchangeCoupon')?.path || ''
                                })
                            }}
                        >
                            <View
                                className='left'
                            >
                                <IconFont
                                    size={windowWidth * 0.06}
                                    style={{
                                        marginLeft: pxTransform(windowWidth * 0.05),
                                        width: windowWidth * 0.06,
                                        height: windowWidth * 0.06,
                                    }}
                                    name={exchangeIcon}
                                />
                                <Text
                                    style={{
                                        marginLeft: pxTransform(windowWidth * 0.02),
                                    }}
                                >兑换优惠券</Text>
                            </View>
                            <ArrowRight
                                size={windowWidth * 0.05}
                                color='#D82224'
                                style={{
                                    marginRight: pxTransform(windowWidth * 0.05),
                                }}
                            />
                        </View>
                    )
                }
                <View
                    className='coupon-list'
                    style={{
                        padding: `${pxTransform(windowHeight * 0.01)} ${pxTransform(windowWidth * 0.05)}`,
                        width: `calc(100% - ${pxTransform(windowWidth * 0.1)})`,
                    }}
                >
                    {
                        type === 'all' ? (
                            <>
                                {
                                    filterCouponList(tabsList.find((item) => item.value === currentTabvalue)?.status || 0).map((couponItem) => (
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
                                                className='top'
                                                style={{
                                                    height: `calc(80% - ${pxTransform(windowHeight * 0.01)})`,
                                                }}
                                            >
                                                <View
                                                    className='left'
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
                                                    className='right'
                                                >
                                                    <View
                                                        className='left2'
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
                                                        className='right2'
                                                    >
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
                                                className='bottom'
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
                                                        setCouponDescriptionDialogItem(couponItem.couponTip)
                                                        setShowCouponDescriptionDialog(true)
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    ))
                                }
                            </>
                        ) : (
                            <>
                                {
                                    filterCouponList(tabsList.find((item) => item.value === currentTabvalue)?.status || 0).map((couponItem) => (
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
                                                className='top'
                                                style={{
                                                    height: `calc(80% - ${pxTransform(windowHeight * 0.01)})`,
                                                }}
                                            >
                                                <View
                                                    className='left'
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
                                                    className='right'
                                                >
                                                    <View
                                                        className='left2'
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
                                                    {/* <View
                                                        className='right2'
                                                    >
                                                        {
                                                            item.status === 1 && (
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
                                                            item.status === 2 && (
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
                                                            item.status === 3 && (
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
                                                    </View> */}
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
                                                className='bottom'
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
                                                        setCouponDescriptionDialogItem(couponItem.couponTip)
                                                        setShowCouponDescriptionDialog(true)
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    ))
                                }
                            </>
                        )
                    }
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
        </View>
    )
} 