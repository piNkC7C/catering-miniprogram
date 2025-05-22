import { useEffect, useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { useLoad, getSystemInfoSync, getMenuButtonBoundingClientRect, navigateBack, getStorage } from '@tarojs/taro'
import './payment.scss'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { pxTransform, Image, Button, Divider, Tabs, Price, Tag, Popup, Dialog, Cell, TextArea, Ellipsis } from '@nutui/nutui-react-taro'
import { ArrowLeft, Search, IconFont, ArrowUp, ArrowDown, ArrowRight } from '@nutui/icons-react-taro'
import billTop from '@/assets/zip/bill-top@2x-2.png'
import billBottom from '@/assets/zip/bill-bottom@2x-2.png'
import tableIcon from '@/assets/zip/table@2x.png'
import peopleIcon from '@/assets/zip/people@2x.png'
import { TABLE_INFO, testGoodsList, testGoodsCouponList as goodsCouponList } from '@/utils/constants'
import LoginPopup from '@/components/LoginPopup'

export default function Payment() {
    // 获取登录状态和用户信息
    const {
        login: {
            loginStatus,
            userInfo
        },
    } = useAppSelector((state) => state)

    // 桌号信息
    const [tableInfo, setTableInfo] = useState<any>({
        tableId: null,
        peopleNum: null,
    })

    useEffect(() => {
        getStorage({
            key: TABLE_INFO,
            success: (res) => {
                setTableInfo(res.data)
            },
            fail: (err) => {
                console.log('获取桌号失败', err)
            }
        })
    }, [])

    // 是否收起商品列表
    const [isFoldGoodsList, setIsFoldGoodsList] = useState(testGoodsList.length > 3)

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
    const [notesContent, setNotesContent] = useState('口味、偏好等要求')

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
                                {tableInfo.tableId}号桌
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
                                {tableInfo.peopleNum}人
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
                            testGoodsList.map((item) => {
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
                                                src={item.image}
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
                                                >{item.title}</Text>
                                                <Text
                                                    style={{
                                                        fontSize: pxTransform(windowHeight * 0.012),
                                                    }}
                                                >x{item.count}</Text>
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
                                                price={item.price}
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
                        testGoodsList.length > 3 && (
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
                                goodsCouponList.length > 0 ? (
                                    <>
                                        -<Price
                                            price={100}
                                            size="normal"
                                            thousands
                                        />
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
                            共{testGoodsList.length}件&nbsp;&nbsp;合计：
                        </View>
                        <Price
                            color='gray'
                            price={100}
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
                        >{notesContent}</Text>
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
                        price={100}
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
                        可用券（{goodsCouponList.length}）
                    </View>
                    {
                        goodsCouponList.map((item) => (
                            <View
                                className='goods-coupon-item'
                                style={{
                                    padding: pxTransform(windowWidth * 0.03),
                                    height: pxTransform(windowHeight * 0.15),
                                    width: `calc(100% - ${pxTransform(windowWidth * 0.06)})`,
                                }}
                            >
                                <View
                                    className='item-top'
                                    style={{
                                        height: `calc(65% - ${pxTransform(windowWidth * 0.03)})`,
                                    }}
                                >
                                    <Image
                                        src={item.image}
                                        width={pxTransform(windowHeight * 0.15 * 0.65 - windowWidth * 0.03)}
                                        height={pxTransform(windowHeight * 0.15 * 0.65 - windowWidth * 0.03)}
                                    />
                                    <View
                                        className='item-top-right'
                                        style={{
                                            marginLeft: pxTransform(windowWidth * 0.05),
                                            fontSize: pxTransform(windowWidth * 0.025),
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: pxTransform(windowWidth * 0.04),
                                                fontWeight: 'bold',
                                                color: '#333',
                                            }}
                                        >{item.title}</Text>
                                        <Text>
                                            <Text
                                                style={{
                                                    fontSize: pxTransform(windowWidth * 0.04),
                                                    fontWeight: 'bold',
                                                    color: '#D61518',
                                                    marginRight: pxTransform(windowWidth * 0.01),
                                                }}
                                            >免费兑换</Text>
                                            无门槛</Text>
                                        <Text>有效期：{item.startTime}&nbsp;-&nbsp;{item.endTime}</Text>
                                    </View>
                                </View>
                                <Divider
                                    style={{
                                        borderStyle: 'dashed',
                                        '--nutui-divider-margin': `${pxTransform(windowWidth * 0.03)} 0`,
                                    } as any}
                                />
                                <View
                                    className='item-bottom'
                                    style={{
                                        height: `calc(35% - ${pxTransform(windowWidth * 0.03)})`,
                                    }}
                                >
                                    <View
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            fontSize: pxTransform(windowWidth * 0.03),
                                            color: '#999',
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            e.preventDefault()
                                            setGoodsCouponDescriptionDialogItem(item.description)
                                            setShowGoodsCouponDescriptionDialog(true)
                                        }}
                                    >
                                        使用说明<ArrowDown
                                            size={windowWidth * 0.03}
                                            style={{
                                                marginLeft: pxTransform(windowWidth * 0.01),
                                            }}
                                        />
                                    </View>
                                    <Button
                                        type='primary'
                                        disabled={item.type === 1}
                                        style={{
                                            borderRadius: pxTransform(windowWidth * 0.05),
                                        }}
                                    >{
                                            item.type === 0 ? '立即使用' : '已使用'
                                        }</Button>
                                </View>
                            </View>
                        ))
                    }
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