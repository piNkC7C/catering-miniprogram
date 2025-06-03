import { useState, useEffect } from 'react'
import { View, Text, Span } from '@tarojs/components'
import { useLoad, getSystemInfoSync, navigateTo, switchTab } from '@tarojs/taro'
import './index.scss'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { setLoginStatus, userInfoAction } from '@/redux/modules/login'
import { Cell, Avatar, pxTransform, Button, Divider, Image, Grid, Popup, Checkbox, Space, Toast, Tag } from '@nutui/nutui-react-taro'
import { ArrowRight, Close } from '@nutui/icons-react-taro'
// 路由
import { routes } from '@/utils/constants'
import { userNologin, iconOrder, iconJifen, vipFrame, bgIndex } from '@/utils/constants'
import LoginPopup from '@/components/LoginPopup'

export default function Index() {
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
  const dispatch = useAppDispatch()

  // 底部弹层
  const [showBottomPopup, setShowBottomPopup] = useState<boolean>(false)

  // 登录状态为0时，初始化显示底部弹层
  // useEffect(() => {
  //   if (loginStatus === 0) {
  //     setShowBottomPopup(true)
  //   }
  // }, [])

  // 视图高度

  const { windowHeight: viewHeight, windowWidth } = getSystemInfoSync()

  useEffect(() => {
    console.log(getSystemInfoSync())
  }, [viewHeight])

  // useLoad(() => {
  //   console.log('Page loaded.')
  // })

  return (
    <View
      className='index'
      style={{
        fontSize: pxTransform(16),
        backgroundImage: `url(${bgIndex})`,
      }}
    >
      <View className='index-content'>
        <Cell
          className='user-info-cell'
        >
          <View className='user-info-cell-avatar'>
            <Image
              src={userInfo?.avatar || userNologin}
              mode="scaleToFill"
              width={pxTransform(viewHeight * 0.06)}
              height={pxTransform(viewHeight * 0.06)}
              radius={pxTransform(viewHeight * 0.03)}
            />
          </View>
          <View className='user-info'>
            <View
              className='user-title'
              style={{
                fontSize: pxTransform(viewHeight * 0.023),
              }}
            >
              {loginStatus === 0 ? 'HI,xxx火锅用户' : `HI,${userInfo?.nickname}`}
            </View>
            <View
              className='user-description'
              style={{
                fontSize: pxTransform(viewHeight * 0.013),
              }}
            >
              {loginStatus === 0 ? '为给您提供更好的服务请先授权登录' : (
                <Button
                  type="primary"
                  size="small"
                  style={{
                    marginTop: pxTransform(viewHeight * 0.005),
                    height: pxTransform(viewHeight * 0.02),
                    fontSize: pxTransform(viewHeight * 0.015),
                    borderRadius: pxTransform(viewHeight * 0.05),
                  }}
                  rightIcon={<ArrowRight />}
                  onClick={() => {
                    navigateTo({
                      url: routes.find((route) => route.name === 'vip')?.path || '',
                    })
                  }}
                >
                  查看我的会员权益
                </Button>
              )}
            </View>
          </View>
          <View className='user-info-cell-button'>
            {
              loginStatus === 0 ? (
                <Button
                  type="primary"
                  style={{
                    borderRadius: pxTransform(viewHeight * 0.05),
                  }}
                  // 实时验证手机号组件
                  // openType='getRealtimePhoneNumber|agreePrivacyAuthorization'
                  // onGetRealTimePhoneNumber={(realTimePhoneNumber) => {
                  //   console.log(realTimePhoneNumber.detail);
                  // }}
                  // 快速验证手机号组件
                  // openType='getPhoneNumber|agreePrivacyAuthorization'
                  // onGetPhoneNumber={(phoneNumber) => {
                  //   console.log(phoneNumber.detail);
                  // }}
                  onClick={() => {
                    setShowBottomPopup(true)
                    // dispatch(setLoginStatus(1))
                    // dispatch(userInfoAction({
                    //   type: 'set',
                    //   data: {
                    //     nickname: '杨柳依依',
                    //     avatar: "https://img12.360buyimg.com/imagetools/jfs/t1/143702/31/16654/116794/5fc6f541Edebf8a57/4138097748889987.png",
                    //   }
                    // }))
                  }}
                >
                  登录/注册
                </Button>
              ) : (
                <View style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                  <Image
                    src={vipFrame}
                    mode="scaleToFill"
                    width={pxTransform(viewHeight * 0.05)}
                    height={pxTransform(viewHeight * 0.05)}
                  />
                  <Text>会员码</Text>
                </View>
              )
            }
          </View>
        </Cell>
        <View
          className='action-card'
          style={{
            height: viewHeight <= 600 ? '35%' : '40%',
            borderRadius: pxTransform(10),
          }}
        >
          <View
            className='action-card-item'
            onClick={() => {
              switchTab({
                url: '/pages/order/order',
              })
            }}
          >
            <View className='action-card-item-icon'>
              <Image
                src={iconOrder}
                mode="scaleToFill"
                width={pxTransform(viewHeight * 0.1)}
                height={pxTransform(viewHeight * 0.1)}
              />
            </View>
            <View
              className='action-card-item-title'
              style={{
                fontSize: pxTransform(viewHeight * 0.025),
              }}
            >
              扫码点餐
            </View>
            <View
              className='action-card-item-description'
              style={{
                fontSize: pxTransform(viewHeight * 0.015),
              }}
            >
              提前下免排队
            </View>
          </View>
          <Divider
            direction="vertical"
            style={{
              height: '60%',
              borderColor: '#BDBCBB',
            }}
          />
          <View
            className='action-card-item'
            onClick={() => {
              navigateTo({
                url: routes.find((route) => route.name === 'points')?.path || '',
              })
            }}
          >
            <View className='action-card-item-icon'>
              <Image
                src={iconJifen}
                mode="scaleToFill"
                width={pxTransform(viewHeight * 0.1)}
                height={pxTransform(viewHeight * 0.1)}
              />
            </View>
            <View
              className='action-card-item-title'
              style={{
                fontSize: pxTransform(viewHeight * 0.025),
              }}
            >
              积分兑换
            </View>
            <View
              className='action-card-item-description'
              style={{
                fontSize: pxTransform(viewHeight * 0.015),
              }}
            >
              超多福利等你换
            </View>
          </View>
        </View>
        <View
          className='index-zixun'
          style={{
            marginTop: pxTransform(10),
            height: '35%',
            borderRadius: pxTransform(10),
            overflow: 'hidden',
            padding: 0
          }}
        >
          <View
            style={{
              padding: `0 ${pxTransform(viewHeight * 0.02)}`,
              width: `calc(100% - ${pxTransform(viewHeight * 0.04)})`,
              height: '25%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{
                fontSize: pxTransform(viewHeight * 0.02),
              }}
            >
              查看最新品牌资讯
            </View>
            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: pxTransform(viewHeight * 0.015),
                color: '#605F5E'
              }}
            >
              获取更多不定期福利
              <ArrowRight
                size={pxTransform(viewHeight * 0.02)}
                style={{
                  marginLeft: pxTransform(3),
                }}
              />
            </View>

          </View>
          <View
            style={{
              width: '100%',
              height: '75%',
              backgroundImage: 'url(https://storage.360buyimg.com/imgtools/e067cd5b69-07c864c0-dd02-11ed-8b2c-d7f58b17086a.png)',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            }}
          >
          </View>
        </View>
      </View>
      <LoginPopup
        visible={showBottomPopup}
        onClose={() => setShowBottomPopup(false)}
        viewHeight={viewHeight}
      />
    </View>
  )
}
