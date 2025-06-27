import { View, Text } from '@tarojs/components'
import { memo, useEffect, useState } from 'react'
import equal from 'fast-deep-equal'
import { getSystemInfoSync, getMenuButtonBoundingClientRect } from '@tarojs/taro'
import { pxTransform, Divider, Popup, Cell, Image } from '@nutui/nutui-react-taro'
import { vipFrame } from '@/utils/constants'
import { IResponseApi } from '@/api/type'
import dayjs from 'dayjs'
import { useAppSelector } from '@/hooks/useAppStore'

interface IShopInfoProps {
    shopInfoVisible: boolean
    onClose: () => void
}

const PureShopInfo: React.FC<IShopInfoProps> = ({ shopInfoVisible, onClose }) => {
    const {
        address: {
            currentShop
        }
    } = useAppSelector((state) => {
        return state
    })
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
        <Popup
            closeable
            // round
            visible={shopInfoVisible}
            onClose={onClose}
            position="bottom"
            title="门店信息"
            lockScroll
            style={{
                height: `calc(${pxTransform(windowHeight * 0.1)} + 50px)`
            }}
        // destroyOnClose
        // closeOnOverlayClick={false}
        >
            <View
                style={{
                    padding: '10px',
                    // maxWidth: pxTransform(windowWidth),
                    // width: pxTransform(windowWidth * 0.85),
                    height: `calc(100% - 50px)`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    // justifyContent: 'space-around',
                    backgroundColor: '#F5F5F5',
                    color: '#999',
                    fontSize: pxTransform(windowHeight * 0.015),
                    boxSizing:'border-box'
                }}
            >

                <View
                    style={{
                        marginTop: '10px',
                        backgroundColor: '#F5F5F5',
                        fontSize: pxTransform(windowHeight * 0.018),
                        fontWeight: 'bold',
                        color: '#333',
                    }}
                >
                    门店信息
                </View>
                <View
                    style={{
                        marginTop: '10px',
                    }}
                >
                    地址：{currentShop?.shopProvince}{currentShop?.shopCity}{currentShop?.shopArea}{currentShop?.shopStreet}{currentShop?.shopDetail}
                </View>
                <View
                    style={{
                        marginTop: '10px',
                    }}
                >
                    门店固话：{currentShop?.shopPhone}
                </View>
                <View
                    style={{
                        marginTop: '10px',
                    }}
                >
                    门店营业时间：周一～周日{currentShop?.businessStartTime}-{currentShop?.businessEndTime}
                </View>
            </View>
        </Popup>
    )
}


export default memo(PureShopInfo, (prevProps, nextProps) => {
    if (prevProps.shopInfoVisible !== nextProps.shopInfoVisible) {
        return false
    }
    return true
})