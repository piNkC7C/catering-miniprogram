import { memo } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { Popup, Button, Space, Checkbox, Toast } from '@nutui/nutui-react-taro'
import { useState } from 'react'
import { pxTransform } from '@nutui/nutui-react-taro'
import { userNologin } from '@/utils/constants'

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
  const [checkAgree, setCheckAgree] = useState<boolean>(false)
  const [showToast, setShowToast] = useState<boolean>(false)

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
              openType: 'getRealtimePhoneNumber|agreePrivacyAuthorization',
              onGetRealTimePhoneNumber: (realTimePhoneNumber) => {
                console.log(realTimePhoneNumber.detail)
              }
            } : {})}
            onClick={() => {
              if (!checkAgree) {
                setShowToast(true)
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
        visible={showToast}
        onClose={() => {
          setShowToast(false)
        }}
      />
    </Popup>
  )
}

export default memo(PureLoginPopup, (prevProps, nextProps) => {
  if (prevProps.visible !== nextProps.visible) {
    return false
  }
  return true
})
