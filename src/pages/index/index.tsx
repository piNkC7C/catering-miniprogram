import { useState, useEffect } from 'react'
import { View, Text, Span } from '@tarojs/components'
import { useLoad, getSystemInfoSync } from '@tarojs/taro'
import './index.scss'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { setLoginStatus, userInfoAction } from '@/redux/modules/login'
import { Cell, Avatar, pxTransform, Button, Divider, Image, Grid, Popup, Checkbox, Space, Toast } from '@nutui/nutui-react-taro'
import { ArrowRight, Close } from '@nutui/icons-react-taro'
import userNologin from '@/assets/index/user-nologin.png'
import iconOrder from '@/assets/index/icon-order.png'
import iconJifen from '@/assets/index/icon-jifen.png'
import vipFrame from '@/assets/index/Frame.png'
export default function Index() {
  // 获取登录状态和用户信息
  const {
    login: {
      loginStatus,
      userInfo
    }
  } = useAppSelector((state) => state)
  const dispatch = useAppDispatch()

  // 底部弹层
  const [showBottomPopup, setShowBottomPopup] = useState<boolean>(false)
  const [checkAgree, setCheckAgree] = useState<boolean>(false)

  // 登录状态为0时，初始化显示底部弹层
  useEffect(() => {
    if (loginStatus === 0) {
      setShowBottomPopup(true)
    }
  }, [])

  // 提示框
  const [toastState, setToastState] = useState<{
    icon: string | React.ReactNode
    content?: string
    duration?: number
    title?: string
  }>({
    icon: null,
    content: 'toast',
    duration: 2,
    title: '',
  })
  const [showToast, setShowToast] = useState<boolean>(false)

  // 视图高度
  const [viewHeight, setViewHeight] = useState<number>(0)

  useEffect(() => {
    const systemInfo = getSystemInfoSync()
    setViewHeight(systemInfo.windowHeight)
  }, [])

  // useLoad(() => {
  //   console.log('Page loaded.')
  // })

  return (
    <View
      className='index'
      style={{
        fontSize: pxTransform(16),
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
              width={pxTransform(viewHeight * 0.1)}
              height={pxTransform(viewHeight * 0.1)}
              radius={pxTransform(viewHeight * 0.05)}
            />
          </View>
          <View className='user-info'>
            <View
              className='user-title'
              style={{
                fontSize: pxTransform(viewHeight * 0.03),
              }}
            >
              {loginStatus === 0 ? 'HI,xxx火锅用户' : `HI,${userInfo?.nickname}`}
            </View>
            <View
              className='user-description'
              style={{
                fontSize: pxTransform(viewHeight * 0.015),
              }}
            >
              {loginStatus === 0 ? '为给您提供更好的服务请先授权登录' : '欢迎使用'}
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
          <View className='action-card-item'>
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
                fontSize: pxTransform(viewHeight * 0.03),
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
          <View className='action-card-item'>
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
                fontSize: pxTransform(viewHeight * 0.03),
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
      <Popup
        closeable
        left={
          <View>
            <Image
              src={userNologin}
              mode="scaleToFill"
              width={pxTransform(viewHeight * 0.05)}
              height={pxTransform(viewHeight * 0.05)}
              radius={pxTransform(viewHeight * 0.025)}
            />
          </View>
        }
        title={
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                color: '#333333',
                fontSize: pxTransform(viewHeight * 0.03),
              }}
            >
              欢迎加入xxxx火锅
            </View>
            <View
              style={{
                marginTop: pxTransform(viewHeight * 0.01),
                color: '#676767',
                fontSize: pxTransform(viewHeight * 0.015),
              }}
            >
              加入后享专属活动&会员好礼
            </View>
          </View>
        }
        visible={showBottomPopup}
        position="bottom"
        onClose={() => {
          setShowBottomPopup(false)
        }}
        lockScroll
      >
        <View
          style={{
            padding: `0 ${pxTransform(viewHeight * 0.02)}`,
            marginBottom: pxTransform(viewHeight * 0.025),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: 'calc(100% - ${pxTransform(viewHeight * 0.04)})',
          }}
        >
          <Space
            direction='vertical'
            align='center'
            style={{
              width: '100%'
            }}
          >
            <Button
              size='large'
              type="primary"
              style={{
                width: pxTransform(viewHeight * 0.4),
                borderRadius: pxTransform(viewHeight * 0.05),
              }}
              {...(checkAgree ? {
                openType: 'getRealtimePhoneNumber|agreePrivacyAuthorization',
                onGetRealTimePhoneNumber: (realTimePhoneNumber) => {
                  console.log(realTimePhoneNumber.detail);
                  // 获取到手机号后处理登录逻辑
                  // dispatch(setLoginStatus(1))
                  // dispatch(userInfoAction({
                  //   type: 'set',
                  //   data: {
                  //     nickname: '杨柳依依',
                  //     avatar: "https://img12.360buyimg.com/imagetools/jfs/t1/143702/31/16654/116794/5fc6f541Edebf8a57/4138097748889987.png",
                  //   }
                  // }))
                }
              } : {})}
              onClick={() => {
                if (!checkAgree) {
                  setShowToast(true)
                  setToastState({
                    icon: 'error',
                    content: '请先同意用户协议',
                  })
                  return
                }
                // 用户已同意协议，但还需要点击获取手机号的微信弹窗
                // 当用户同意授权后会触发onGetRealTimePhoneNumber回调
              }}
            >
              手机号快捷登录
            </Button>
            <Button
              size='large'
              type="primary"
              fill='outline'
              style={{
                width: pxTransform(viewHeight * 0.4),
                borderRadius: pxTransform(viewHeight * 0.05),
              }}
              onClick={() => {
                setShowBottomPopup(false)
              }}
            >
              暂时跳过
            </Button>
          </Space>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Checkbox
              checked={checkAgree}
              onChange={(val) => {
                setCheckAgree(val)
                // 如果用户取消勾选，则关闭Toast提示
                if (!val && showToast) {
                  setShowToast(false)
                }
              }}
              style={{
                marginRight: pxTransform(viewHeight * 0.01),
              }}
            />
            <View
              style={{
                fontSize: pxTransform(viewHeight * 0.02),
              }}
            >
              <Text>允许我们在必要场景下，合理使用您的个人信息，且阅读并同意</Text>
              <Text
                style={{
                  color: '#1890ff',
                }}
              >
                《xxxx火锅用户协议》
              </Text>
            </View>
          </View>
        </View>
      </Popup>
      <Toast
        content={toastState.content}
        duration={toastState.duration}
        icon={toastState.icon}
        title={toastState.title}
        visible={showToast}
        onClose={() => {
          setShowToast(false)
        }}
      />
    </View>
  )
}
