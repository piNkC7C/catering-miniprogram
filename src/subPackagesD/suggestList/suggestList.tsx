import { useEffect, useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { useLoad, getSystemInfoSync, getMenuButtonBoundingClientRect, navigateBack, useRouter, navigateTo, useDidShow } from '@tarojs/taro'
import './suggestList.scss'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { pxTransform, Image, Button, Divider, Tabs, Empty } from '@nutui/nutui-react-taro'
import { ArrowLeft, Search, Feedback } from '@nutui/icons-react-taro'
import SuggestCard from '@/components/suggestCard'
import { ISuggestItem } from '@/redux/types/address'
// 路由
import { routes, noSuggest } from '@/utils/constants'
import { getSuggestListURL } from '@/service/config'
import { taroGet } from '@/service'
import { setSuggestListAction } from '@/redux/modules/address'

export default function SuggestList() {
    // 获取登录状态和用户信息
    const {
        login: {
            loginStatus,
            userInfo
        },
        address: {
            suggestList
        }
    } = useAppSelector((state) => state)
    const dispatch = useAppDispatch()

    const getSuggestList = () => {
        taroGet({
            url: getSuggestListURL,
            success: (res) => {
                dispatch(setSuggestListAction({ type: 'set', data: res.data }))
            },
            fail: (err) => {
                console.log('获取建议列表失败:', err)
            }
        })
    }

    useDidShow(() => {
        getSuggestList()
    })

    const filterSuggestList: (suggestId: number) => ISuggestItem[] = (suggestId: number) => {
        return suggestList.filter((item) => item.suggestId === suggestId)
    }

    const [newSuggestId, setNewSuggestId] = useState<number | null>(null)
    const router = useRouter()
    const { suggestId } = router.params
    useEffect(() => {
        if (suggestId) {
            setNewSuggestId(Number(suggestId))
        }
    }, [suggestId])

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
            className='suggest-list-page'
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
                {
                    !newSuggestId && suggestList.length > 0 && (
                        <View
                            className='content-top'
                            style={{
                                height: pxTransform(windowHeight * 0.03),
                                fontSize: pxTransform(windowHeight * 0.015),
                            }}
                        >
                            <View
                                className='content-top-left'
                            >
                                <Search
                                    size={pxTransform(windowHeight * 0.015)}
                                />
                                <Text>搜索</Text>
                            </View>
                            <View
                                className='content-top-right'
                            >
                                共评价{suggestList.length}条
                            </View>
                        </View>
                    )
                }
                {
                    suggestList.length === 0 && (
                        <Empty
                            style={{
                                backgroundColor: 'transparent',
                            }}
                            image={
                                <Image
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                    }}
                                    src={noSuggest}
                                />
                            }
                        />
                    )
                }
                {
                    newSuggestId ? (
                        filterSuggestList(newSuggestId).map((item) => (
                            <SuggestCard key={item.suggestId} suggestItem={item} />
                        ))
                    ) : (
                        suggestList.map((item) => (
                            <SuggestCard key={item.suggestId} suggestItem={item} />
                        ))
                    )
                }
            </View>
            <View
                className='footer'
                style={{
                    padding: pxTransform(windowWidth * 0.04),
                    width: `calc(100% - ${pxTransform(windowWidth * 0.08)})`,
                    height: pxTransform(viewHeight * 0.1 - windowWidth * 0.08),
                }}
            >
                {
                    newSuggestId ? (
                        <Button
                            type='primary'
                            style={{
                                height: '100%',
                                width: '100%',
                                borderRadius: pxTransform(windowWidth * 0.06),
                            }}
                        >
                            查看所有评价
                        </Button>
                    ) : (
                        <Button
                            type='primary'
                            style={{
                                height: '100%',
                                width: '100%',
                                borderRadius: pxTransform(windowWidth * 0.06),
                            }}
                            icon={<Feedback />}
                            onClick={() => {
                                navigateTo({
                                    url: routes.find((route) => route.name === 'suggest')?.path || '',
                                })
                            }}
                        >
                            欢迎小主提建议
                        </Button>
                    )
                }
            </View>
        </View>
    )
} 