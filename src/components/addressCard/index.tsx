import { View, Text } from '@tarojs/components'
import { memo, ReactNode, useEffect } from 'react'
import './index.scss'
import { IAddressItem } from '@/redux/types/address'
import { getSystemInfoSync, getMenuButtonBoundingClientRect, navigateTo } from '@tarojs/taro'
import { pxTransform, Tag } from '@nutui/nutui-react-taro'
import { Edit } from '@nutui/icons-react-taro'
import equal from 'fast-deep-equal'
import { routes } from '@/utils/constants'
import { useAppDispatch } from '@/hooks/useAppStore'
import { setCurrentAddressAction } from '@/redux/modules/address'

interface IAddressCardProps {
    addressItem: IAddressItem
}

function AddressCard({ addressItem }: IAddressCardProps) {

    const dispatch = useAppDispatch()

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
            className='address-card'
            style={{
                marginBottom: pxTransform(windowWidth * 0.04),
                borderRadius: pxTransform(windowWidth * 0.02),
                padding: pxTransform(windowWidth * 0.02),
                height: pxTransform(viewHeight * 0.05),
                width: `calc(100% - ${pxTransform(windowWidth * 0.04)})`,
            }}
        >
            <View
                className='address-card-left'
            >
                <View
                    className='address-card-left-top'
                >
                    {
                        addressItem.addressTag && (
                            <Tag
                                type='primary'
                                style={{
                                    marginRight: pxTransform(windowWidth * 0.02),
                                }}
                            >
                                {addressItem.addressTag === '1' && '家'}
                                {addressItem.addressTag === '2' && '公司'}
                                {addressItem.addressTag === '3' && '学校'}
                                {addressItem.addressTag === '4' && '其他'}
                            </Tag>
                        )
                    }
                    <View
                    >{addressItem.addressName}&nbsp;{addressItem.addressDetail}</View>
                </View>
                <View
                    className='address-card-left-bottom'
                    style={{
                        fontSize: pxTransform(windowHeight * 0.013),
                    }}
                >
                    <Text
                        style={{
                            width: '5rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >{addressItem.userName}</Text>
                    &nbsp;
                    <Text>{addressItem.addressSex === '1' ? '(先生)' : '(女士)'}</Text>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Text>{addressItem.addressPhone.slice(0, 3)}****{addressItem.addressPhone.slice(-4)}</Text>
                </View>
            </View>
            <View
                className='address-card-right'
            >
                <Edit
                    size={pxTransform(windowWidth * 0.05)}
                    onClick={() => {
                        dispatch(setCurrentAddressAction({
                            type: 'set',
                            data: addressItem
                        }))
                        navigateTo({
                            url: (routes.find((route) => route.name === 'address')?.path || '') + `?addressId=${addressItem.addressId}`,
                        })
                    }}
                />
            </View>
        </View>
    )
}

export default memo(AddressCard, (prevProps, nextProps) => {
    if (!equal(prevProps.addressItem, nextProps.addressItem)) {
        return false
    }
    return true
})
