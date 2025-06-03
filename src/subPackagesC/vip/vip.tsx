import { useEffect, useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { useLoad, getSystemInfoSync, getMenuButtonBoundingClientRect, navigateBack } from '@tarojs/taro'
import './vip.scss'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { pxTransform, Image, Button, Divider, Tabs, Swiper } from '@nutui/nutui-react-taro'
import { ArrowLeft, Search } from '@nutui/icons-react-taro'
import { level1Img, level2Img, level3Img, level4Img } from '@/utils/constants'

export default function VIP() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [startX, setStartX] = useState(0)
    const [moveX, setMoveX] = useState(0)
    const [animating, setAnimating] = useState(false)

    // 获取登录状态和用户信息
    const {
        login: {
            loginStatus,
            userInfo
        },
        points: {
            vipLevel
        }
    } = useAppSelector((state) => state)

    const vipLevelsList = [
        {
            level: 1,
            name: 'V1',
            progress: 0,
            left: '0%',
            decimal: 0,
        },
        {
            level: 2,
            name: 'V2',
            progress: 300,
            left: '25%',
            decimal: 0.25,
        },
        {
            level: 3,
            name: 'V3',
            progress: 1000,
            left: '60%',
            decimal: 0.6,
        },
        {
            level: 4,
            name: 'V4',
            progress: 5000,
            left: '100%',
            decimal: 1,
        },
    ]

    const previousLevel = vipLevelsList.filter((item) => vipLevel.exp > item.progress).sort((a, b) => b.progress - a.progress)[0]

    const currentLevel = vipLevelsList.filter((item) => vipLevel.exp <= item.progress).sort((a, b) => a.progress - b.progress)[0]

    // 计算当前会员等级长度百分比
    const vipProgress = Math.floor((previousLevel.decimal + (vipLevel.exp - previousLevel.progress) / (currentLevel.progress - previousLevel.progress) * (currentLevel.decimal - previousLevel.decimal)) * 100)

    const list = [
        level1Img,
        level2Img,
        level3Img,
        level4Img,
    ]

    const { statusBarHeight, windowHeight, windowWidth } = getSystemInfoSync()
    const finalStatusBarHeight = statusBarHeight || 0
    // 获取胶囊按钮信息
    const { top: topMenuButton, height: heightMenuButton, width: widthMenuButton, left: leftMenuButton, right: rightMenuButton } = getMenuButtonBoundingClientRect()
    // 导航栏高度 = 胶囊按钮顶部位置 + (胶囊按钮高度 + 两边距离和)/2
    const navBarHeight = (topMenuButton - finalStatusBarHeight) * 2 + heightMenuButton
    // 总高度
    const navHeight = finalStatusBarHeight + navBarHeight + 5
    const viewHeight = windowHeight - navHeight

    const handleTouchStart = (e) => {
        setStartX(e.touches[0].clientX)
    }

    const handleTouchMove = (e) => {
        const currentX = e.touches[0].clientX
        const diff = currentX - startX
        setMoveX(diff)
    }

    const handleTouchEnd = () => {
        if (Math.abs(moveX) > 50) { // 滑动距离超过50px时触发切换
            if (moveX > 0 && currentIndex > 0) {
                setCurrentIndex(currentIndex - 1)
            } else if (moveX < 0 && currentIndex < list.length - 1) {
                setCurrentIndex(currentIndex + 1)
            }
        }
        setMoveX(0)
        setAnimating(true)
        setTimeout(() => {
            setAnimating(false)
        }, 300)
    }

    return (
        <View
            className='vip-page'
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
                        <Text> 会员权益 </Text>
                    </View>
                </View>
            </View>
            <View
                className='content'
                style={{
                    height: pxTransform(viewHeight),
                }}
            >
                <View
                    style={{
                        margin: `${pxTransform(windowHeight * 0.02)} ${pxTransform(windowWidth * 0.025)}`,
                        width: `calc(100% - ${pxTransform(windowWidth * 0.05)})`,
                    }}
                >
                    <Text>Lv{vipLevel.level}{vipLevel.name} 会员</Text>
                </View>
                <View
                    className='progress-container'
                    style={{
                        margin: `${pxTransform(windowHeight * 0.03)} ${pxTransform(windowWidth * 0.025)}`,
                        width: `calc(100% - ${pxTransform(windowWidth * 0.05)})`,
                    }}
                >
                    <View
                        className='progress'
                        style={{
                            backgroundColor: vipLevel.exp >= 5000 ? '#D61518' : '#D9D9D9',
                        }}
                    >
                        {
                            vipLevelsList.map((item) => (
                                <>
                                    <Text
                                        key={item.level}
                                        className='progress-text'
                                        style={item.level !== 1 && item.level !== 4 ? {
                                            fontSize: pxTransform(windowWidth * 0.03),
                                            width: pxTransform(windowWidth * 0.12),
                                            height: 'max-content',
                                            left: `calc(${item.left} - ${pxTransform(windowWidth * 0.06)})`,
                                            textAlign: 'center',
                                        } : item.level === 4 ? {
                                            fontSize: pxTransform(windowWidth * 0.03),
                                            width: pxTransform(windowWidth * 0.12),
                                            height: 'max-content',
                                            left: `calc(${item.left} - ${pxTransform(windowWidth * 0.12)})`,
                                            textAlign: 'right',
                                        } : {
                                            fontSize: pxTransform(windowWidth * 0.03),
                                            width: pxTransform(windowWidth * 0.12),
                                            height: 'max-content',
                                            left: item.left,
                                        } as any}
                                    >
                                        {item.progress}
                                    </Text>
                                    <View
                                        key={item.level}
                                        className='progress-item'
                                        style={{
                                            left: item.left,
                                            backgroundColor: vipLevel.exp >= item.progress ? '#D61518' : '#D9D9D9',
                                        }}
                                    ></View>
                                    <Text
                                        key={item.level}
                                        className='level-text'
                                        style={item.level !== 1 && item.level !== 4 ? {
                                            fontSize: pxTransform(windowWidth * 0.03),
                                            width: pxTransform(windowWidth * 0.12),
                                            height: 'max-content',
                                            left: `calc(${item.left} - ${pxTransform(windowWidth * 0.06)})`,
                                            textAlign: 'center',
                                        } : item.level === 4 ? {
                                            fontSize: pxTransform(windowWidth * 0.03),
                                            width: pxTransform(windowWidth * 0.12),
                                            height: 'max-content',
                                            left: `calc(${item.left} - ${pxTransform(windowWidth * 0.12)})`,
                                            textAlign: 'right',
                                        } : {
                                            fontSize: pxTransform(windowWidth * 0.03),
                                            width: pxTransform(windowWidth * 0.12),
                                            height: 'max-content',
                                            left: item.left,
                                        } as any}
                                    >
                                        {item.name}
                                    </Text>
                                </>
                            ))
                        }
                        {
                            vipLevel.exp > 0 && vipLevel.exp < 5000 && (
                                <View
                                    className='progress-level'
                                    style={{
                                        width: `${vipProgress}%`,
                                    }}
                                ></View>
                            )
                        }
                    </View>
                </View>
                <View className='swiper-container'>
                    <View 
                        className='swiper-wrapper'
                        style={{
                            transform: `translateX(calc(${-currentIndex * 100}% + ${moveX}px))`,
                            transition: animating ? 'transform 0.3s ease-out' : 'none'
                        }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {list.map((item, index) => (
                            <View 
                                key={index} 
                                className='swiper-slide'
                            >
                                <Image 
                                    src={item} 
                                    width='100%'
                                    height='100%'
                                />
                            </View>
                        ))}
                    </View>
                    {/* <View className='swiper-pagination'>
                        {list.map((_, index) => (
                            <View 
                                key={index} 
                                className={`pagination-dot ${index === currentIndex ? 'active' : ''}`} 
                            />
                        ))}
                    </View> */}
                </View>
            </View>
        </View>
    )
} 