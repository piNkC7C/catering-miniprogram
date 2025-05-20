import { useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { useLoad, getSystemInfoSync, getMenuButtonBoundingClientRect, navigateBack } from '@tarojs/taro'
import './pointsRules.scss'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { pxTransform, Image, Button, Divider, Tabs } from '@nutui/nutui-react-taro'
import { ArrowLeft, Search } from '@nutui/icons-react-taro'

export default function PointsRules() {
    // 获取登录状态和用户信息
    const {
        login: {
            loginStatus,
            userInfo
        },
        points: {
            pointsDetailList
        }
    } = useAppSelector((state) => state)

    const { statusBarHeight, windowHeight, windowWidth } = getSystemInfoSync()
    const finalStatusBarHeight = statusBarHeight || 0
    // 获取胶囊按钮信息
    const { top: topMenuButton, height: heightMenuButton, width: widthMenuButton, left: leftMenuButton } = getMenuButtonBoundingClientRect()
    // 导航栏高度 = 胶囊按钮顶部位置 + (胶囊按钮高度 + 两边距离和)/2
    const navBarHeight = (topMenuButton - finalStatusBarHeight) * 2 + heightMenuButton
    // 总高度
    const navHeight = finalStatusBarHeight + navBarHeight + 5
    const viewHeight = windowHeight - navHeight

    return (
        <View
            className='points-rules-page'
        >
            <View
                className='points-rules-nav'
                style={{
                    height: navHeight,
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
                        <Text>积分规则</Text>
                    </View>
                </View>
            </View>
            <View
                className='points-rules-content'
                style={{
                    padding: `0 ${pxTransform(windowWidth * 0.02)}`,
                    fontSize: pxTransform(windowHeight * 0.018),
                    marginTop: pxTransform(windowHeight * 0.02),
                    height: pxTransform(viewHeight - windowHeight * 0.02),
                }}
            >
                <Text>{
                    '一、积分获得规则 \n1.下单获得积分 \n订单实付满1元即可获得1积分:积分将进行抹零计胛大，即积分计算仅保留整数部分，小数部分不累计如计算应累计1.11积分，实际累计1积分。 \n鸨品的、积分使用规则及有效期 \n1.积分兑换:用户可使用积分在积分商城兑换礼品及棋经国惠券。 \n廡上有.积分有效期:今年当月内获得的积分，将在次年同癞在的月底进行清除。 \n三、相关说明 \n1.积分的获得和使用仅限于许府牛火锅局注册用户享有相关的权利: \n2.用户获得的积分不可转让，不可提现。 \n3.如产生退款，则扣除退款金额相应积分。 \n4.您不得以不合法、不正当、不诚信的方式参与活动(包括但不限于侵犯第三人合法权益、利用作弊工具、使用自动化手段、刷单软件或通过违法技术手桫₂χ墇詰踒跄沿参与活动、扰乱系统、实施网络攻击、虚假交易丑多为鈍た);否则许府牛火锅局有权拒绝兑换，使兑换失效并取消对应兑换订单，收回相应的积分及已兑换的权益;如该行为给许府牛火锅局造成损失，许府牛火锅局保留向该用户追究法律责任和经济责任的权利。5.您知悉互联网存在诸多不确定性，如因不可抗力癟的疟挎及兑换时存在大面积作弊行为、通讯路线故障或者计算机大规模瘫痪等原因致使难以继续开展本活动的，或者因其他原因而临时需要调整或取消活动轍衡寵六，许府牛火锅局会及时通知或公告。'
                    }</Text>
            </View>
        </View>
    )
} 