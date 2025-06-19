import { memo, useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { getSystemInfoSync, getMenuButtonBoundingClientRect } from '@tarojs/taro'
import { pxTransform, Price, Image, Tag, Divider } from '@nutui/nutui-react-taro'
import { ArrowUp, ArrowDown, Minus } from '@nutui/icons-react-taro'
import { useAppSelector } from '@/hooks/useAppStore'
import './index.scss'

interface IGoodListProps {
    orderId: number
}

function PureGoodList<IGoodListProps>({ orderId }) {
    const {
        order: {
            currentOrder
        }
    } = useAppSelector((state) => state)

    const [isFoldGoodsList, setIsFoldGoodsList] = useState(currentOrder?.goodsList.length && currentOrder?.goodsList.length > 3)
    const [isFoldCouponList, setIsFoldCouponList] = useState(true)

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
            className='good-list'
            style={{
                marginTop: pxTransform(windowHeight * 0.02),
                borderRadius: pxTransform(windowHeight * 0.015),
                backgroundColor: currentOrder?.orderStatus === 1 ? '#E8E8E8' : '#fff'
            }}
        >
            <View
                className='good-list-top'
                style={{
                    padding: `0 ${pxTransform(windowHeight * 0.015)}`,
                    width: `calc(100% - ${pxTransform(windowHeight * 0.03)})`,
                    height: pxTransform(windowHeight * 0.05)
                }}
            >
                {
                    currentOrder?.orderStatus === 1 && (
                        <>
                            <Text>{currentOrder?.tableName}号桌</Text>
                            <Text>{currentOrder?.personNumber}人就餐</Text>
                        </>
                    )
                }
                {
                    currentOrder?.orderStatus !== 1 && currentOrder?.orderStatus !== 4 && (
                        <Text>{currentOrder?.shopName}</Text>
                    )
                }
                {
                    currentOrder?.orderStatus === 4 && (
                        <Text>退款明细</Text>
                    )
                }
            </View>
            {
                currentOrder?.orderStatus !== 1 && (
                    <Divider
                        style={{
                            '--nutui-divider-margin': 0
                        } as any}
                    />
                )
            }
            <View
                className='good-list-bottom'
                style={{
                    padding: pxTransform(windowHeight * 0.015),
                    width: `calc(100% - ${pxTransform(windowHeight * 0.03)})`,
                    // height: pxTransform(windowHeight * 0.05),
                    borderRadius: `${pxTransform(windowHeight * 0.015)} ${pxTransform(windowHeight * 0.015)} 0 0`
                }}
            >
                <View
                    className='list'
                    style={{
                        padding: `0 ${pxTransform(windowWidth * 0.05)}`,
                        width: `calc(100% - ${pxTransform(windowWidth * 0.1)})`,
                        height: isFoldGoodsList ? pxTransform(windowHeight * 0.24) : 'max-content',
                    }}
                >
                    {
                        currentOrder?.goodsList.map((goodsItem) => {
                            return (
                                <View
                                    className='list-item'
                                    style={{
                                        padding: `${pxTransform(windowWidth * 0.02)} 0`,
                                        height: pxTransform(windowHeight * 0.06),
                                    }}
                                >
                                    <View
                                        className='left'
                                    >
                                        <Image
                                            src={goodsItem.mealImage}
                                            width={pxTransform(windowHeight * 0.06)}
                                            height={pxTransform(windowHeight * 0.06)}
                                        ></Image>
                                        <View
                                            className='left-info'
                                            style={{
                                                marginLeft: pxTransform(windowWidth * 0.02),
                                                fontSize: pxTransform(windowHeight * 0.015)
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontWeight: 'bold'
                                                }}
                                            >{goodsItem.mealName}</Text>
                                            <Text
                                                style={{
                                                    fontSize: pxTransform(windowHeight * 0.012),
                                                }}
                                            >x{goodsItem.userOrderQuantity}</Text>
                                        </View>
                                    </View>
                                    <View
                                        className='right'
                                        style={{
                                            fontSize: pxTransform(windowHeight * 0.015),
                                        }}
                                    >
                                        <Price
                                            color='gray'
                                            price={Number(goodsItem.standardPrice * goodsItem.userOrderQuantity)}
                                            size="small"
                                            thousands
                                            style={{
                                                fontWeight: 'bold',
                                            }}
                                        />
                                    </View>
                                </View>
                            )
                        })
                    }
                </View>
                {
                    currentOrder?.goodsList.length && currentOrder?.goodsList.length > 3 && (
                        <View
                            className='fold-goods-list'
                            style={{
                                fontSize: pxTransform(windowHeight * 0.013),
                            }}
                            onClick={(e) => {
                                setIsFoldGoodsList(!isFoldGoodsList)
                            }}
                        >
                            {
                                !isFoldGoodsList ? (
                                    <>
                                        <Text>
                                            收起
                                        </Text>
                                        <ArrowUp
                                            size={pxTransform(windowHeight * 0.013)}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <Text>
                                            展开
                                        </Text>
                                        <ArrowDown
                                            size={pxTransform(windowHeight * 0.013)}
                                        />
                                    </>
                                )
                            }
                        </View>
                    )
                }
            </View>
            {/* {
                currentOrder?.orderStatus !== 1 && (
                    <Divider />
                )
            } */}
            {
                currentOrder?.orderStatus !== 4 && (
                    <View
                        className='good-list-total'
                        style={{
                            marginBottom: currentOrder?.orderStatus !== 1 && pxTransform(windowHeight * 0.01),
                            padding: `0 ${pxTransform(windowWidth * 0.05)}`,
                            // width: `calc(100% - ${pxTransform(windowWidth * 0.1)})`,
                        }}
                    >
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                justifyContent: 'flex-end',
                                marginBottom: pxTransform(windowWidth * 0.02),
                                height: '100%',
                                fontSize: pxTransform(windowHeight * 0.012),
                            }}
                        >
                            共{currentOrder?.totalCount}件&nbsp;&nbsp;合计：
                        </View>
                        <Price
                            color='gray'
                            price={Number(currentOrder?.totalPrice)}
                            size="normal"
                            thousands
                        />
                    </View>
                )
            }
            {
                currentOrder?.isUseCoupon && (
                    <>
                        <View
                            className='good-list-coupon'
                            style={{
                                padding: `0 ${pxTransform(windowWidth * 0.05)}`,
                                // width: `calc(100% - ${pxTransform(windowWidth * 0.1)})`,
                                // borderRadius: `0 0 ${pxTransform(windowHeight * 0.015)} ${pxTransform(windowHeight * 0.015)}`
                            }}
                        >
                            <View
                                className='good-list-coupon-left'
                                onClick={() => {
                                    setIsFoldCouponList(!isFoldCouponList)
                                }}
                            >
                                <Tag type="primary">券</Tag>
                                <Text
                                    style={{
                                        fontSize: pxTransform(windowHeight * 0.015),
                                        margin: `${pxTransform(windowHeight * 0.01)} 0`,
                                        marginLeft: pxTransform(windowHeight * 0.01),
                                    }}
                                >优惠券</Text>
                                {
                                    !isFoldCouponList && (
                                        <ArrowUp
                                            size={pxTransform(windowHeight * 0.013)}
                                        />
                                    )
                                }
                                {
                                    isFoldCouponList && (
                                        <ArrowDown
                                            size={pxTransform(windowHeight * 0.013)}
                                        />
                                    )
                                }
                            </View>
                            <View
                                className='good-list-coupon-right'
                            >
                                -<Price
                                    price={currentOrder?.totalPrice - currentOrder?.couponedPrice}
                                    size="normal"
                                    thousands
                                />
                            </View>
                        </View>
                        {
                            !isFoldCouponList && (
                                <View
                                    className='good-list-coupon-list'
                                    style={{
                                        marginBottom: pxTransform(windowHeight * 0.01),
                                        padding: `0 ${pxTransform(windowWidth * 0.05)}`,
                                        width: `calc(100% - ${pxTransform(windowWidth * 0.1)})`,
                                    }}
                                >
                                    {
                                        currentOrder?.couponList?.map((couponItem) => {
                                            return (
                                                <View
                                                    className='good-list-coupon-list-item'
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: pxTransform(windowHeight * 0.013),
                                                            color: '#999999'
                                                        }}
                                                    >{couponItem.couponName}</Text>
                                                    <View
                                                        className='good-list-coupon-right'
                                                    >
                                                        -<Price
                                                            price={couponItem.couponDiscount}
                                                            size="normal"
                                                            thousands
                                                        />
                                                    </View>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                            )
                        }
                        {
                            currentOrder?.orderStatus !== 1 && (
                                <Divider />
                            )
                        }
                        <View
                            className='good-list-total'
                            style={{
                                marginBottom: pxTransform(windowHeight * 0.01),
                                padding: `0 ${pxTransform(windowWidth * 0.05)}`,
                                backgroundColor: 'transparent'
                                // width: `calc(100% - ${pxTransform(windowWidth * 0.1)})`,
                            }}
                        >
                            <View
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    justifyContent: 'flex-end',
                                    marginBottom: pxTransform(windowWidth * 0.02),
                                    height: '100%',
                                    fontSize: pxTransform(windowHeight * 0.012),
                                }}
                            >
                                实付：
                            </View>
                            <Price
                                color='gray'
                                price={Number(currentOrder?.couponedPrice)}
                                size="normal"
                                thousands
                            />
                        </View>
                    </>
                )
            }
        </View>
    )
}

export default memo(PureGoodList, (prevProps, nextProps) => {
    if (prevProps.orderId !== nextProps.orderId) {
        return false
    }
    return true
})
