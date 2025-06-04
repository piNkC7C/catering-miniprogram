import { useCallback, useEffect, useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { useLoad, getSystemInfoSync, getMenuButtonBoundingClientRect, navigateBack, useRouter, showModal, getLocation,chooseLocation } from '@tarojs/taro'
import './address.scss'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { pxTransform, Image, Button, Divider, Tabs, Form, Input, Checkbox, Tag, Radio } from '@nutui/nutui-react-taro'
import { ArrowLeft, ArrowRight } from '@nutui/icons-react-taro'
import { setAddressListAction } from '@/redux/modules/address'
import { IAddressItem } from '@/redux/types/address'

export default function Address() {
    // 获取登录状态和用户信息
    const {
        login: {
            loginStatus,
            userInfo
        },
        address: {
            addressList,
            currentAddress
        }
    } = useAppSelector((state) => state)
    const dispatch = useAppDispatch()

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

    const [addressForm] = Form.useForm()

    const [userName, setUserName] = useState<string>(addressId ? currentAddress?.userName || '' : '')
    const [addressSex, setAddressSex] = useState<string>(addressId ? currentAddress?.addressSex || '1' : '1')
    const [addressName, setAddressName] = useState<string>(addressId ? (currentAddress?.addressName || '') : '')
    const [addressProvince, setAddressProvince] = useState<string>(addressId ? currentAddress?.addressProvince || '' : '')
    const [addressCity, setAddressCity] = useState<string>(addressId ? currentAddress?.addressCity || '' : '')
    const [addressArea, setAddressArea] = useState<string>(addressId ? currentAddress?.addressArea || '' : '')
    const [addressStreet, setAddressStreet] = useState<string>(addressId ? currentAddress?.addressStreet || '' : '')

    // 当前选中的标签
    const [selectAddressTag, setSelectAddressTag] = useState<string>(addressId ? currentAddress?.addressTag || '' : '')

    const getAddressTagBgColor = useCallback((tag: string) => {
        return selectAddressTag === tag ? '#FA2400' : '#F5F5F5'
    }, [addressId, currentAddress?.addressTag, selectAddressTag])

    const getAddressTagColor = useCallback((tag: string) => {
        return selectAddressTag === tag ? '#FA2400' : '#9C9C9C'
    }, [addressId, currentAddress?.addressTag, selectAddressTag])

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
                    form={addressForm}
                    initialValues={{
                        addressPhone: addressId ? currentAddress?.addressPhone || '' : '',
                        addressDetail: addressId ? currentAddress?.addressDetail || '' : '',
                    }}
                    labelPosition="left"
                    divider
                    footer={
                        <View
                            className='address-form-footer'
                        >
                            <Button
                                nativeType="submit"
                                block
                                type="primary"
                                onClick={() => {
                                    if (addressId) {
                                        dispatch(setAddressListAction({
                                            type: 'update',
                                            data: {
                                                addressId: addressId,
                                                userName: userName,
                                                addressSex: addressSex,
                                                addressPhone: addressForm.getFieldValue('addressPhone'),
                                                addressName: addressName,
                                                addressProvince: addressProvince,
                                                addressCity: addressCity,
                                                addressArea: addressArea,
                                                addressStreet: addressStreet,
                                                addressDetail: addressForm.getFieldValue('addressDetail'),
                                                addressTag: selectAddressTag,
                                            }
                                        }))
                                    } else {
                                        dispatch(setAddressListAction({
                                            type: 'add',
                                            data: {
                                                addressId: addressList.length + 1,
                                                userName: userName,
                                                addressSex: addressSex,
                                                addressPhone: addressForm.getFieldValue('addressPhone'),
                                                addressName: addressName,
                                                addressProvince: addressProvince,
                                                addressCity: addressCity,
                                                addressArea: addressArea,
                                                addressStreet: addressStreet,
                                                addressDetail: addressForm.getFieldValue('addressDetail'),
                                                addressTag: selectAddressTag,
                                            }
                                        }))
                                    }
                                    navigateBack()
                                }}
                            >
                                保存地址
                            </Button>
                            {
                                addressId && (
                                    <Button nativeType="submit" block type="default" onClick={() => {
                                        showModal({
                                            title: '提示',
                                            content: '确定删除地址吗？',
                                            success: (res) => {
                                                if (res.confirm) {
                                                    dispatch(setAddressListAction({
                                                        type: 'delete',
                                                        data: {
                                                            addressId: addressId,
                                                        }
                                                    }))
                                                    navigateBack()
                                                }
                                            },
                                        })
                                    }}>
                                        删除地址
                                    </Button>
                                )
                            }
                        </View>
                    }
                    style={{
                        '--nutui-form-item-label-width': pxTransform(windowWidth * 0.12),
                    } as any}
                >
                    <Form.Item
                        align="center"
                        label="收货人"
                    >
                        <View
                            className='address-name'
                        >
                            <Input
                                placeholder="名字"
                                value={userName}
                                onChange={(value) => {
                                    setUserName(value)
                                }}
                            />
                            <Divider
                            />
                            <Radio.Group
                                direction="horizontal"
                                value={addressSex}
                                onChange={(value) => {
                                    setAddressSex(value.toString())
                                }}
                            >
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
                    >
                        <View
                            className='address-select'
                            onClick={() => {
                                getLocation({
                                    success: (res) => {
                                        chooseLocation({
                                            latitude: res.latitude,
                                            longitude: res.longitude,
                                            success: (res) => {
                                                setAddressName(res.name)
                                                setAddressProvince('')
                                                setAddressCity('')
                                                setAddressArea('')
                                                setAddressStreet(res.address)
                                            }
                                        })
                                    }
                                })
                            }}
                        >
                            <View
                                style={{
                                    color: '#9C9C9C'
                                }}
                            >{addressName === '' ? '请选择所在地区' : addressName}</View>
                            <ArrowRight />
                        </View>
                    </Form.Item>
                    <Form.Item
                        align="center"
                        label="门牌号"
                        name="addressDetail"
                    >
                        <Input
                            placeholder="请输入详细地址"
                        />
                    </Form.Item>
                    <Form.Item
                        align="center"
                        label="标签"
                    >
                        <View
                            className='address-tag'
                        >
                            <Tag
                                background={getAddressTagBgColor('1')}
                                color={getAddressTagColor('1')}
                                plain
                                style={{
                                    marginRight: pxTransform(windowWidth * 0.02),
                                    '--nutui-tag-height': '18px',
                                    '--nutui-tag-padding': '2px 17px',
                                    '--nutui-tag-font-size': '14px'
                                } as any}
                                onClick={() => {
                                    setSelectAddressTag('1')
                                }}
                            >
                                家
                            </Tag>
                            <Tag
                                background={getAddressTagBgColor('2')}
                                color={getAddressTagColor('2')}
                                plain
                                style={{
                                    marginRight: pxTransform(windowWidth * 0.02),
                                    '--nutui-tag-height': '18px',
                                    '--nutui-tag-padding': '2px 10px',
                                    '--nutui-tag-font-size': '14px'
                                } as any}
                                onClick={() => {
                                    setSelectAddressTag('2')
                                }}
                            >
                                公司
                            </Tag>
                            <Tag
                                background={getAddressTagBgColor('3')}
                                color={getAddressTagColor('3')}
                                plain
                                style={{
                                    marginRight: pxTransform(windowWidth * 0.02),
                                    '--nutui-tag-height': '18px',
                                    '--nutui-tag-padding': '2px 10px',
                                    '--nutui-tag-font-size': '14px'
                                } as any}
                                onClick={() => {
                                    setSelectAddressTag('3')
                                }}
                            >
                                学校
                            </Tag>
                            <Tag
                                background={getAddressTagBgColor('4')}
                                color={getAddressTagColor('4')}
                                plain
                                style={{
                                    '--nutui-tag-height': '18px',
                                    '--nutui-tag-padding': '2px 10px',
                                    '--nutui-tag-font-size': '14px'
                                } as any}
                                onClick={() => {
                                    setSelectAddressTag('4')
                                }}
                            >
                                其他
                            </Tag>
                        </View>
                    </Form.Item>
                </Form>
            </View>
        </View>
    )
} 