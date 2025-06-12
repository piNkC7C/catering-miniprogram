import { View, Text } from '@tarojs/components'
import { memo, useEffect, useState } from 'react'
import equal from 'fast-deep-equal'
import { getSystemInfoSync, getMenuButtonBoundingClientRect } from '@tarojs/taro'
import { pxTransform, Divider, Popup, Cell, Image } from '@nutui/nutui-react-taro'
import { vipFrame } from '@/utils/constants'
import { getVipCodeAPI } from '@/api/login'
import { IResponseApi } from '@/api/type'
import dayjs from 'dayjs'

interface IVipCodeProps {
    vipCodeVisible: boolean
    onClose: () => void
}

const PureVipCode: React.FC<IVipCodeProps> = ({ vipCodeVisible, onClose }) => {

    const { statusBarHeight, windowHeight, windowWidth } = getSystemInfoSync()
    const finalStatusBarHeight = statusBarHeight || 0
    // 获取胶囊按钮信息
    const { top: topMenuButton, height: heightMenuButton, width: widthMenuButton, left: leftMenuButton, right: rightMenuButton } = getMenuButtonBoundingClientRect()
    // 导航栏高度 = 胶囊按钮顶部位置 + (胶囊按钮高度 + 两边距离和)/2
    const navBarHeight = (topMenuButton - finalStatusBarHeight) * 2 + heightMenuButton
    // 总高度
    const navHeight = finalStatusBarHeight + navBarHeight + 5
    const viewHeight = windowHeight - navHeight


    const [barCode, setBarCode] = useState<string>('')
    const [qrCode, setQrCode] = useState<string>('')
    useEffect(() => {
        getVipCodeAPI((res: IResponseApi<any>) => {
            if (res.success) {
                setBarCode(res.data.barCode)
                setQrCode(res.data.qrCode)
            }
        })
    }, [])

    return (
        <Popup
            closeable
            round
            visible={vipCodeVisible}
            onClose={onClose}
            style={{
                maxWidth: pxTransform(windowWidth),
                width: pxTransform(windowWidth * 0.85),
                height: pxTransform(windowHeight * 0.75),
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            lockScroll
            destroyOnClose
            closeOnOverlayClick={false}
        >
            <Image
                src={barCode}
                mode="scaleToFill"
                width={pxTransform(windowWidth * 0.75)}
                height={pxTransform(windowHeight * 0.15)}
            />
            <Image
                src={qrCode}
                mode="widthFix"
                width={pxTransform(windowWidth * 0.75)}
                height={pxTransform(windowWidth * 0.75)}
            />
            <View
                style={{
                    width: '85%',
                    textAlign:'center'
                }}
            >
                {dayjs().format('YYYY-MM-DD HH:mm:ss')}
            </View>
        </Popup>
    )
}


export default memo(PureVipCode, (prevProps, nextProps) => {
    if (prevProps.vipCodeVisible !== nextProps.vipCodeVisible) {
        return false
    }
    return true
})