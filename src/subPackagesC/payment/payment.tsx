import { useEffect, useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { useLoad, getSystemInfoSync, getMenuButtonBoundingClientRect, navigateBack, getStorage, navigateTo } from '@tarojs/taro'
import './payment.scss'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { setCheckoutOrderCouponAction, setPayOrderInfoAction, setCurrentOrderAction } from '@/redux/modules/order'
import { pxTransform, Image, Button, Divider, Tabs, Price, Tag, Popup, Dialog, Cell, TextArea, Ellipsis } from '@nutui/nutui-react-taro'
import { ArrowLeft, Search, IconFont, ArrowUp, ArrowDown, ArrowRight } from '@nutui/icons-react-taro'
import { billTop, billBottom, tableIcon, peopleIcon } from '@/utils/constants'
import { TABLE_INFO } from '@/utils/constants'
import LoginPopup from '@/components/LoginPopup'
import CouponCard from '@/components/couponCard'
import { clearSelectedCartAPI, payOrderAPI, getOrderDetailOrPrePayAPI } from '@/api/order'
import { IResponseApi } from '@/api/type'
import { routes } from '@/utils/constants'

export default function Payment() {
    // 获取登录状态和用户信息
    const {
        login: {
            loginStatus,
            userInfo,
            tableInfo
        },
        address: {
            currentShop
        },
        order: {
            checkoutOrder,
            couponList,
        }
    } = useAppSelector((state) => state)
    const dispatch = useAppDispatch()

    // 桌号信息
    // const [tableInfo, setTableInfo] = useState<any>({
    //     tableId: null,
    //     peopleNum: null,
    // })

    // useEffect(() => {
    //     getStorage({
    //         key: TABLE_INFO,
    //         success: (res) => {
    //             setTableInfo(res.data)
    //         },
    //         fail: (err) => {
    //             console.log('获取桌号失败', err)
    //         }
    //     })
    // }, [])

    // 是否收起商品列表
    const [isFoldGoodsList, setIsFoldGoodsList] = useState(checkoutOrder?.goodsList.length && checkoutOrder?.goodsList.length > 3)

    // 当前选中的优惠券
    const [selectedCoupon, setSelectedCoupon] = useState<number | null>(null)

    // 是否显示优惠券弹窗
    const [showGoodsCouponPopup, setShowGoodsCouponPopup] = useState(false)

    // 优惠券使用规则
    const [goodsCouponDescriptionDialogItem, setGoodsCouponDescriptionDialogItem] = useState('')

    // 优惠券使用规则弹窗
    const [showGoodsCouponDescriptionDialog, setShowGoodsCouponDescriptionDialog] = useState(false)

    // 登录弹窗
    const [loginPopupVisible, setLoginPopupVisible] = useState(false)

    // 添加备注弹窗
    const [addNotesDialogVisible, setAddNotesDialogVisible] = useState(false)

    // 备注内容
    const [notesContent, setNotesContent] = useState('')

    // 文本域内容
    const [textAreaContent, setTextAreaContent] = useState('')

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
            className='payment-page'
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
                            left: pxTransform(windowWidth - widthMenuButton - leftMenuButton),
                            width: pxTransform(windowWidth * 0.07),
                            height: pxTransform(windowWidth * 0.07),
                            borderRadius: pxTransform(windowWidth * 0.035),
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
                        <Text> 结账买单 </Text>
                    </View>
                </View>
            </View>
            <View
                className='content'
                style={{
                    height: loginStatus === 0 ? `calc(${pxTransform(viewHeight - windowHeight * 0.1)} - 101rpx)` : pxTransform(viewHeight - windowHeight * 0.1),
                }}
            >
                <View
                    className='bill-top'
                >
                    <Image
                        src={billTop}
                        mode='widthFix'
                    ></Image>
                </View>
                <View
                    className='bill-content'
                >
                    <View
                        className='people-info'
                        style={{
                            padding: pxTransform(windowWidth * 0.05),
                            paddingBottom: 0,
                            width: `calc(100% - ${pxTransform(windowWidth * 0.1)})`,
                            fontSize: pxTransform(windowHeight * 0.015),
                            fontWeight: 'bold'
                        }}
                    >
                        <View
                            className='left table-info'
                        >
                            <IconFont
                                name={tableIcon}
                                size={pxTransform(windowWidth * 0.05)}
                                style={{
                                    marginRight: pxTransform(windowWidth * 0.02)
                                }}
                            ></IconFont>
                            <Text>
                                {tableInfo?.tableNum}号桌
                            </Text>
                        </View>
                        <View
                            className='right table-info'
                        >
                            <IconFont
                                name={peopleIcon}
                                size={pxTransform(windowWidth * 0.05)}
                                style={{
                                    marginRight: pxTransform(windowWidth * 0.02)
                                }}
                            ></IconFont>
                            <Text>
                                {tableInfo?.peopleNum}人
                            </Text>
                        </View>
                    </View>
                    <Divider style={{
                        borderStyle: 'dashed'
                    }}>待下单菜品</Divider>
                    <View
                        className='list'
                        style={{
                            padding: `0 ${pxTransform(windowWidth * 0.05)}`,
                            width: `calc(100% - ${pxTransform(windowWidth * 0.1)})`,
                            height: isFoldGoodsList ? pxTransform(windowHeight * 0.24) : 'max-content',
                        }}
                    >
                        {
                            checkoutOrder?.goodsList.map((goodsItem) => {
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
                                                src={goodsItem.image}
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
                                                >{goodsItem.name}</Text>
                                                <Text
                                                    style={{
                                                        fontSize: pxTransform(windowHeight * 0.012),
                                                    }}
                                                >x{goodsItem.count}</Text>
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
                                                price={goodsItem.price * goodsItem.count}
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
                        checkoutOrder?.goodsList.length && checkoutOrder?.goodsList.length > 3 && (
                            <View
                                className='fold-goods-list'
                                style={{
                                    fontSize: pxTransform(windowHeight * 0.013),
                                }}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    e.preventDefault()
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
                    <Divider />
                    <View
                        className='coupon'
                        style={{
                            padding: `0 ${pxTransform(windowWidth * 0.05)}`,
                            width: `calc(100% - ${pxTransform(windowWidth * 0.1)})`,
                        }}
                        onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                            setShowGoodsCouponPopup(true)
                        }}
                    >
                        <View
                            className='left'
                        >
                            <Tag type="primary">券</Tag>
                            <Text
                                style={{
                                    fontSize: pxTransform(windowHeight * 0.012),
                                    marginLeft: pxTransform(windowHeight * 0.01)
                                }}
                            >优惠券</Text>
                        </View>
                        <View
                            className='right'
                        >
                            {
                                couponList.length > 0 ? (
                                    <>
                                        {
                                            checkoutOrder?.couponList && checkoutOrder?.couponList.length && checkoutOrder?.couponList.length > 0 ? (
                                                <>
                                                    -<Price
                                                        price={checkoutOrder?.checkoutOrderTotalPrice - checkoutOrder?.checkoutOrderCouponedPrice}
                                                        size="normal"
                                                        thousands
                                                    />
                                                </>
                                            ) : (
                                                <Text
                                                    style={{
                                                        color: '#ff0f23'
                                                    }}
                                                >有{couponList.length}张可用券</Text>
                                            )
                                        }
                                    </>
                                ) : (
                                    <Text
                                        style={{
                                            color: '#999999'
                                        }}
                                    >暂无可用优惠券</Text>
                                )
                            }
                            <ArrowRight
                                style={{
                                    marginLeft: pxTransform(windowHeight * 0.005)
                                }}
                                size={pxTransform(windowHeight * 0.015)}
                                color='#999999'
                            />
                        </View>
                    </View>
                    <Divider />
                    <View
                        className='price'
                        style={{
                            marginBottom: pxTransform(windowHeight * 0.015),
                            padding: `0 ${pxTransform(windowWidth * 0.05)}`,
                            width: `calc(100% - ${pxTransform(windowWidth * 0.1)})`,
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
                            共{checkoutOrder?.checkoutOrderTotalCount}件&nbsp;&nbsp;合计：
                        </View>
                        <Price
                            color='gray'
                            price={checkoutOrder?.checkoutOrderTotalPrice}
                            size="normal"
                            thousands
                        />
                    </View>
                </View>
                <View
                    className='bill-bottom'
                >
                    <Image
                        src={billBottom}
                        mode='widthFix'
                    ></Image>
                </View>
                <View
                    className='notes'
                    style={{
                        padding: pxTransform(windowWidth * 0.05),
                        width: `calc(90% - ${pxTransform(windowWidth * 0.1)})`,
                        fontSize: pxTransform(windowHeight * 0.015)
                    }}
                >
                    <Text>备注</Text>
                    <View
                        className='right'
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: pxTransform(windowHeight * 0.15),
                        }}
                        onClick={() => {
                            setAddNotesDialogVisible(true)
                        }}
                    >
                        <Text
                            style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                textAlign: 'end',
                                color: '#9A9A9A',
                                width: pxTransform(windowHeight * 0.14),
                            }}
                        >{notesContent == '' ? '口味、偏好等要求' : notesContent}</Text>
                        <ArrowRight
                            size={pxTransform(windowHeight * 0.015)}
                            color='#9A9A9A'
                        />
                    </View>
                </View>
                {
                    loginStatus === 0 && (
                        <View
                            className='no-login'
                            style={{
                                bottom: pxTransform(windowHeight * 0.1),
                                padding: `0 ${pxTransform(windowWidth * 0.05)}`,
                                width: `calc(95% - ${pxTransform(windowWidth * 0.1)})`,
                            }}
                        >
                            <Text>
                                新人登录享受更多优惠
                            </Text>
                            <Button
                                type='primary'
                                size='normal'
                                style={{
                                    borderRadius: pxTransform(windowWidth * 0.05),
                                }}
                                onClick={() => {
                                    setLoginPopupVisible(true)
                                }}
                            >登录/注册</Button>
                        </View>
                    )
                }
            </View>
            <View
                className='bottom'
                style={{
                    padding: pxTransform(windowWidth * 0.05),
                    paddingBottom: pxTransform(windowWidth * 0.07),
                    width: `calc(100% - ${pxTransform(windowWidth * 0.1)})`,
                    height: pxTransform(windowHeight * 0.1 - windowWidth * 0.12),
                }}
            >
                <View
                    className='left'
                >
                    <Text
                        style={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            fontSize: pxTransform(windowHeight * 0.015)
                        }}
                    >
                        待支付：
                    </Text>
                    <Price
                        price={checkoutOrder?.checkoutOrderCouponedPrice}
                        size="xlarge"
                        thousands
                    />
                </View>
                <Button
                    type='primary'
                    size='normal'
                    style={{
                        borderRadius: pxTransform(windowHeight * 0.03)
                    }}
                    onClick={() => {
                        payOrderAPI({
                            // "outTradeNo": "",
                            // "orderNo": "D8117465022766946619",
                            // "terminal": 1,
                            "userId": userInfo?.userId || null,
                            "openId": userInfo?.openid!,
                            "shopId": currentShop?.shopId!,
                            "deskId": tableInfo?.tableId!,
                            "peopleNum": tableInfo?.peopleNum!,
                            "merchantRemark": "",
                            "dineRemark": "",
                            // "payOpenId": "",
                            // "status": 0,
                            // "payStatus": 1,
                            "orderType": 1,
                            // "totalGoods": 0,
                            // "originalPrice": 0,
                            "isInvoicing": 0,
                            "remark": notesContent,
                            "coupons": [
                                //   {
                                //     "id": 0,
                                //     "orderId": 0,
                                //     "couponUserId": "",
                                //     "discountPrice": 0,
                                //     "tenantId": 0,
                                //     "createTime": ""
                                //   }
                            ],
                            "carts": checkoutOrder?.goodsList.map((good) => {
                                return {
                                    "commodityId": good.commodityId,
                                    "count": good.count,
                                    "classificationId": good.classificationId,
                                    "selected": good.selected,
                                    "image": good.image,
                                    "name": good.name,
                                    "price": good.price,
                                    "isSet": good.isSet,
                                    "minimumPurchaseQuantity": good.minimumPurchaseQuantity,
                                    "purchaseQuantityLimit": good.purchaseQuantityLimit,
                                    "cartDOS": good.cartDOS?.map((cartItem) => {
                                        return {
                                            "commodityId": cartItem.commodityId,
                                            "count": cartItem.count,
                                            "isSet": cartItem.isSet,
                                            "isAdd": cartItem.isAdd,
                                            "selected": cartItem.selected,
                                            "image": cartItem.image,
                                            "name": cartItem.name,
                                            "standardPrice": cartItem.price,
                                            "minimumPurchaseQuantity": cartItem.minimumPurchaseQuantity,
                                            "purchaseQuantityLimit": cartItem.purchaseQuantityLimit,
                                            "shopId": currentShop?.shopId!,
                                            "deskId": tableInfo?.tableId!,
                                            "openId": userInfo?.openid!,
                                            "cartModifyReqVOList": []
                                        }
                                    })
                                }
                            })
                        }, (res: IResponseApi<any>) => {
                            console.log('payOrderAPI res', res)
                            if (res.success) {
                                dispatch(setPayOrderInfoAction({
                                    type: 'set',
                                    data: {
                                        timeStamp: res.data.timeStamp,
                                        nonceStr: res.data.nonceStr,
                                        packageValue: res.data.packageValue,
                                        signType: res.data.signType,
                                        paySign: res.data.paySign,
                                        prepayId: res.data.packageValue.substring(10, res.data.packageValue.length),
                                    }
                                }))
                                getOrderDetailOrPrePayAPI({
                                    id: res.data.packageValue.substring(10, res.data.packageValue.length)
                                }, (res: IResponseApi<any>) => {
                                    console.log('getOrderDetailOrPrePayAPI res', res)
                                    if (res.success) {
                                        dispatch(setCurrentOrderAction({
                                            type: 'set',
                                            data: res.data
                                        }))
                                        clearSelectedCartAPI(
                                            checkoutOrder?.goodsList.map((good) => {
                                                return {
                                                    "commodityId": good.commodityId,
                                                    "isSet": good.isSet,
                                                    "deskId": tableInfo?.tableId!,
                                                    "shopId": currentShop?.shopId!,
                                                    "openId": userInfo?.openid!,
                                                    "cartModifyReqVOList": good.cartDOS?.map((cartItem) => {
                                                        return {
                                                            "commodityId": cartItem.commodityId,
                                                            "count": cartItem.count,
                                                            "isSet": cartItem.isSet,
                                                            "isAdd": cartItem.isAdd,
                                                            "selected": cartItem.selected,
                                                            "image": cartItem.image,
                                                            "name": cartItem.name,
                                                            "standardPrice": cartItem.price,
                                                            "shopId": currentShop?.shopId!,
                                                            "deskId": tableInfo?.tableId!,
                                                            "openId": userInfo?.openid!,
                                                            "cartModifyReqVOList": []
                                                        }
                                                    })
                                                }
                                            }), (res: IResponseApi<any>) => {
                                                console.log('clearSelectedCartAPI res', res)
                                                if (res.success) {
                                                    navigateTo({
                                                        url: routes.find(route => route.name == 'confirmPayment')?.path!
                                                    })
                                                }
                                            })
                                    }
                                })
                            }
                        })
                    }}
                >支付下单</Button>
            </View>
            <Popup
                closeable
                round={true}
                visible={showGoodsCouponPopup}
                position='bottom'
                onClose={() => {
                    setShowGoodsCouponPopup(false)
                }}
                title='优惠券列表'
                style={{
                    background: '#f5f5f5',
                }}
            >
                <View
                    className='goods-coupon-popup'
                    style={{
                        padding: pxTransform(windowWidth * 0.03),
                        width: `calc(100% - ${pxTransform(windowWidth * 0.06)})`,
                        height: pxTransform(windowHeight * 0.7),
                    }}
                >
                    <View
                        className='use-coupon'
                        style={{
                            // marginLeft: pxTransform(windowWidth * 0.03),
                            paddingBottom: pxTransform(windowWidth * 0.03),
                            height: pxTransform(windowHeight * 0.03),
                            fontSize: pxTransform(windowWidth * 0.04),
                        }}
                    >
                        可用券（{couponList.length}）
                    </View>
                    {
                        couponList.map((couponItem) => (
                            <CouponCard
                                couponItem={couponItem}
                                type='payment'
                                selectedCoupon={selectedCoupon}
                                setSelectedCoupon={setSelectedCoupon}
                            />
                        ))
                    }
                </View>
                <View
                    className='use-coupon-button'
                    style={{
                        padding: pxTransform(windowWidth * 0.03),
                        width: `calc(100% - ${pxTransform(windowWidth * 0.06)})`,
                    }}
                >
                    <Button
                        type='primary'
                        size='normal'
                        style={{
                            width: '65%',
                            height: pxTransform(windowHeight * 0.06),
                            borderRadius: pxTransform(windowWidth * 0.15),
                        }}
                        onClick={() => {
                            if (selectedCoupon) {
                                dispatch(setCheckoutOrderCouponAction({
                                    type: 'set',
                                    data: [selectedCoupon]
                                }))
                            } else {
                                dispatch(setCheckoutOrderCouponAction({
                                    type: 'clear',
                                }))
                            }
                            setShowGoodsCouponPopup(false)
                        }}
                    >确定</Button>
                </View>
            </Popup>
            <Dialog
                title="使用说明"
                visible={showGoodsCouponDescriptionDialog}
                confirmText="我知道了"
                hideCancelButton
                onConfirm={() => setShowGoodsCouponDescriptionDialog(false)}
            >
                <Text>{goodsCouponDescriptionDialogItem}</Text>
            </Dialog>
            <Dialog
                className="test-dialog"
                title="添加备注"
                visible={addNotesDialogVisible}
                onConfirm={() => {
                    if (textAreaContent.length === 0) {
                        setNotesContent('口味、偏好等要求')
                    } else {
                        setNotesContent(textAreaContent)
                    }
                    setAddNotesDialogVisible(false)
                }}
                onCancel={() => {
                    setAddNotesDialogVisible(false)
                }}
            >
                <TextArea
                    value={textAreaContent}
                    showCount
                    maxLength={50}
                    onChange={(value) => {
                        setTextAreaContent(value)
                    }}
                />
            </Dialog>
            <LoginPopup
                visible={loginPopupVisible}
                onClose={() => setLoginPopupVisible(false)}
                viewHeight={windowHeight}
            />
        </View>
    )
} 