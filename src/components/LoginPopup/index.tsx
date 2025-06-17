import { memo } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { login, showToast } from '@tarojs/taro'
import { Popup, Button, Space, Checkbox, Toast, Overlay, Loading } from '@nutui/nutui-react-taro'
import { useState } from 'react'
import { pxTransform } from '@nutui/nutui-react-taro'
import { userNologin } from '@/utils/constants'
import { loginByPhoneAPI } from '@/api/login'
import type { IResponseApi } from '@/api/type'
import { useAppDispatch } from '@/hooks/useAppStore'
import { setLoginStatus, userInfoAction } from '@/redux/modules/login'
import { on } from 'events'
import { IUserInfo } from '@/redux/types/login'

interface LoginPopupProps {
  visible: boolean
  onClose: () => void
  viewHeight: number
}

const PureLoginPopup: React.FC<LoginPopupProps> = ({
  visible,
  onClose,
  viewHeight
}) => {
  const dispatch = useAppDispatch()
  const [checkAgree, setCheckAgree] = useState<boolean>(false)
  const [agreeToastShow, setAgreeToastShow] = useState<boolean>(false)

  const setLoginInfo = (apiResponse: IResponseApi<IUserInfo>) => {
    if (apiResponse.success) {
      // console.log(apiResponse.data)
      setOverlayVisible(false)
      dispatch(userInfoAction({
        type: 'set',
        data: {
          openid: apiResponse.data.openid,
          userId: apiResponse.data.userId,
          userInfo: apiResponse.data.userInfo,
          nickname: apiResponse.data.userInfo.nickname,
          avatar: apiResponse.data.userInfo.avatar,
        }
      }))
      dispatch(setLoginStatus(1))
      onClose()
    } else {
      setOverlayVisible(false)
      showToast({
        title: '登录失败',
        icon: 'error',
        duration: 1000,
      })
    }
  }

  // loading
  const [overlayVisible, setOverlayVisible] = useState(false)

  const loginByPhone = (phoneCode: string) => {
    setOverlayVisible(true)
    login({
      success: (res) => {
        console.log('loginByPhone success', res)
        loginByPhoneAPI({
          phoneCode,
          loginCode: res.code,
          state: 'STATE'
        }, setLoginInfo)
      },
      fail: (err) => {
        console.log(err)
        showToast({
          title: '登录失败',
          icon: 'error',
          duration: 1000,
        })
      }
    }).catch(() => {
    })
  }

  return (
    <Popup
      closeable
      left={
        <View>
          <Image
            src={userNologin}
            mode="scaleToFill"
            style={{
              width: pxTransform(viewHeight * 0.05),
              height: pxTransform(viewHeight * 0.05),
              borderRadius: pxTransform(viewHeight * 0.025),
            }}
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
              fontSize: pxTransform(viewHeight * 0.025),
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
      visible={visible}
      position="bottom"
      onClose={onClose}
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
              height: pxTransform(viewHeight * 0.06),
              borderRadius: pxTransform(viewHeight * 0.05),
            }}
            {...(checkAgree ? {
              openType: 'getPhoneNumber|agreePrivacyAuthorization',
              onGetPhoneNumber: (PhoneNumber) => {
                console.log('onGetPhoneNumber', PhoneNumber.detail)

                if (PhoneNumber.detail.code) {
                  loginByPhone(PhoneNumber.detail.code)
                } else {
                  showToast({
                    title: '获取手机号失败',
                    icon: 'error',
                    duration: 1000,
                  })
                }
              }
            } : {})}
            onClick={() => {
              if (!checkAgree) {
                setAgreeToastShow(true)
                return
              }
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
              height: pxTransform(viewHeight * 0.06),
              borderRadius: pxTransform(viewHeight * 0.05),
            }}
            onClick={onClose}
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
              if (!val && agreeToastShow) {
                setAgreeToastShow(false)
              }
            }}
            style={{
              marginRight: pxTransform(viewHeight * 0.01),
            }}
          />
          <View
            style={{
              fontSize: pxTransform(viewHeight * 0.015),
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
      <Toast
        content='请同意用户协议'
        duration={2}
        icon='error'
        visible={agreeToastShow}
        onClose={() => {
          setAgreeToastShow(false)
        }}
      />
      <Overlay visible={overlayVisible}>
        <View className="wrapper" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}>
          <Loading direction="vertical">登录中</Loading>
        </View>
      </Overlay>
    </Popup>
  )
}

export default memo(PureLoginPopup, (prevProps, nextProps) => {
  if (prevProps.visible !== nextProps.visible) {
    return false
  }
  return true
})
