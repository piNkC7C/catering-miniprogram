import { useEffect, useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { useLoad, getSystemInfoSync, getMenuButtonBoundingClientRect, navigateBack, useRouter } from '@tarojs/taro'
import './suggest.scss'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { pxTransform, Image, Button, Divider, Tabs, Form, Input, Checkbox, Tag, Radio, TextArea, Uploader, Picker } from '@nutui/nutui-react-taro'
import { ArrowLeft, ArrowRight } from '@nutui/icons-react-taro'

export default function Suggest() {
    // 获取登录状态和用户信息
    const {
        login: {
            loginStatus,
            userInfo
        },
    } = useAppSelector((state) => state)

    const [visible, setVisible] = useState(false)
    const [value, setValue] = useState([])
    const [options, setOptions] = useState([])
    const changePicker = (value: any) => {
        setValue(value)
    }
    const confirmPicker = (value: any) => {
        setValue(value)
    }


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
            className='suggest-page'
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
                        <Text> 建议反馈 </Text>
                    </View>
                </View>
            </View>
            <View
                className='content'
                style={{
                    padding: pxTransform(windowWidth * 0.04),
                    width: `calc(100% - ${pxTransform(windowWidth * 0.08)})`,
                    height: pxTransform(viewHeight * 0.9 - windowWidth * 0.08),
                }}
            >
                <View
                    className='suggest-form'
                    style={{
                        padding: pxTransform(windowWidth * 0.04),
                        width: `calc(100% - ${pxTransform(windowWidth * 0.08)})`,
                        borderRadius: pxTransform(windowWidth * 0.02),
                    }}
                >
                    <View
                        className='choose-shop'
                    >
                        <View
                            className='choose-shop-item'
                        >
                            <Text> 请选择门店 </Text>
                        </View>
                        <ArrowRight
                            size={pxTransform(windowWidth * 0.05)}
                        />
                    </View>
                    <Divider
                    />
                    <View
                        className='choose-type'
                        onClick={() => {
                            setVisible(true)
                        }}
                    >
                        <View
                            className='choose-type-item'
                        >
                            <Text> 请选择反馈类型 </Text>
                        </View>
                        <ArrowRight
                            size={pxTransform(windowWidth * 0.05)}
                        />
                    </View>
                    <Divider
                    />
                    <View
                        className='suggest-text'
                        style={{
                        }}
                    >
                        <TextArea
                            placeholder='5字以上清晰描述您的反馈，我们会尽快处理'
                            rows={10}
                            showCount
                            maxLength={300}
                            style={{
                                height: pxTransform(windowHeight * 0.1),
                                backgroundColor: '#f5f5f5',
                                borderRadius: pxTransform(windowWidth * 0.02),
                            }}
                        >
                        </TextArea>
                    </View>
                    <Divider
                    />
                    <View
                        className='upload-image'
                    >
                        <Uploader
                            maxCount={6}
                            uploadLabel="添加图片"
                        />
                    </View>
                </View>
                <View
                    className='contact-info'
                    style={{
                        marginTop: pxTransform(windowWidth * 0.02),
                        padding: pxTransform(windowWidth * 0.02),
                        backgroundColor: '#fff',
                        borderRadius: pxTransform(windowWidth * 0.02),
                        width: `calc(100% - ${pxTransform(windowWidth * 0.04)})`,
                        height: pxTransform(windowHeight * 0.04),
                    }}
                >
                    <Input
                        placeholder='手机号/邮箱/微信（选填）'
                    />
                </View>
            </View>
            <View
                className='submit-button'
                style={{
                    paddingBottom: pxTransform(windowWidth * 0.04),
                    width: '100%',
                    height: pxTransform(windowHeight * 0.06),
                }}
            >
                <Button
                    type='primary'
                    style={{
                        borderRadius: pxTransform(windowWidth * 0.05),
                        width: '90%',
                        height: pxTransform(windowHeight * 0.05),
                    }}
                >
                    提交
                </Button>
            </View>
            <Picker
                title="请选择反馈类型"
                visible={visible}
                value={value}
                options={options}
                onChange={changePicker}
                onConfirm={confirmPicker}
                onClose={() => setVisible(false)}
            />
        </View>
    )
}