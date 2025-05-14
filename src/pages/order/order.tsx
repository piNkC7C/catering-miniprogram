import { useRef, useState } from 'react'
import { View, Text } from '@tarojs/components'
import { useLoad, getSystemInfoSync, getMenuButtonBoundingClientRect } from '@tarojs/taro'
import './order.scss'
import { useAppSelector } from '@/hooks/useAppStore'
import { pxTransform, SearchBar, ConfigProvider, Sticky, Button, Badge, Price, SideBar, Elevator, Card } from '@nutui/nutui-react-taro'
import { Cart } from '@nutui/icons-react-taro'

export default function Order() {
  // 获取登录状态和用户信息
  const {
    login: {
      loginStatus,
      userInfo
    }
  } = useAppSelector((state) => state)
  // useLoad(() => {
  //   console.log('Order page loaded.')
  // })
  const orderPageRef = useRef(null)

  // 获取系统信息
  const systemInfo = getSystemInfoSync()
  // 获取胶囊按钮信息
  const menuButtonInfo = getMenuButtonBoundingClientRect()
  // console.log('menuButtonInfo',menuButtonInfo);
  // 状态栏高度
  const statusBarHeight = systemInfo.statusBarHeight || 0
  // 导航栏高度 = 胶囊按钮顶部位置 + (胶囊按钮高度 + 两边距离和)/2
  const navBarHeight = (menuButtonInfo.top - statusBarHeight) * 2 + menuButtonInfo.height
  // 总高度
  const navHeight = statusBarHeight + navBarHeight + 5
  // 获取可视区域高度
  const viewHeight = systemInfo.windowHeight - navHeight

  // 已添加购物车数量
  const [cartNum, setCartNum] = useState<number>(1)
  // 购物车总价
  const [cartPrice, setCartPrice] = useState<number>(618.68)
  // 侧边栏选中值
  const [sideBarValue, setSideBarValue] = useState<number | string>(1)

  const dataList = Array.from({ length: 100 }).map((_, index) => (
    {
      id: index + 1,
      title: `Opt ${index + 1}`,
      list: [
        {
          name: '安徽',
          id: 1,
          src: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
          title:
            '【活蟹】湖塘煙雨 阳澄湖大闸蟹公4.5两 母3.5两 4对8只 鲜活生鲜螃蟹现货水产礼盒海鲜水',
          price: '388',
          vipPrice: '378',
          shopDescription: '自营',
          delivery: '厂商配送',
          shopName: '阳澄湖大闸蟹自营店>',
        },
        {
          name: '安徽',
          id: 2,
          src: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
          title:
            '【活蟹】湖塘煙雨 阳澄湖大闸蟹公4.5两 母3.5两 4对8只 鲜活生鲜螃蟹现货水产礼盒海鲜水',
          price: '388',
          vipPrice: '378',
          shopDescription: '自营',
          delivery: '厂商配送',
          shopName: '阳澄湖大闸蟹自营店>',
        },
        {
          name: '安徽',
          id: 3,
          src: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
          title:
            '【活蟹】湖塘煙雨 阳澄湖大闸蟹公4.5两 母3.5两 4对8只 鲜活生鲜螃蟹现货水产礼盒海鲜水',
          price: '388',
          vipPrice: '378',
          shopDescription: '自营',
          delivery: '厂商配送',
          shopName: '阳澄湖大闸蟹自营店>',
        },
      ],
    }
  ))
  return (
    <>
      <View
        className='custom-nav'
        style={{
          position: 'relative',
          height: `${navHeight}px`,
        }}
      >
        <View
          className='search-bar-container'
          style={{
            position: 'absolute',
            top: `${menuButtonInfo.top}px`,
            left: pxTransform(8),
            height: `${menuButtonInfo.height}px`,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ConfigProvider
            theme={{
              nutuiSearchbarBackground: 'transparent',
              nutuiSearchbarContentBackground: '#f5f5f5',
              nutuiSearchbarInputTextAlign: 'left',
              nutuiSearchbarWidth: '100%',
              nutuiSearchbarHeight: `${menuButtonInfo.height - 6}px`,
              nutuiSearchbarPadding: '6px 0',
            }}
          >
            <SearchBar
              placeholder="搜索商品"
              shape="round"
            />
          </ConfigProvider>
        </View>
      </View>
      <View className='order-page'
        ref={orderPageRef}
        style={{
          height: `${viewHeight}px`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <View
          className='order-page-shopinfo'
          style={{
            width: '100%',
            height: pxTransform(systemInfo.windowWidth * 0.15),
            background: 'red',
          }}
        ></View>
        <View
          className='order-page-vipbox'
          style={{
            width: '100%',
            height: pxTransform(systemInfo.windowWidth * 0.1),
            background: 'blue',
          }}
        ></View>
        <View
          className='order-page-list'
          style={{
            flex: 1,
            width: '100%',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <SideBar
            style={{
              height: '100%',
            }}
            value={sideBarValue}
            onChange={(value) => {
              setSideBarValue(value)
            }}
          >
            {
              dataList.map((item) => (
                <SideBar.Item title={item.title} value={item.id}>
                </SideBar.Item>
              ))
            }
          </SideBar>
          <View
            style={{
              flex: 1,
              padding: `${pxTransform(viewHeight * 0.02)} ${pxTransform(systemInfo.windowWidth * 0.05)}`,
              height: `calc(100% - ${pxTransform(viewHeight * 0.04)})`,
              overflow: 'auto',
            }}
          >
            {
              dataList.map((item) => (
                <>
                  <View
                    style={{
                      width: '100%',
                      marginBottom: pxTransform(viewHeight * 0.02),
                    }}
                  >
                    <Text>{item.title}</Text>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      marginBottom: pxTransform(viewHeight * 0.02),
                    }}
                  >
                    {
                      item.list.map((listItem) => (
                        <Card
                          src={listItem.src}
                          title={listItem.title}
                          price={listItem.price}
                          vipPrice={listItem.vipPrice}
                          shopDescription={listItem.shopDescription}
                          delivery={listItem.delivery}
                          shopName={listItem.shopName}
                        />
                      ))
                    }
                  </View>
                </>
              ))
            }
          </View>
        </View>
        <View
          style={{
            width: '100%',
            height: pxTransform(systemInfo.windowWidth * 0.1),
            background: '#fff',
          }}
        ></View>
        <View
          className='order-cart'
          style={{
            position: 'fixed',
            bottom: 0,
            margin: pxTransform(systemInfo.windowWidth * 0.05) + ' ' + pxTransform(systemInfo.windowWidth * 0.05),
            width: `calc(${systemInfo.windowWidth}px - ${systemInfo.windowWidth * 0.1}px)`,
            height: pxTransform(systemInfo.windowWidth * 0.15),
            background: '#323232',
            zIndex: 100,
            borderRadius: pxTransform(30),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View className='order-cart-left'
            style={{
              width: '30%',
              height: '100%',
              color: '#fff',
              background: '#D61518',
              fontSize: pxTransform(viewHeight * 0.018),
              borderRadius: `${pxTransform(30)} ${pxTransform(0)} ${pxTransform(0)} ${pxTransform(30)}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {
              loginStatus === 0 ? (
                '登录后查询'
              ) : (
                '查询订单'
              )
            }
          </View>
          <View className='order-cart-right'
            style={{
              width: '70%',
              height: '100%',
              color: '#fff',
              paddingLeft: pxTransform(systemInfo.windowWidth * 0.05),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{
                width: '70%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <View
                className='order-cart-right-icon'
                style={{
                  marginRight: pxTransform(systemInfo.windowWidth * 0.02),
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}
              >
                <Badge value={cartNum}>
                  <Cart
                    size={pxTransform(systemInfo.windowWidth * 0.1)}
                  />
                </Badge>
              </View>
              <View
                className='order-cart-right-price'
                style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  fontWeight: 'bold',
                }}
              >
                <Price
                  price={cartPrice}
                  size="xlarge"
                  thousands
                />
              </View>
            </View>
            <View
              className='order-cart-right-price'
              style={{
                height: '100%',
                width: '30%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: `${pxTransform(0)} ${pxTransform(30)} ${pxTransform(30)} ${pxTransform(0)}`,
                background: cartNum > 0 ? '#D61518' : '',
                color: cartNum > 0 ? '#fff' : '#999',
              }}
            >
              <Text>去下单</Text>
            </View>
          </View>
        </View>
      </View >
    </>
  )
} 