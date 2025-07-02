import { useState, useEffect } from 'react'
import { View, Text, Span } from '@tarojs/components'
import { useLoad, getSystemInfoSync, getMenuButtonBoundingClientRect, navigateTo, switchTab, showToast, setStorage, getStorage, useRouter, showModal } from '@tarojs/taro'
import './selectTable.scss'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { setTableInfo } from '@/redux/modules/login'
import { pxTransform, Button, Image, Grid, Popup, Checkbox, Space, Toast, Radio, Input, NumberKeyboard } from '@nutui/nutui-react-taro'
import { ArrowRight, Close, Home } from '@nutui/icons-react-taro'
import { TABLE_INFO, selectTableBg, selectTableNumber, userNologin } from '@/utils/constants'
import { setCurrentShopAction } from '@/redux/modules/address'
import { getShopDetailAPI } from '@/api/address'
import { IResponseApi } from '@/api/type'
import { IShopItem } from '@/redux/types/address'
import { IGroupGoodsList } from '@/redux/types/order'
import { addSharedCartGoodsAPI, getCartListAPI, getGroupGoodsListAPI } from '@/api/order'
import { setCartListAction, setGroupGoodsListAction, setOrderTabsListAction } from '@/redux/modules/order'
import { useShopAndGoods } from '@/hooks/useShopAndGoods'

export default function SelectTable() {
    // 获取登录状态和用户信息
    const {
        login: {
            loginStatus,
            userInfo,
        },
        order: {
            cartList,
        }
    } = useAppSelector((state) => state)
    const dispatch = useAppDispatch()

    // 更新商品列表
    const { handleGroupGoodsList } = useShopAndGoods()

    // 选中的就餐人数
    const [selectedNum, setSelectedNum] = useState<number>(0)
    const [inputFocus, setInputFocus] = useState<boolean>(false)
    // const [numberKeyboardVisible, setNumberKeyboardVisible] = useState<boolean>(false)
    // const [inputValue, setInputValue] = useState<string>('')

    const [tableId, setTableId] = useState<any>(null)
    const [tableNum, setTableNum] = useState<any>(null)
    const [shopId, setShopId] = useState<any>(null)

    const router = useRouter()
    const { scene } = router.params
    useEffect(() => {
        if (scene) {
            const { id, shopId, desNum } = decodeURIComponent(scene).split('&').reduce((acc: any, pair: any) => {
                const [key, value] = pair.split('=');
                if (key && value) {
                    // 尝试转换为数字
                    acc[key] = isNaN(Number(value)) ? value : Number(value);
                }
                return acc;
            }, {});


            console.log('id', id);
            console.log('shopId', shopId);
            console.log('desNum', desNum);

            if (id) {
                setTableId(id)
            }
            if (desNum) {
                setTableNum(desNum)
            }
            if (shopId) {
                setShopId(shopId)
                getShopDetailAPI({
                    shopId
                }, (res: IResponseApi<IShopItem>) => {
                    if (res.success) {
                        // console.log('res', res);
                        dispatch(setCurrentShopAction({
                            type: 'set',
                            data: res.data
                        }))
                    } else {
                        console.log('获取门店失败', res);
                    }
                })
                getGroupGoodsListAPI({
                    shopId
                }, handleGroupGoodsList)
            }
        }
    }, [])

    const { statusBarHeight, windowHeight, windowWidth } = getSystemInfoSync()
    const finalStatusBarHeight = statusBarHeight || 0
    // 获取胶囊按钮信息
    const { top: topMenuButton, height: heightMenuButton, width: widthMenuButton, left: leftMenuButton } = getMenuButtonBoundingClientRect()
    // 导航栏高度 = 胶囊按钮顶部位置 + (胶囊按钮高度 + 两边距离和)/2
    const navBarHeight = (topMenuButton - finalStatusBarHeight) * 2 + heightMenuButton
    // 总高度
    const navHeight = finalStatusBarHeight + navBarHeight + 5
    // 获取可视区域高度
    const viewHeight = windowHeight - navHeight

    return (
        <View
            className='select-table'
            style={{
                fontSize: pxTransform(16),
                backgroundImage: `url(${selectTableBg})`,
            }}
        >
            <View
                className='backIndex'
                style={{
                    width: pxTransform(windowWidth * 0.1),
                    height: pxTransform(windowWidth * 0.1),
                    borderRadius: pxTransform(windowWidth * 0.05),
                    top: topMenuButton,
                    left: windowWidth - widthMenuButton - leftMenuButton,
                }}
                onClick={() => {
                    switchTab({
                        url: '/pages/index/index',
                    })
                }}
            >
                <Home />
            </View>
            <View
                className='content'
                style={{
                    padding: `0 ${pxTransform(windowWidth * 0.05)}`,
                    width: `calc(100% - ${pxTransform(windowWidth * 0.1)})`,
                }}
            >
                <View
                    className='icon'
                    style={{
                        fontSize: pxTransform(windowWidth * 0.045),
                    }}
                >
                    <Image
                        src={userNologin}
                        width={pxTransform(windowWidth * 0.1)}
                        height={pxTransform(windowWidth * 0.1)}
                    />
                    <Text
                        style={{
                            marginTop: pxTransform(windowWidth * 0.02),
                        }}
                    >欢迎光临某某某店</Text>
                    <Text
                        style={{
                            marginTop: pxTransform(windowWidth * 0.02),
                        }}
                    >祝您用餐愉快～</Text>
                </View>
                <View
                    className='table-list'
                    style={{
                        marginTop: pxTransform(windowWidth * 0.035),
                    }}
                >
                    <View
                        className='top'
                    >
                        <View
                            className='table-number'
                            style={{
                                fontSize: pxTransform(windowWidth * 0.04),
                                backgroundImage: `url(${selectTableNumber})`,
                            }}
                        >
                            桌号{tableNum}
                        </View>
                    </View>
                    <View
                        className='bottom'
                        style={{
                            padding: `${pxTransform(windowWidth * 0.03)} ${pxTransform(windowWidth * 0.05)}`,
                            // height: `calc(85% - ${pxTransform(windowWidth * 0.1)})`,
                            width: `calc(100% - ${pxTransform(windowWidth * 0.1)})`,
                        }}
                    >
                        <Text
                            style={{
                                marginBottom: pxTransform(windowHeight * 0.02),
                            }}
                        >
                            请选择就餐人数：{selectedNum}
                        </Text>
                        <View
                            className='radio-group'
                        >
                            {
                                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                                    <View
                                        className='radio-item'
                                        key={item}
                                        style={{
                                            border: selectedNum === item && !inputFocus ? '1px solid #D61518' : 'none',
                                            backgroundColor: selectedNum === item && !inputFocus ? 'rgb(255,235,241)' : '#fff',
                                            color: selectedNum === item && !inputFocus ? '#D61518' : '#000',
                                            fontSize: pxTransform(windowWidth * 0.04),
                                        }}
                                        onClick={() => {
                                            if (item !== 10) {
                                                setSelectedNum(item)
                                            } else {
                                                setSelectedNum(0)
                                            }
                                        }}
                                    >
                                        {
                                            item === 10 ? (
                                                <Input
                                                    type="digit"
                                                    placeholder="更多"
                                                    align='center'
                                                    maxLength={3}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        '--nutui-input-padding': 0,
                                                        '--nutui-input-font-size': pxTransform(windowWidth * 0.04)
                                                    } as any}
                                                    onFocus={() => {
                                                        setInputFocus(true)
                                                    }}
                                                    onBlur={() => {
                                                        setInputFocus(false)
                                                    }}
                                                    onChange={(val) => {
                                                        setSelectedNum(Number(val))
                                                    }}
                                                />
                                            ) :
                                                item
                                        }
                                    </View>
                                ))
                            }
                        </View>
                        <Button
                            type='primary'
                            color='#D61518'
                            style={{
                                width: '100%',
                                borderRadius: pxTransform(windowHeight * 0.03),
                                height: pxTransform(windowHeight * 0.04),
                            }}
                            onClick={() => {
                                if (selectedNum && selectedNum !== 0) {
                                    // console.log('111222222222222', tableNum);

                                    // setStorage({
                                    //     key: TABLE_INFO,
                                    //     data: {
                                    //         tableId: tableId,
                                    //         peopleNum: selectedNum,
                                    //     },
                                    // })
                                    // dispatch(setIsRetrieve(true))
                                    dispatch(setTableInfo({
                                        tableId: tableId,
                                        tableNum: tableNum,
                                        peopleNum: selectedNum,
                                    }))
                                    getCartListAPI({
                                        shopId: shopId,
                                        deskId: 0,
                                        openId: userInfo?.openid!,
                                    }, (res: IResponseApi<any>) => {
                                        if (res.success && res.data.length > 0) {
                                            showModal({
                                                content: '系统识别到您有预点的商品，是否加入购物车？',
                                                confirmText: '立即加入',
                                                confirmColor: '#606E8B',
                                                success: (res) => {
                                                    if (res.confirm) {
                                                        // console.log('将预点商品加入共享购物车');
                                                        addSharedCartGoodsAPI({
                                                            singleShare: true,
                                                            appCartModifyReqVOs: cartList.map((cartItem) => {
                                                                // console.log('cartItem', cartItem);

                                                                return {
                                                                    "commodityId": cartItem.commodityId,
                                                                    "count": cartItem.count,
                                                                    "isSet": cartItem.isSet,
                                                                    "isAdd": true,
                                                                    "selected": cartItem.selected,
                                                                    "image": cartItem.image,
                                                                    "name": cartItem.name,
                                                                    "standardPrice": cartItem.price,
                                                                    "shopId": shopId,
                                                                    "deskId": tableId,
                                                                    "openId": userInfo?.openid!,
                                                                    "minimumPurchaseQuantity": cartItem.minimumPurchaseQuantity,
                                                                    "purchaseQuantityLimit": cartItem.purchaseQuantityLimit,
                                                                    "cartModifyReqVOList": cartItem.cartDOS?.map((cartDO) => {
                                                                        return {
                                                                            "commodityId": cartDO.commodityId,
                                                                            "count": cartDO.count,
                                                                            "isSet": cartDO.isSet,
                                                                            "isAdd": true,
                                                                            "selected": cartDO.selected,
                                                                            "image": cartDO.image,
                                                                            "name": cartDO.name,
                                                                            "standardPrice": cartDO.price,
                                                                            "shopId": shopId,
                                                                            "deskId": tableId,
                                                                            "openId": userInfo?.openid!,
                                                                        }
                                                                    })
                                                                }
                                                            })
                                                        }, (res: IResponseApi<any>) => {
                                                            // console.log('addSharedCartGoodsAPI res', res);
                                                            if (!res.success || res.data != true) {
                                                                showToast({
                                                                    title: '添加失败',
                                                                    icon: 'none',
                                                                    duration: 2000,
                                                                })
                                                            } else {
                                                                getCartListAPI({
                                                                    shopId: shopId,
                                                                    deskId: tableId,
                                                                    openId: userInfo?.openid!,
                                                                }, (res: IResponseApi<any>) => {
                                                                    // console.log('getCartListAPI res', res);
                                                                    if (res.success && res.data.length > 0) {
                                                                        dispatch(setCartListAction({
                                                                            type: 'set',
                                                                            data: res.data
                                                                        }))
                                                                        switchTab({
                                                                            url: '/pages/order/order',
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                        })
                                                    } else if (res.cancel) {
                                                        // console.log('清空单人购物车', userInfo?.openid);
                                                        switchTab({
                                                            url: '/pages/order/order',
                                                        })
                                                    }
                                                }
                                            })
                                        } else {
                                            switchTab({
                                                url: '/pages/order/order',
                                            })
                                        }
                                    })
                                    // switchTab({
                                    //     url: '/pages/order/order',
                                    // })
                                } else {
                                    showToast({
                                        title: '请选择就餐人数',
                                        icon: 'none',
                                        duration: 2000,
                                    })
                                }
                            }}
                        >确认</Button>
                    </View>
                </View>
            </View>
            {/* <NumberKeyboard
                visible={numberKeyboardVisible}
                onChange={(val) => {
                    setInputValue(inputValue.concat(val))
                }}
                onDelete={() => {
                    setInputValue(inputValue.slice(0, -1))
                }}
                onClose={() => setNumberKeyboardVisible(false)}
            /> */}
        </View>
    )
}
