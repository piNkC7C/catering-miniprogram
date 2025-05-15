import { View, Text, ScrollView } from '@tarojs/components'
import { useLoad, getSystemInfoSync, getMenuButtonBoundingClientRect } from '@tarojs/taro'
import './choose.scss'
import { useAppSelector } from '@/hooks/useAppStore'
import { pxTransform, Divider, Grid, Image, Badge, ConfigProvider, Price, InputNumber } from '@nutui/nutui-react-taro'
import { Check } from '@nutui/icons-react-taro'
import { useState } from 'react'
import { IGoodItem } from './type'

export default function Choose() {
  // 获取登录状态和用户信息
  const {
    login: {
      loginStatus,
      userInfo
    }
  } = useAppSelector((state) => state)
  // useLoad(() => {
  //   console.log('OrderList page loaded.')
  // })

  // 是否进行了滑动
  const [isScroll, setIsScroll] = useState<boolean>(false)

  // 选择的加一商品
  const [selectedAddOneGood, setSelectedAddOneGood] = useState<IGoodItem>({
    id: 1,
    title: '原切前胸牛肉',
    count: 1,
    image: 'https://img.yzcdn.cn/vant/ipad.png',
    price: 39
  })

  // 商品价格
  const [goodPrice, setGoodPrice] = useState<number>(39)
  // 商品数量
  const [goodCount, setGoodCount] = useState<number>(1)

  // 商品列表
  const gridItem = (item: any, listItem: any, index: number) => {
    return (
      <Grid.Item
        key={index}
        text={item.title !== '已包含' ? listItem.title :
          (
            // <View
            //   style={{
            //     display: 'flex',
            //     flexDirection: 'column',
            //   }}
            // >
            //   <View>{listItem.title}</View>
            //   <View
            //     className='body-content-item-count'
            //   >x{listItem.count}</View>
            // </View>
            <Text>{listItem.title}&nbsp;&nbsp;x{listItem.count}</Text>
          )
        }
        style={{
          position: 'relative',
          boxShadow: '0px 0px 7px 0px rgba(0,0,0,0.15)',
          borderRadius: pxTransform(viewHeight * 0.01),
          border: selectedAddOneGood.id === listItem.id ? '1px solid #D61518' : 'none',
        }}
        onClick={() => {
          setSelectedAddOneGood(listItem)
        }}
      >
        <Badge
          value={<Check color="#fff" />}
          size="large"
          style={{
            display: selectedAddOneGood.id === listItem.id ? 'block' : 'none',
            position: 'absolute',
            top: 8,
            right: 8,
          }}
        />
        <Image
          src={listItem.image}
        />
      </Grid.Item>
    )
  }

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

  return (
    <View
      className='choose-detail-page'
      style={{
        height: `${windowHeight}px`,
        width: `${windowWidth}px`,
      }}
    >
      <View
        className='header'
        style={{
          height: `${navHeight + 20}px`,
        }}
      >
      </View>
      <ScrollView
        scrollTop={(windowHeight * 0.5 - navHeight)}
        className='body'
        style={{
          top: 0,
          height: `${windowHeight}px`,
        }}
        onScroll={() => {
          setIsScroll(true)
        }}
        scrollY
      >
        <View
          style={{
            height: '50%',
            backgroundColor: 'transparent',
          }}
        ></View>
        <View
          className='body-header'
          style={{
            padding: `${pxTransform(viewHeight * 0.02)} ${pxTransform(windowWidth * 0.05)}`,
            borderRadius: `${pxTransform(20)} ${pxTransform(20)} 0 0`,
            height: pxTransform(viewHeight * 0.05),
          }}
        >
          <View
            className='body-header-title'
            style={{
              fontSize: pxTransform(viewHeight * 0.025),
            }}
          >
            加1送1（原切前胸牛肉）
          </View>
          <Divider />
        </View>
        <View
          className='body-content'
          style={{
            width: `calc(100% - ${pxTransform(windowWidth * 0.1)})`,
            padding: `0 ${pxTransform(windowWidth * 0.05)} ${pxTransform(viewHeight * 0.02)}`,
          }}
        >
          {
            [{
              title: '已包含',
              list: [
                {
                  title: '原切前胸牛肉',
                  count: '1',
                  image: 'https://img.yzcdn.cn/vant/ipad.png'
                }
              ]
            }, {
              title: '选择你加1，我送1商品',
              list: [
                {
                  id: 1,
                  title: '原切前胸牛肉',
                  count: 1,
                  image: 'https://img.yzcdn.cn/vant/ipad.png',
                  price: 39
                },
                {
                  id: 2,
                  title: '原切前胸牛肉',
                  count: '1',
                  image: 'https://img.yzcdn.cn/vant/ipad.png',
                  price: 39
                },
                {
                  id: 3,
                  title: '原切前胸牛肉',
                  count: '1',
                  image: 'https://img.yzcdn.cn/vant/ipad.png',
                  price: 39
                },
                {
                  id: 4,
                  title: '原切前胸牛肉',
                  count: '1',
                  image: 'https://img.yzcdn.cn/vant/ipad.png',
                  price: 39
                },
                {
                  id: 5,
                  title: '原切前胸牛肉',
                  count: '1',
                  image: 'https://img.yzcdn.cn/vant/ipad.png',
                  price: 39
                },
                {
                  id: 6,
                  title: '原切前胸牛肉',
                  count: '1',
                  image: 'https://img.yzcdn.cn/vant/ipad.png',
                  price: 39
                },
                {
                  id: 7,
                  title: '原切前胸牛肉',
                  count: '1',
                  image: 'https://img.yzcdn.cn/vant/ipad.png',
                  price: 39
                },
                {
                  id: 8,
                  title: '原切前胸牛肉',
                  count: '1',
                  image: 'https://img.yzcdn.cn/vant/ipad.png',
                  price: 39
                },
                {
                  id: 9,
                  title: '原切前胸牛肉',
                  count: '1',
                  image: 'https://img.yzcdn.cn/vant/ipad.png',
                  price: 39
                },
                {
                  id: 10,
                  title: '原切前胸牛肉',
                  count: '1',
                  image: 'https://img.yzcdn.cn/vant/ipad.png',
                  price: 39
                },
                {
                  id: 11,
                  title: '原切前胸牛肉',
                  count: '1',
                  image: 'https://img.yzcdn.cn/vant/ipad.png',
                  price: 39
                },
                {
                  id: 12,
                  title: '原切前胸牛肉',
                  count: '1',
                  image: 'https://img.yzcdn.cn/vant/ipad.png',
                  price: 39
                },
                {
                  id: 13,
                  title: '原切前胸牛肉',
                  count: '1',
                  image: 'https://img.yzcdn.cn/vant/ipad.png',
                  price: 39
                },
                {
                  id: 14,
                  title: '原切前胸牛肉',
                  count: '1',
                  image: 'https://img.yzcdn.cn/vant/ipad.png',
                  price: 39
                },
                {
                  id: 15,
                  title: '原切前胸牛肉',
                  count: '1',
                  image: 'https://img.yzcdn.cn/vant/ipad.png',
                  price: 39
                },
                {
                  id: 16,
                  title: '原切前胸牛肉',
                  count: '1',
                  image: 'https://img.yzcdn.cn/vant/ipad.png',
                  price: 39
                },
                {
                  id: 17,
                  title: '原切前胸牛肉',
                  count: '1',
                  image: 'https://img.yzcdn.cn/vant/ipad.png',
                  price: 39
                },
              ]
            }].map((item, index) => (
              <View className='body-content-item' key={index}>
                <View
                  className='body-content-item-title'
                  style={{
                    marginBottom: pxTransform(viewHeight * 0.02),
                  }}
                >
                  <Text>{item.title}</Text>
                </View>
                <Grid columns={3} gap={7}>
                  {item.list.map((listItem, index) => (
                    gridItem(item, listItem, index)
                  ))}
                </Grid>
                {
                  index === 0 ? <Divider /> : null
                }
              </View>
            ))
          }
        </View>
        <View
          style={{
            backgroundColor: '#fff',
            height: pxTransform(viewHeight * 0.16),
          }}
        ></View>
      </ScrollView>
      <View
        className='body-footer'
        style={{
          padding: `${pxTransform(viewHeight * 0.02)} ${pxTransform(windowWidth * 0.05)}`,
          width: `calc(100% - ${pxTransform(windowWidth * 0.1)})`,
          height: pxTransform(viewHeight * 0.1),
        }}
      >
        <View
          className='body-footer-top'
        >
          <ConfigProvider
            theme={{
              nutuiPricePrimaryColor: '#333',
            }}
          >
            <Price
              color='gray'
              price={goodPrice}
              size="large"
              thousands
            />
          </ConfigProvider>
          {/* 商品数量 */}
          <View
            className="custom-input-number"
            style={{
              width: pxTransform(windowWidth * 0.256),
              height: pxTransform(viewHeight * 0.036),
              borderRadius: pxTransform(viewHeight * 0.018),
            }}
          >
            <View
              className="custom-btn minus"
              style={{
                width: pxTransform(windowWidth * 0.0848),
                height: pxTransform(viewHeight * 0.036),
                fontSize: pxTransform(viewHeight * 0.024),
              }}
              onClick={() => setGoodCount(goodCount > 1 ? goodCount - 1 : 1)}
            >-</View>
            <View
              className="custom-value"
              style={{
                width: pxTransform(windowWidth * 0.0848),
                fontSize: pxTransform(viewHeight * 0.02),
              }}
            >{goodCount}</View>
            <View
              className="custom-btn plus"
              style={{
                width: pxTransform(windowWidth * 0.0848),
                height: pxTransform(viewHeight * 0.036),
                fontSize: pxTransform(viewHeight * 0.024),
              }}
              onClick={() => setGoodCount(goodCount + 1)}
            >+</View>
          </View>
        </View>
        <View
          className='body-footer-bottom'
        ></View>
      </View>
    </View>
  )
} 