import { useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { useLoad, getSystemInfoSync, getMenuButtonBoundingClientRect, navigateBack, useRouter } from '@tarojs/taro'
import './address.scss'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { pxTransform, Image, Button, Divider, Tabs, Form, Input, Checkbox, Tag, Radio } from '@nutui/nutui-react-taro'
import { ArrowLeft, ArrowRight } from '@nutui/icons-react-taro'

export default function Address() {
    // 获取登录状态和用户信息
    const {
        login: {
            loginStatus,
            userInfo
        },
    } = useAppSelector((state) => state)

    const router = useRouter()
    const { addressId } = router.params

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
            className='address-page'
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
                        <Text> {addressId ? '编辑地址' : '新增地址'} </Text>
                    </View>
                </View>
            </View>
            <View
                className='content'
                style={{
                    padding: pxTransform(windowWidth * 0.04),
                    width: `calc(100% - ${pxTransform(windowWidth * 0.08)})`,
                    height: pxTransform(viewHeight - windowWidth * 0.08),
                }}
            >
                <Form
                    labelPosition="left"
                    divider
                    footer={
                        <>
                            <Button nativeType="submit" block type="primary">
                                保存地址
                            </Button>
                        </>
                    }
                    style={{
                        '--nutui-form-item-label-width': pxTransform(windowWidth * 0.1),
                    } as any}
                >
                    <Form.Item
                        align="center"
                        label="收货人"
                        name="addressName"
                    >
                        <View
                            className='address-name'
                        >
                            <Input
                                placeholder="名字"
                            />
                            <Divider
                            />
                            <Radio.Group direction="horizontal">
                                <Radio value="1">先生</Radio>
                                <Radio value="2">女士</Radio>
                            </Radio.Group>
                        </View>
                    </Form.Item>
                    <Form.Item
                        align="center"
                        label="手机号"
                        name="addressPhone"
                    >
                        <Input
                            placeholder="手机号"
                        />
                    </Form.Item>
                    <Form.Item
                        align="center"
                        label="地址"
                        name="address"
                    >
                        <View
                            className='address-select'
                        >
                            <View
                                style={{
                                    color: '#9C9C9C'
                                }}
                            >请选择所在地区</View>
                            <ArrowRight />
                        </View>
                    </Form.Item>
                    <Form.Item
                        align="center"
                        label="详细地址"
                        name="addressDetail"
                    >
                        <Input
                            placeholder="请输入详细地址"
                        />
                    </Form.Item>
                    <Form.Item
                        align="center"
                        label="标签"
                        name="addressTag"
                    >
                        <Radio.Group direction="horizontal">
                            <Radio shape="button" value="1">
                                家
                            </Radio>
                            <Radio shape="button" value="2">
                                公司
                            </Radio>
                            <Radio shape="button" value="3">
                                学校
                            </Radio>
                            <Radio shape="button" value="4">
                                其他
                            </Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </View>
        </View>
    )
} 