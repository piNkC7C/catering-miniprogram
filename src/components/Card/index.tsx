import { View, Text } from '@tarojs/components'
import { memo } from 'react'
import equal from 'fast-deep-equal'
import { getSystemInfoSync, getMenuButtonBoundingClientRect } from '@tarojs/taro'
import { pxTransform, Divider } from '@nutui/nutui-react-taro'

interface ICardProps {
    title: string
    contentList: {
        id: string
        label: string
        value: any
    }[]
}

function PureCard({ title, contentList }: ICardProps) {

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
            style={{
                padding: pxTransform(windowWidth * 0.03),
                paddingTop: 0,
                width: `calc(95% - ${pxTransform(windowWidth * 0.06)})`,
                borderRadius: pxTransform(windowHeight * 0.015),
                backgroundColor: '#fff',
                marginTop: pxTransform(windowHeight * 0.015),
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <View
                className='card-title'
                style={{
                    width: '100%',
                    height: pxTransform(windowHeight * 0.05),
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                {title}
            </View>
            <Divider
                style={{
                    '--nutui-divider-margin': 0
                } as any}
            />
            <View
                className='card-content'
                style={{
                    width: '100%',
                }}
            >
                {contentList.map((item) => (
                    <View
                        key={item.id}
                        style={{
                            width: '100%',
                            height: pxTransform(windowHeight * 0.03),
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: pxTransform(windowHeight * 0.012),
                        }}
                    >
                        <Text
                            style={{
                                color: '#929292'
                            }}
                        >{item.label}</Text>
                        <Text>{item.value}</Text>
                    </View>
                ))}
            </View>
        </View>
    )
}


export default memo(PureCard)