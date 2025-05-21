import { useState, useEffect } from 'react'
import { View, Text, Span } from '@tarojs/components'
import { useLoad, getSystemInfoSync, getMenuButtonBoundingClientRect, navigateTo, switchTab,showToast } from '@tarojs/taro'
import './selectTable.scss'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { setLoginStatus, userInfoAction } from '@/redux/modules/login'
import { pxTransform, Button, Image, Grid, Popup, Checkbox, Space, Toast, Radio, Input, NumberKeyboard } from '@nutui/nutui-react-taro'
import { ArrowRight, Close, Home } from '@nutui/icons-react-taro'
import userNoLogin from '@/assets/index/user-nologin@2x.png'

export default function SelectTable() {
    // 获取登录状态和用户信息
    const {
        login: {
            loginStatus,
            userInfo
        }
    } = useAppSelector((state) => state)

    // 选中的就餐人数
    const [selectedNum, setSelectedNum] = useState<number>(0)
    const [inputFocus, setInputFocus] = useState<boolean>(false)
    // const [numberKeyboardVisible, setNumberKeyboardVisible] = useState<boolean>(false)
    // const [inputValue, setInputValue] = useState<string>('')

    useEffect(() => {
        console.log('selectedNum', selectedNum)
    }, [selectedNum])

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
                    navigateTo({
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
                        src={userNoLogin}
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
                            }}
                        >
                            桌号{5}
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
                                    navigateTo({
                                        url: `/pages/order/order?tableId=5&peopleNum=${selectedNum}`,
                                    })
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
