import { useCallback, useState } from 'react'
import { View, Text } from '@tarojs/components'
import { useLoad, getSystemInfoSync, getMenuButtonBoundingClientRect, navigateBack, useRouter, showModal, getLocation, chooseLocation, showToast } from '@tarojs/taro'
import './address.scss'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { pxTransform, Button, Divider, Form, Input, Tag, Radio } from '@nutui/nutui-react-taro'
import { ArrowLeft, ArrowRight } from '@nutui/icons-react-taro'
import QQMapWX from '@/libs/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js'
import { qqmapsdkKey } from '@/utils/constants'
import { addAddressAPI, editAddressAPI } from '@/api/address'

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

    let qqmapsdk: any

    useLoad(() => {
        qqmapsdk = new QQMapWX({
            key: qqmapsdkKey
        })
    })

    // 逆解析经纬度获取地址信息
    const getAddressByLocation = (latitude, longitude) => {
        qqmapsdk.reverseGeocoder({
            location: {
                latitude,
                longitude
            },
            success(res) {
                console.log('逆解析成功:', res.result);
                const { province, city, district, street } = res.result.address_component;
                setAddressProvince(province)
                setAddressCity(city)
                setAddressArea(district)
                setAddressStreet(street)
            },
            fail(err) {
                console.error('逆解析失败:', err);
            }
        });
    };

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

    const addOrEditAddress = () => {
        const addressPhone = addressForm.getFieldValue('addressPhone')
        if (userName === '') {
            showToast({
                title: '名字不能为空哦',
                icon: 'none',
            })
            return
        }
        if (addressPhone === '') {
            showToast({
                title: '手机号是必填的',
                icon: 'none',
            })
            return
        }
        if (addressProvince === '' && addressCity === '' && addressArea === '' && addressStreet === '') {
            showToast({
                title: '地址是必选项',
                icon: 'none',
            })
            return
        }
        if (addressForm.getFieldValue('addressDetail') === '') {
            showToast({
                title: '门牌号是必填的',
                icon: 'none',
            })
            return
        }
        if (!userName.match(/[\u4e00-\u9fa5a-zA-Z]/)) {
            showToast({
                title: '名字必须包含文字或字母',
                icon: 'none',
            })
            return
        }
        if (addressPhone.length !== 11) {
            showToast({
                title: '手机号格式不正确',
                icon: 'none',
            })
            return
        }
        if (addressId) {
            // 编辑地址
            editAddressAPI({
                    id: addressId,
                    userName,
                    addressName,
                    addressPhone: addressForm.getFieldValue('addressPhone'),
                    addressTag: selectAddressTag,
                    addressSex,
                    addressDetail: addressForm.getFieldValue('addressDetail'),
                    addressProvince,
                    addressCity,
                    addressArea,
                    addressStreet,
            }, (res) => {
                if (res.success) {
                    console.log('编辑地址成功:', res)
                    navigateBack()
                } else {
                    console.log('编辑地址失败:', res)
                }
            })
        } else {
            // 新增地址
            addAddressAPI({
                // userId: userInfo.userId,
                userName,
                addressName,
                addressPhone: addressForm.getFieldValue('addressPhone'),
                addressTag: selectAddressTag,
                addressSex,
                addressDetail: addressForm.getFieldValue('addressDetail'),
                addressProvince,
                addressCity,
                addressArea,
                addressStreet,
            }, (res) => {
                if (res.success) {
                    console.log('新增地址成功:', res)
                    navigateBack()
                } else {
                    console.log('新增地址失败:', res)
                }
            })
        }
        // navigateBack()
    }

    const deleteAddress = () => {
        navigateBack()
    }

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
                                    addOrEditAddress()
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
                                                    deleteAddress()
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
                                                getAddressByLocation(res.latitude, res.longitude)
                                                setAddressName(res.name)
                                                // setAddressProvince('')
                                                // setAddressCity('')
                                                // setAddressArea('')
                                                // setAddressStreet(res.address)
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