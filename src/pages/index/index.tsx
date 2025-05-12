import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'

export default function Index() {
  const dispatch = useAppDispatch()
  const exampleData = useAppSelector((state) => state.example.data)

  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='index'>
      <Text>{exampleData.message}</Text>
    </View>
  )
}
