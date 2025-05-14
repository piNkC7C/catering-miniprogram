import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './mine.scss'
import { useAppSelector } from '@/hooks/useAppStore'

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

  return (
    <View className='mine-page'>
      <View className='page-title'>我的</View>
      <View className='page-content'>
        <Text>登录状态：{loginStatus}</Text>
        <Text>用户信息：{JSON.stringify(userInfo)}</Text>
      </View>
    </View>
  )
} 