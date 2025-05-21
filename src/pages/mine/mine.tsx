import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { useLoad, getSystemInfoSync, getMenuButtonBoundingClientRect, navigateTo } from '@tarojs/taro'
import './mine.scss'
import { useAppSelector } from '@/hooks/useAppStore'
import { pxTransform, Image, Button } from '@nutui/nutui-react-taro'
import { ArrowRight } from '@nutui/icons-react-taro'
import mineNavBgi from '@/assets/mine/mine-bgi@2x.png'
import userNoLogin from '@/assets/index/user-nologin@2x.png'
import mineJifen from '@/assets/mine/mine-jifen@2x.png'
import mineYouhui from '@/assets/mine/mine-yhq@2x.png'
import mineYuE from '@/assets/mine/mine-ye@2x.png'
import mineLiPai from '@/assets/mine/mine-lek@2x.png'
import mineKeFu1 from '@/assets/mine/mine-kf1@2x.png'
import mineKeFu2 from '@/assets/mine/mine-kf2@2x.png'
import mineDizhi from '@/assets/mine/mine-address@2x.png'
import mineHuiyuan from '@/assets/mine/mine-vip@2x.png'
import LoginPopup from '@/components/LoginPopup'

export default function Mine() {
  // 获取登录状态和用户信息
  const {
    login: {
      loginStatus,
      userInfo
    }
  } = useAppSelector((state) => state)
  // useLoad(() => {
  //   console.log('Mine page loaded.')
  // })

  const { statusBarHeight, windowHeight, windowWidth } = getSystemInfoSync()
  const finalStatusBarHeight = statusBarHeight || 0
  // 获取胶囊按钮信息
  const { top: topMenuButton, height: heightMenuButton } = getMenuButtonBoundingClientRect()
  // 导航栏高度 = 胶囊按钮顶部位置 + (胶囊按钮高度 + 两边距离和)/2
  const navBarHeight = (topMenuButton - finalStatusBarHeight) * 2 + heightMenuButton
  // 总高度
  const navHeight = finalStatusBarHeight + navBarHeight + 5
  // 获取可视区域高度
  const viewHeight = windowHeight - navHeight
  const contentHeight = (windowHeight * 0.25 - navHeight) / 2 + navHeight

  const mineContentMiddleBottomItemList = [
    {
      title: '积分',
      icon: mineJifen,
      desc: '查看积分',
      path: '/pages/points/points'
    },
    {
      title: '优惠券',
      icon: mineYouhui,
      desc: '查看优惠券',
      path: '/pages/couponList/couponList?type=all'
    },
    // {
    //   title: '余额',
    //   icon: mineYuE,
    //   desc: '查看余额',
    //   path: '/pages/balance/balance'
    // },
    // {
    //   title: '礼品卡',
    //   icon: mineLiPai,
    //   desc: '查看礼品卡',
    //   path: '/pages/giftCard/giftCard'
    // }
  ]

  const mineContentBottomBottomItemList = [
    {
      title: '我的地址',
      icon: mineDizhi,
    },
    {
      title: '会员码',
      icon: mineHuiyuan,
    },
    {
      title: '联系客服',
      icon: mineKeFu1,
      path: '/subPackages/selectTable/selectTable'
    },
    {
      title: '反馈建议',
      icon: mineKeFu2,
    },
  ]

  // 登录组件
  const [loginPopupVisible, setLoginPopupVisible] = useState<boolean>(false)

  return (
    <View
      className='mine-page'
    >
      <View
        className='mine-nav'
        style={{
        }}
      >
        <Image
          src={mineNavBgi}
        />
      </View>
      <View
        className='mine-content'
        style={{
          padding: `0 5%`,
          top: `${pxTransform(contentHeight)}`,
          height: `calc(100% - ${pxTransform(contentHeight)})`
        }}
      >
        <View
          className='mine-content-top mine-content-item'
          style={{
            padding: `${pxTransform(windowWidth * 0.03)} ${pxTransform(windowWidth * 0.03)}`,
            width: `calc(100% - ${pxTransform(windowWidth * 0.06)})`,
            height: `calc(10% - ${pxTransform(windowWidth * 0.06)})`,
          }}
        >
          <View className='mine-content-top-left'>
            <Image
              mode='scaleToFill'
              src={userInfo?.avatar || userNoLogin}
              width={`${pxTransform(windowWidth * 0.1)}`}
              height={`${pxTransform(windowWidth * 0.1)}`}
            />
            <View className='mine-content-top-left-name'>
              <Text
                style={{
                  fontSize: `${pxTransform(windowWidth * 0.05)}`,
                  color: '#333',
                  fontWeight: 'bold',
                }}
              >{loginStatus === 0 ? 'HI,xxx火锅用户' : `HI,${userInfo?.nickname}`}</Text>

              {loginStatus === 0 ? (
                <Text
                  style={{
                    fontSize: `${pxTransform(windowWidth * 0.025)}`,
                    color: '#605F5E',
                  }}
                >为给您提供更好的服务请授权登录</Text>
              ) : (
                <Button
                  type="primary"
                  size="small"
                  style={{
                    marginTop: pxTransform(windowHeight * 0.005),
                    height: pxTransform(windowHeight * 0.02),
                    fontSize: pxTransform(windowHeight * 0.015),
                    borderRadius: pxTransform(windowHeight * 0.05),
                  }}
                  rightIcon={<ArrowRight />}
                  onClick={() => {
                    navigateTo({
                      url: '/subPackages/vip/vip',
                    })
                  }}
                >
                  查看我的会员权益
                </Button>
              )}
            </View>
          </View>
          <View className='mine-content-top-right'>
            {
              loginStatus === 0 && (
                <Button
                  type='primary'
                  size='normal'
                  style={{
                    fontSize: `${pxTransform(windowWidth * 0.03)}`,
                    borderRadius: `${pxTransform(windowWidth * 0.05)}`,
                  }}
                  onClick={() => {
                    if (loginStatus === 0) {
                      setLoginPopupVisible(true)
                    }
                  }}
                >登录/注册</Button>
              )
            }
          </View>
        </View>
        <View
          className='mine-content-middle mine-content-item'
          style={{
            padding: `${pxTransform(windowWidth * 0.03)} ${pxTransform(windowWidth * 0.03)}`,
            paddingBottom: `${pxTransform(windowWidth * 0.05)}`,
            width: `calc(100% - ${pxTransform(windowWidth * 0.06)})`,
            // height: `calc(40% - ${pxTransform(windowWidth * 0.06)})`,
          }}
        >
          <View
            className='mine-content-middle-top'
            style={{
              marginBottom: `${pxTransform(windowWidth * 0.03)}`,
            }}
          >
            我的资产
          </View>
          <View
            className='mine-content-middle-bottom'
          >
            {
              mineContentMiddleBottomItemList.map((item, index) => (
                <View
                  className='mine-content-middle-bottom-item'
                  onClick={() => {
                    navigateTo({
                      url: item.path
                    })
                  }}
                >
                  <View
                    className='item-top'
                  >
                    <Image
                      mode='scaleToFill'
                      src={item.icon}
                      width={`${pxTransform(windowWidth * 0.05)}`}
                      height={`${pxTransform(windowWidth * 0.05)}`}
                    />
                    <Text
                      style={{
                        marginLeft: `${pxTransform(windowWidth * 0.02)}`,
                        fontSize: `${pxTransform(windowWidth * 0.04)}`,
                        color: '#333',
                        fontWeight: 'bold',
                      }}
                    >{item.title}</Text>
                  </View>
                  <View
                    className='item-bottom'
                    style={{
                      fontSize: `${pxTransform(windowWidth * 0.025)}`,
                      color: '#A2A6A9',
                    }}
                  >
                    <Text>{item.desc}</Text>
                  </View>
                </View>
              ))
            }
          </View>
        </View>
        <View
          className='mine-content-bottom mine-content-item'
          style={{
            padding: `${pxTransform(windowWidth * 0.03)} ${pxTransform(windowWidth * 0.03)}`,
            paddingBottom: `${pxTransform(windowWidth * 0.05)}`,
            width: `calc(100% - ${pxTransform(windowWidth * 0.06)})`,
            // height: `calc(25% - ${pxTransform(windowWidth * 0.06)})`,
          }}
        >
          <View
            className='mine-content-bottom-top'
            style={{
              marginBottom: `${pxTransform(windowWidth * 0.03)}`,
            }}
          >
            我的功能
          </View>
          <View
            className='mine-content-bottom-bottom'
          >
            {
              mineContentBottomBottomItemList.map((item, index) => (
                <View
                  className='mine-content-bottom-bottom-item'
                  onClick={() => {
                    if (item.path) {
                      navigateTo({
                        url: item.path
                      })
                    }
                  }}
                >
                  <View
                    className='item-top'
                  >
                    <Image
                      mode='scaleToFill'
                      src={item.icon}
                      width={`${pxTransform(windowWidth * 0.1)}`}
                      height={`${pxTransform(windowWidth * 0.1)}`}
                    />
                  </View>
                  <View
                    className='item-bottom'
                    style={{
                      marginTop: `${pxTransform(windowWidth * 0.02)}`,
                      fontSize: `${pxTransform(windowWidth * 0.03)}`,
                      color: '#363636',
                    }}
                  >
                    <Text>{item.title}</Text>
                  </View>
                </View>
              ))
            }
          </View>
        </View>
      </View>
      <LoginPopup
        visible={loginPopupVisible}
        onClose={() => setLoginPopupVisible(false)}
        viewHeight={windowHeight}
      />
    </View>
  )
} 