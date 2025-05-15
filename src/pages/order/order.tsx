import { useRef, useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import type { IntersectionObserver } from '@tarojs/taro'
import { useLoad, useReady, useUnload, getSystemInfoSync, getMenuButtonBoundingClientRect, createIntersectionObserver, nextTick, createSelectorQuery } from '@tarojs/taro'
import './order.scss'
import { useAppSelector } from '@/hooks/useAppStore'
import { pxTransform, SearchBar, ConfigProvider, Sticky, Button, Badge, Price, Elevator, Card, Image, SideBar, Cell, Tag } from '@nutui/nutui-react-taro'
import { Cart, Star, StarFill, ArrowDown } from '@nutui/icons-react-taro'
import { useThrottleFn } from 'ahooks'
import orderJoinVip from '@/assets/order/order-joinvip.png'

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

  // 门店信息
  const [shopIsFavor, setShopIsFavor] = useState<boolean>(false)

  // 创建一个手动滚动事件来检测元素可见性
  // const [visibleItems, setVisibleItems] = useState<string[]>([]);

  const { run: handleScroll } = useThrottleFn(
    () => {
      nextTick(() => {
        createSelectorQuery()
          .selectAll('.scrollTarget')
          .boundingClientRect()
          .exec(res => {
            // console.log('res', res);
            if (res[0] && res[0].length > 0) {
              const visible = res[0]
                .filter(item => item.top <= 300)
                .map(item => item.id);

              if (visible.length > 0) {
                // console.log('可见元素:', visible);
                setSideBarValue(visible[visible.length - 1]);
                // setVisibleItems(visible);
              }
            }
          });
      });
    },
    { wait: 100 }
  );

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
  const [sideBarValue, setSideBarValue] = useState<number | string>('anchor-1')

  const dataList = Array.from({ length: 15 }).map((_, index) => (
    {
      id: `anchor-${index + 1}`,
      title: `Opt ${index + 1}`,
      list: [
        {
          name: '安徽',
          id: 1,
          src: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
          title:
            '现货水产礼盒海鲜水',
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
            '现货水产礼盒海鲜水',
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
            '现货水产礼盒海鲜水',
          price: '388',
          vipPrice: '378',
          shopDescription: '自营',
          delivery: '厂商配送',
          shopName: '阳澄湖大闸蟹自营店>',
        },
      ],
    }
  )).concat([
    {
      id: 'anchor-11',
      title: '',
      list: [
      ],
    },
  ])

  // 滚动触发导航栏激活

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
        style={{
          height: `${viewHeight}px`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <View
          className='order-page-shopinfo'
          style={{
            padding: `0 ${pxTransform(8)}`,
            width: `calc(100% - ${pxTransform(16)})`,
            height: pxTransform(systemInfo.windowWidth * 0.15),
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <View
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              height: pxTransform(viewHeight * 0.02),
            }}
          >
            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
              }}
            >
              {shopIsFavor ? <StarFill color='#D61518' size={16} /> : <Star size={16} />}
              <View
                style={{
                  marginLeft: pxTransform(5),
                  fontSize: pxTransform(viewHeight * 0.025),
                  fontWeight: 'bold',
                }}
              >浙江某某某店</View>
            </View>
            <Button
              type="default"
              size="normal"
              color='#F2F2F2'
              style={{
                fontSize: pxTransform(viewHeight * 0.02),
                borderRadius: pxTransform(20),
                color: '#333',
              }}
            >
              <Text
                style={{
                  fontWeight: 'bold',
                }}
              >1</Text>桌&nbsp;&nbsp;<Text
                style={{
                  fontWeight: 'bold',
                }}
              >4</Text>人就餐
            </Button>
          </View>
          <View
            style={{
              padding: `0 ${pxTransform(systemInfo.windowWidth * 0.02)}`,
              height: '40%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#999',
              fontSize: pxTransform(viewHeight * 0.018),
            }}
          >
            <Text>门店信息</Text>
            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
              }}
            >
              <Text>点此查看</Text>
              <ArrowDown size={viewHeight * 0.02} />
            </View>
          </View>
        </View>
        <View
          className='order-page-vipbox'
          style={{
            marginBottom: pxTransform(viewHeight * 0.02),
            width: '100%',
            height: pxTransform(systemInfo.windowWidth * 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            mode='widthFix'
            src={orderJoinVip}
            width={systemInfo.windowWidth * 0.93}
          />
        </View>
        <View
          className='order-page-list'
          style={{
            flex: 1,
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            overflow: 'hidden',
          }}
        >
          <SideBar
              style={{
                height: '100%',
              }}
              value={sideBarValue}
              onChange={(key) => {
                setSideBarValue(key)
              }}
            >
              {
                dataList.map((item) => (
                  <SideBar.Item title={item.title} value={item.id}>
                  </SideBar.Item>
                ))
              }
            </SideBar>
          <ScrollView
            id='parentScroll'
            scrollY
            scrollIntoView={`${sideBarValue}`}
            onScroll={handleScroll}
            style={{
              flex: 1,
              padding: `${pxTransform(viewHeight * 0.02)} ${pxTransform(systemInfo.windowWidth * 0.05)}`,
              height: `calc(100% - ${pxTransform(viewHeight * 0.04)})`,
              backgroundColor: '#fff',
              overflow: 'scroll',
            }}
          >
            {
              dataList.map((item, index) => (
                <>
                  <View
                    id={item.id}
                    className='scrollTarget'
                    style={{
                      // position: sideBarValue === item.id ? 'sticky' : 'relative',
                      // top: sideBarValue === item.id ? 0 : 'auto',
                      zIndex: 10,
                      width: '100%',
                      marginBottom: pxTransform(viewHeight * 0.02),
                      backgroundColor: '#fff',
                      color:'#6A6A6A',
                      fontSize: pxTransform(viewHeight * 0.018),
                      // 高亮显示可见元素
                      // backgroundColor: visibleItems.includes(item.id) ? 'rgba(255,215,0,0.2)' : 'transparent',
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
                        <View
                          style={{
                            width: '100%',
                            height: pxTransform(systemInfo.windowWidth * 0.2),
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: pxTransform(viewHeight * 0.02),
                          }}
                        >
                          <Image
                            src={listItem.src}
                            width={pxTransform(systemInfo.windowWidth * 0.2)}
                            height={pxTransform(systemInfo.windowWidth * 0.2)}
                          />
                          <View
                            style={{
                              height: '100%',
                              flex: 1,
                              marginLeft: pxTransform(systemInfo.windowWidth * 0.02),
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Text>{listItem.title}</Text>
                            <View
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}
                            >
                              <View
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  alignItems: 'flex-end',
                                }}
                              >
                                <ConfigProvider
                                  theme={{
                                    nutuiPricePrimaryColor: '#333',
                                  }}
                                >
                                  <Price
                                    color='gray'
                                    price={listItem.price}
                                    size="large"
                                    thousands
                                  />
                                </ConfigProvider>
                                <Text
                                  style={{
                                    marginLeft: pxTransform(systemInfo.windowWidth * 0.01),
                                    fontSize: pxTransform(viewHeight * 0.012),
                                    color: '#999',
                                  }}
                                >
                                  起
                                </Text>
                              </View>
                              <Button
                                type="primary"
                                size="small"
                                style={{
                                  borderRadius: pxTransform(20),
                                }}
                              >
                                选规格
                              </Button>
                            </View>
                          </View>
                        </View>
                      ))
                    }
                  </View>
                  {
                    index === dataList.length - 1 && (
                      <View
                        style={{
                          width: '100%',
                          height: pxTransform(viewHeight * 0.1),
                        }}
                      ></View>
                    )
                  }
                </>
              ))
            }
          </ScrollView>
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
                <ConfigProvider
                  theme={{
                    nutuiPriceColor: '#fff',
                  }}
                >
                  <Price
                    color='gray'
                    price={cartPrice}
                    size="xlarge"
                    thousands
                  />
                </ConfigProvider>
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