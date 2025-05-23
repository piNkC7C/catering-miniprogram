import { View, Text } from '@tarojs/components'
import { memo, ReactNode } from 'react'
import { getSystemInfoSync, getMenuButtonBoundingClientRect } from '@tarojs/taro'
import { pxTransform, Tag, Image } from '@nutui/nutui-react-taro'
import './index.scss'
import { ISuggestItem } from '@/redux/types/address'
import equal from 'fast-deep-equal'
import { Location } from '@nutui/icons-react-taro'

interface ISuggestCardProps {
    suggestItem: ISuggestItem
}

function SuggestCard({ suggestItem }: ISuggestCardProps) {
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
            className='suggest-card'
            style={{
                marginBottom: pxTransform(windowWidth * 0.04),
                borderRadius: pxTransform(windowWidth * 0.02),
                padding: pxTransform(windowWidth * 0.02),
                // height: pxTransform(viewHeight * 0.2),
                width: `calc(100% - ${pxTransform(windowWidth * 0.04)})`,
            }}>
            <View
                className='suggest-card-top'
                style={{
                    height: pxTransform(windowHeight * 0.03),
                    fontSize: pxTransform(windowHeight * 0.015),
                }}
            >
                <View
                    className='suggest-card-top-left'
                >
                    <Location
                        size={pxTransform(windowHeight * 0.013)}
                        style={{
                            marginRight: pxTransform(windowWidth * 0.01),
                        }}
                    />
                    <Text>{suggestItem.suggestShopName}</Text>
                </View>
                <View
                    className='suggest-card-top-right'
                >
                    <Text>{suggestItem.suggestTime}</Text>
                </View>
            </View>
            <View
                className='suggest-card-bottom'
                style={{
                    height: pxTransform(windowHeight * 0.03),
                }}
            >
                <Tag
                    background="#FA2400"
                    plain
                >
                    {suggestItem.suggestType}
                </Tag>
            </View>
            <View
                className='suggest-card-content'
                style={{
                    fontSize: pxTransform(windowHeight * 0.013),
                }}
            >
                <Text>{suggestItem.suggestContent}</Text>
            </View>
            {
                suggestItem.suggestImageList && suggestItem.suggestImageList.length > 0 && (
                    <View
                        className='suggest-card-image-list'
                    >
                        {
                            suggestItem.suggestImageList.map((item) => (
                                <View
                                    className='suggest-card-image-item'
                                    style={{
                                        width: pxTransform(windowWidth * 0.2),
                                        height: pxTransform(windowWidth * 0.2),
                                        marginRight: pxTransform(windowWidth * 0.04),
                                        marginBottom: pxTransform(windowWidth * 0.02),
                                    }}
                                >
                                    <Image
                                        src={item}
                                        mode='scaleToFill'
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                        }}
                                    />
                                </View>
                            ))
                        }
                    </View>
                )
            }
        </View>
    )
}

export default memo(SuggestCard, (prevProps, nextProps) => {
    if (!equal(prevProps.suggestItem, nextProps.suggestItem)) {
        return false
    }
    return true
})