import { useEffect, useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { useLoad, getSystemInfoSync, getMenuButtonBoundingClientRect, navigateBack, useRouter, navigateTo } from '@tarojs/taro'
import './suggest.scss'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { pxTransform, Image, Button, Divider, Tabs, Form, Input, Checkbox, Tag, Radio, TextArea, Uploader, Picker } from '@nutui/nutui-react-taro'
import type { PickerOptions, PickerValue, PickerOnChangeCallbackParameter, PickerOption } from '@nutui/nutui-react-taro'
import { ArrowLeft, ArrowRight, Loading } from '@nutui/icons-react-taro'
import { routes } from '@/utils/constants'
import type { UploaderFileItem, UploaderFileStatus } from '@nutui/nutui-react-taro'
import { taroPost } from '@/service'
import { uploadURL } from '@/service/config'

export default function Suggest() {
    // 获取登录状态和用户信息
    const {
        login: {
            loginStatus,
            userInfo
        },
        address: {
            addSuggestChooseShop
        }
    } = useAppSelector((state) => state)

    const dispatch = useAppDispatch()

    const [visible, setVisible] = useState(false)
    const [value, setValue] = useState<string | number>('请选择反馈类型')
    const options = [[
        {
            value: '1',
            label: '商品相关'
        },
        {
            value: '2',
            label: '客户服务'
        },
        {
            value: '3',
            label: '优惠活动'
        },
        {
            value: '4',
            label: '会员积分'
        },
        {
            value: '5',
            label: '产品功能'
        },
        {
            value: '6',
            label: '其他'
        }
    ]]
    // const changePicker = ({
    //     value,
    //     index,
    //     selectedOptions,
    // }: PickerOnChangeCallbackParameter) => {
    //     console.log('changePicker', value, index, selectedOptions)
    // }
    const confirmPicker = (
        selectedOptions: PickerOptions,
        selectedValue: PickerValue[]
    ) => {
        // console.log('confirmPicker', selectedOptions, selectedValue)
        setValue(selectedOptions[0].label)
    }

    const [imageList, setImageList] = useState<UploaderFileItem[]>([])

    const addSuggest = () => {
        const reqData = {
            userId: 0,
            shopId: addSuggestChooseShop?.shopId || null,
            suggestContent: '',
            // suggestTime: '',
            suggestType: value,
            suggestImageList: [],
            contactInfo: '',
        }
        console.log('addSuggest', reqData)
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
                        onClick={() => {
                            navigateTo({
                                url: (routes.find((route) => route.name === 'chooseShop')?.path || '') + '?type=suggest',
                            })
                        }}
                    >
                        <View
                            className='choose-shop-item'
                        >
                            <Text> {addSuggestChooseShop?.shopName || '请选择门店'} </Text>
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
                            <Text> {value} </Text>
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
                            // autoUpload={false}
                            maxCount={6}
                            uploadLabel="添加图片"
                            multiple
                            deletable
                            mediaType={['image']}
                            // value={imageList}
                            onChange={(files) => {
                                console.log('onChange', files);
                            }}
                            upload={(file) => {
                                return new Promise((resolve, reject) => {
                                    taroPost({
                                        url: uploadURL,
                                        headers: {
                                            'Content-Type': 'multipart/form-data',
                                        },
                                        data: {
                                            file: file,
                                        },
                                        success: (res) => {
                                            console.log('res', res);
                                            resolve({
                                                status: 'success' as UploaderFileStatus,
                                                message: '上传成功',
                                                url: res.data,
                                            })
                                        },
                                        fail: (err) => {
                                            console.log('err', err);
                                            reject({
                                                status: 'error' as UploaderFileStatus,
                                                message: '上传失败',
                                            })
                                        },
                                    })
                                })
                            }}
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
                    onClick={() => {
                        addSuggest()
                    }}
                >
                    提交
                </Button>
            </View>
            <Picker
                title="请选择反馈类型"
                visible={visible}
                options={options}
                // onChange={changePicker}
                onConfirm={confirmPicker}
                onClose={() => setVisible(false)}
            />
        </View>
    )
}