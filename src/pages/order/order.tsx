import { useRef, useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import type { IntersectionObserver } from '@tarojs/taro'
import { useLoad, useReady, useUnload, getSystemInfoSync, getMenuButtonBoundingClientRect, createIntersectionObserver, nextTick, createSelectorQuery, navigateTo, useRouter, setStorage, getStorage, scanCode } from '@tarojs/taro'
import './order.scss'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { setCartListAction } from '@/redux/modules/order'
import { pxTransform, SearchBar, ConfigProvider, Sticky, Button, Badge, Price, Elevator, Card, Image, SideBar, Cell, Tag, Popup, Checkbox, Collapse, Divider, Dialog } from '@nutui/nutui-react-taro'
import { Cart, Star, StarFill, ArrowDown, Add, Minus, Del } from '@nutui/icons-react-taro'
import { useThrottleFn } from 'ahooks'
import orderJoinVip from '@/assets/order/order-joinvip@2x.png'
import LoginPopup from '@/components/LoginPopup'

export default function Order() {
  // 获取登录状态和用户信息
  const {
    login: {
      loginStatus,
      userInfo
    },
    order: {
      cartList,
    }
  } = useAppSelector((state) => state)
  const dispatch = useAppDispatch()

  const [tableInfo, setTableInfo] = useState<any>({
    tableId: null,
    peopleNum: null,
  })

  const router = useRouter()
  const { tableId, peopleNum } = router.params
  useEffect(() => {
    if (tableId && peopleNum) {
      setTableInfo({ tableId, peopleNum })
      setStorage(
        {
          key: 'tableInfo',
          data: { tableId, peopleNum },
          fail: (err) => {
            console.log('点单页设置桌号失败', err)
          }
        },
      )
    } else {
      getStorage(
        {
          key: 'tableInfo',
          fail: (err) => {
            console.log('点单页获取桌号失败', err)
          },
          success: (res) => {
            setTableInfo(res.data)
          },
        },
      )
    }
  }, [tableId, peopleNum])
  // useLoad(() => {
  //   console.log('Order page loaded.')
  // })

  // 门店信息
  const [shopIsFavor, setShopIsFavor] = useState<boolean>(false)

  // 登录组件
  const [loginPopupVisible, setLoginPopupVisible] = useState<boolean>(false)

  // 购物车弹窗
  const [showCartPopup, setShowCartPopup] = useState<boolean>(false)
  // 购物车全选
  const [cartCheckboxGroupValue, setCartCheckboxGroupValue] = useState<any[]>([])

  // 商品券弹窗
  const [showGoodsCouponPopup, setShowGoodsCouponPopup] = useState<boolean>(false)
  // 使用说明弹窗
  const [showGoodsCouponDescriptionDialog, setShowGoodsCouponDescriptionDialog] = useState<boolean>(false)
  const [goodsCouponDescriptionDialogItem, setGoodsCouponDescriptionDialogItem] = useState<string>('')

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

  // 侧边栏选中值
  const [sideBarValue, setSideBarValue] = useState<number | string>('good-coupon')

  // 购物车左侧显示
  const [cartLeftWidth, setCartLeftWidth] = useState<string>('30%')
  const [cartLeftBackground, setCartLeftBackground] = useState<string>('#D61518')
  // 购物车右侧宽度
  // const [cartRightWidth, setCartRightWidth] = useState<string>(`calc(70% - ${pxTransform(windowWidth * 0.18)})`)

  const dataList = [
    {
      id: 'zhuanqu',
      title: '专区',
      list: [
        {
          id: 1,
          title: '肥牛',
          price: 29,
          image: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
          detail: true,
        },
        {
          id: 2,
          title: '肥牛',
          price: 29,
          image: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
          detail: false,
        },
        {
          id: 3,
          title: '肥牛',
          price: 29,
          image: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
          detail: false,
        },
      ],
    }
  ]

  const goodsCouponList = [
    {
      id: 1,
      title: '当家肥牛卷一份',
      image: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
      startTime: '2025-05-20',
      endTime: '2025-05-21',
      type: 0,
      description: '每件商品限用一张',
    },
    {
      id: 1,
      title: '当家肥牛卷一份',
      image: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
      startTime: '2025-05-20',
      endTime: '2025-05-21',
      type: 1,
      description: '每件商品限用一张',
    }
  ]

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
            top: `${topMenuButton}px`,
            left: pxTransform(8),
            height: `${heightMenuButton}px`,
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
              nutuiSearchbarHeight: `${heightMenuButton - 6}px`,
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
            height: pxTransform(windowWidth * 0.15),
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
              size="mini"
              color='#F2F2F2'
              style={{
                fontSize: pxTransform(viewHeight * 0.02),
                borderRadius: pxTransform(20),
                color: '#333',
              }}
            >
              {
                tableInfo.tableId && tableInfo.peopleNum ? (
                  <>
                    <Text
                      style={{
                        fontWeight: 'bold',
                      }}
                    >{tableInfo.tableId}</Text>号桌&nbsp;&nbsp;<Text
                      style={{
                        fontWeight: 'bold',
                      }}
                    >{tableInfo.peopleNum}</Text>人就餐
                  </>
                ) : '未选桌号'
              }
            </Button>
          </View>
          <View
            style={{
              padding: `0 ${pxTransform(windowWidth * 0.02)}`,
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
            height: pxTransform(windowWidth * 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            mode='widthFix'
            src={orderJoinVip}
            width={windowWidth * 0.93}
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
            <SideBar.Item title='尊享商品券' value='good-coupon'>
            </SideBar.Item>
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
              padding: `${pxTransform(viewHeight * 0.02)} ${pxTransform(windowWidth * 0.05)}`,
              height: `calc(100% - ${pxTransform(viewHeight * 0.04)})`,
              backgroundColor: '#fff',
              overflow: 'scroll',
            }}
          >
            <View
              id='good-coupon'
              className='scrollTarget'
              style={{
                // position: sideBarValue === item.id ? 'sticky' : 'relative',
                // top: sideBarValue === item.id ? 0 : 'auto',
                zIndex: 10,
                width: '100%',
                marginBottom: pxTransform(viewHeight * 0.02),
                backgroundColor: '#fff',
                color: '#6A6A6A',
                fontSize: pxTransform(viewHeight * 0.018),
                // 高亮显示可见元素
                // backgroundColor: visibleItems.includes(item.id) ? 'rgba(255,215,0,0.2)' : 'transparent',
              }}
            >
              <Text>尊享商品券(每件商品限用一张)</Text>
            </View>
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
                      color: '#6A6A6A',
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
                            height: pxTransform(windowWidth * 0.2),
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: pxTransform(viewHeight * 0.02),
                          }}
                        >
                          <Image
                            src={listItem.image}
                            width={pxTransform(windowWidth * 0.2)}
                            height={pxTransform(windowWidth * 0.2)}
                          />
                          <View
                            style={{
                              height: '100%',
                              flex: 1,
                              marginLeft: pxTransform(windowWidth * 0.02),
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              fontSize: pxTransform(viewHeight * 0.018),
                              fontWeight: 'bold',
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
                                    nutuiPriceSymbolLargeSize: pxTransform(viewHeight * 0.02),
                                  }}
                                >
                                  <Price
                                    color='gray'
                                    price={listItem.price}
                                    size="small"
                                    thousands
                                    style={{
                                      fontWeight: 'bold',
                                    }}
                                  />
                                </ConfigProvider>
                                <Text
                                  style={{
                                    marginLeft: pxTransform(windowWidth * 0.01),
                                    fontSize: pxTransform(viewHeight * 0.012),
                                    color: '#999',
                                  }}
                                >
                                  起
                                </Text>
                              </View>
                              {
                                listItem.detail ? (
                                  <Badge
                                    style={{
                                      marginRight: pxTransform(windowWidth * 0.02),
                                    }}
                                    value={cartList.find((findItem) => {
                                      return findItem.id === listItem.id
                                    })?.count}>
                                    <Button
                                      type="primary"
                                      size="mini"
                                      style={{
                                        // width: pxTransform(windowWidth * 0.13),
                                        // height: pxTransform(viewHeight * 0.035),
                                        borderRadius: pxTransform(viewHeight * 0.05),
                                        // fontSize: pxTransform(viewHeight * 0.03),
                                      }}
                                      onClick={() => {
                                        navigateTo({
                                          url: '/pages/choose/choose',
                                        })
                                      }}
                                    >选规格</Button>
                                  </Badge>
                                ) : (
                                  <View
                                    style={{
                                      marginRight: pxTransform(windowWidth * 0.02),
                                      display: 'flex',
                                      flexDirection: 'row',
                                      alignItems: 'flex-end',
                                      justifyContent: 'space-between',
                                    }}
                                  >
                                    {
                                      cartList.find((findItem) => {
                                        return findItem.id === listItem.id
                                      }) && (
                                        <View
                                          style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                          }}
                                        >
                                          <Button
                                            type="primary"
                                            size="small"
                                            fill='outline'
                                            style={{
                                              width: pxTransform(windowWidth * 0.05),
                                              height: pxTransform(windowWidth * 0.05),
                                              borderRadius: pxTransform(windowWidth * 0.05),
                                            }}
                                            icon={<Minus color='#D61518' size={windowWidth * 0.036} />}
                                            onClick={() => {
                                              if (cartList.find((findItem) => {
                                                return findItem.id === listItem.id
                                              })?.count === 1) {
                                                dispatch(setCartListAction({
                                                  type: 'remove', data: {
                                                    id: listItem.id,
                                                  }
                                                }))
                                              } else {
                                                dispatch(setCartListAction({
                                                  type: 'set', data: [
                                                    ...cartList.map((mapItem) => {
                                                      if (mapItem.id === listItem.id) {
                                                        return { ...mapItem, count: mapItem.count - 1 }
                                                      }
                                                      return mapItem
                                                    })
                                                  ]
                                                }))
                                              }
                                            }}
                                          >
                                          </Button>
                                          <Text
                                            style={{
                                              margin: `0 ${pxTransform(windowWidth * 0.02)}`,
                                            }}
                                          >{cartList.find((findItem) => {
                                            return findItem.id === listItem.id
                                          })?.count}</Text>
                                        </View>
                                      )
                                    }
                                    <Button
                                      type="primary"
                                      size="small"
                                      style={{
                                        width: pxTransform(windowWidth * 0.05),
                                        height: pxTransform(windowWidth * 0.05),
                                        borderRadius: pxTransform(windowWidth * 0.05),
                                      }}
                                      icon={<Add color='#fff' size={windowWidth * 0.036} />}
                                      onClick={() => {
                                        if (cartList.find((findItem) => {
                                          return findItem.id === listItem.id
                                        })) {
                                          dispatch(setCartListAction({
                                            type: 'set', data: [
                                              ...cartList.map((mapItem) => {
                                                if (mapItem.id === listItem.id) {
                                                  return { ...mapItem, count: mapItem.count + 1 }
                                                }
                                                return mapItem
                                              })
                                            ]
                                          }))
                                        } else {
                                          dispatch(setCartListAction({
                                            type: 'add', data: {
                                              id: listItem.id,
                                              title: listItem.title,
                                              price: listItem.price,
                                              image: listItem.image,
                                              count: 1,
                                              detail: false,
                                              detailList: [],
                                            }
                                          }))
                                        }
                                      }}
                                    >
                                    </Button>
                                  </View>
                                )
                              }
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
            height: pxTransform(windowWidth * 0.1),
            background: '#fff',
          }}
        ></View>
        <View
          className='order-cart'
          style={{
            position: 'fixed',
            bottom: 0,
            margin: pxTransform(windowWidth * 0.05) + ' ' + pxTransform(windowWidth * 0.05),
            width: `calc(${windowWidth}px - ${windowWidth * 0.1}px)`,
            height: pxTransform(windowWidth * 0.15),
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
              width: cartLeftWidth,
              height: '100%',
              color: '#fff',
              background: cartLeftBackground,
              fontSize: pxTransform(viewHeight * 0.02),
              borderRadius: `${pxTransform(30)} ${pxTransform(0)} ${pxTransform(0)} ${pxTransform(30)}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => {
              if (loginStatus === 0) {
                setLoginPopupVisible(true)
              } else {
                setShowGoodsCouponPopup(true)
              }
            }}
          >
            {
              cartLeftWidth === '30%' ? loginStatus === 0 ? (
                '登录后查询'
              ) : (
                '套餐券'
              ) : (
                ''
              )
            }
          </View>
          <View className='order-cart-middle'
            style={{
              flex: 1,
              height: '100%',
              color: '#fff',
              paddingLeft: pxTransform(windowWidth * 0.05),
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <View
              className='order-cart-middle-icon'
              style={{
                marginRight: pxTransform(windowWidth * 0.02),
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
              onClick={() => {
                if (cartLeftWidth === '30%') {
                  setCartLeftWidth('0')
                  setCartLeftBackground('')
                  setShowCartPopup(true)
                } else {
                  setCartLeftWidth('30%')
                  setCartLeftBackground('#D61518')
                  setShowCartPopup(false)
                }
              }}
            >
              <Badge value={cartList.length}>
                <Cart
                  size={pxTransform(windowWidth * 0.1)}
                />
              </Badge>
            </View>
            <View
              className='order-cart-middle-price'
              style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                fontWeight: 'bold',
              }}
              onClick={() => {
                if (cartLeftWidth === '30%') {
                  setCartLeftWidth('0')
                  setCartLeftBackground('')
                  setShowCartPopup(true)
                } else {
                  setCartLeftWidth('30%')
                  setCartLeftBackground('#D61518')
                  setShowCartPopup(false)
                }
              }}
            >
              {
                cartList.length === 0 ? (
                  <Text
                    style={{
                      fontSize: pxTransform(viewHeight * 0.015),
                      color: '#fff',
                    }}
                  >未选购商品</Text>
                ) : (
                  <ConfigProvider
                    theme={{
                      nutuiPriceColor: '#fff',
                    }}
                  >
                    <Price
                      color='gray'
                      price={cartList.reduce((acc, item) => acc + item.price * item.count, 0)}
                      size="xlarge"
                      thousands
                    />
                  </ConfigProvider>
                )
              }
            </View>
          </View>
          <View
            className='order-cart-right'
            style={{
              height: '100%',
              width: pxTransform(windowWidth * 0.18),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: `${pxTransform(0)} ${pxTransform(30)} ${pxTransform(30)} ${pxTransform(0)}`,
              background: cartList.length > 0 || !(tableInfo.tableId && tableInfo.peopleNum) ? '#D61518' : '',
              color: cartList.length > 0 || !(tableInfo.tableId && tableInfo.peopleNum) ? '#fff' : '#999',
              fontSize: pxTransform(viewHeight * 0.02),
            }}
            onClick={() => {
              if (!(tableInfo.tableId && tableInfo.peopleNum)) {
                scanCode(
                  {
                    scanType: ['qrCode'],
                    success: (res) => {
                      console.log('扫桌码成功', res)
                    },
                    fail: (err) => {
                      console.log('扫桌码失败', err)
                    }
                  }
                )
              }
            }}
          >
            <Text>{tableInfo.tableId && tableInfo.peopleNum ? '去下单' : '扫桌码'}</Text>
          </View>
        </View>
        <LoginPopup
          visible={loginPopupVisible}
          onClose={() => setLoginPopupVisible(false)}
          viewHeight={windowHeight}
        />
        <Popup
          visible={showCartPopup}
          position='bottom'
          onClose={() => {
            setShowCartPopup(false)
            setCartLeftWidth('30%')
            setCartLeftBackground('#D61518')
          }}
          zIndex={50}
          round={true}
        >
          <View
            className='order-cart-popup'
            style={{
              borderRadius: `${pxTransform(20)} ${pxTransform(20)} 0 0`,
            }}
          >
            <View
              className='title'
              style={{
                padding: `0 ${pxTransform(windowWidth * 0.05)}`,
                width: `calc(100% - ${pxTransform(windowWidth * 0.1)})`,
                height: pxTransform(windowHeight * 0.05),
              }}
            >
              <View
                className='title-left title-item'
              >
                <Checkbox
                  style={{
                    '--nut-icon-width': pxTransform(windowWidth * 0.035),
                    '--nut-icon-height': pxTransform(windowWidth * 0.035),
                  } as any}
                  className="test"
                  label="全选"
                  checked={cartCheckboxGroupValue.length > 0}
                  indeterminate={cartCheckboxGroupValue.length > 0 && cartCheckboxGroupValue.length < cartList.length}
                  onChange={(state) => {
                    if (state) {
                      setCartCheckboxGroupValue(cartList.map((mapItem) => mapItem.id))
                    } else {
                      setCartCheckboxGroupValue([])
                    }
                  }}
                />
              </View>
              <View
                className='title-right title-item'
                onClick={() => {
                  dispatch(setCartListAction({ type: 'clear' }))
                }}
              >
                <Del
                  size={pxTransform(windowWidth * 0.03)}
                />
                <Text
                  style={{
                    marginLeft: pxTransform(windowWidth * 0.01),
                    fontSize: pxTransform(windowWidth * 0.03),
                  }}
                >清空</Text>
              </View>
            </View>
            <View
              className='content'
              style={{
                padding: pxTransform(windowWidth * 0.03),
                width: `calc(100% - ${pxTransform(windowWidth * 0.06)})`,
              }}
            >
              {
                cartList.map((item) => (
                  <>
                    <View
                      className='content-item'
                    >
                      <View
                        className='item-left'
                      >
                        <View
                          className='item-left-checkbox'
                          style={{
                            width: pxTransform(windowWidth * 0.1),
                            height: pxTransform(windowWidth * 0.1),
                          }}
                        >
                          <Checkbox
                            value={item.id}
                            checked={cartCheckboxGroupValue.includes(item.id)}
                            onChange={(state) => {
                              if (state) {
                                setCartCheckboxGroupValue((prev) => {
                                  if (prev.length < cartList.length - 1) {

                                  }
                                  return [...prev, item.id]
                                })
                              } else {
                                setCartCheckboxGroupValue(cartCheckboxGroupValue.filter((mapItem) => mapItem !== item.id))
                              }
                            }}
                            style={{
                              '--nut-icon-width': pxTransform(windowWidth * 0.04),
                              '--nut-icon-height': pxTransform(windowWidth * 0.04),
                            } as any}
                          />
                        </View>
                        <Image
                          src={item.image}
                          width={pxTransform(windowWidth * 0.1)}
                          height={pxTransform(windowWidth * 0.1)}
                        />
                      </View>
                      <View
                        className='item-right'
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                      >
                        {
                          item.detail ? (
                            <Collapse
                              defaultActiveName={['1', '2']} expandIcon={<ArrowDown />}
                              style={{
                                width: '100%',
                                '--nutui-collapse-item-padding': 0,
                                '--nutui-collapse-item-header-border-bottom': 'none'
                              } as any}
                            >
                              <Collapse.Item title={item.title} name="1">
                                {
                                  item.detailList.map((item) => (
                                    <View
                                      className='item-detail'
                                    >
                                      <View
                                        style={{
                                          display: 'flex',
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                        }}
                                      >
                                        <Image
                                          src={item.image}
                                          width={pxTransform(windowWidth * 0.1)}
                                          height={pxTransform(windowWidth * 0.1)}
                                        />
                                        <Text
                                          style={{
                                            marginLeft: pxTransform(windowWidth * 0.02),
                                          }}
                                        >{item.title}</Text>
                                      </View>
                                      <Text
                                        style={{
                                          color: '#939393',
                                        }}
                                      >x{item.count}</Text>
                                    </View>
                                  ))
                                }
                              </Collapse.Item>
                            </Collapse>
                          ) : (
                            <View
                              style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <Text>{item.title}</Text>
                            </View>
                          )
                        }
                        <View
                          className='right-bottom'
                        >
                          <ConfigProvider
                            theme={{
                              nutuiPricePrimaryColor: '#333',
                              nutuiPriceSymbolLargeSize: pxTransform(viewHeight * 0.02),
                            }}
                          >
                            <Price
                              color='gray'
                              price={item.price}
                              size="small"
                              thousands
                            />
                          </ConfigProvider>
                          <View
                            className="custom-input-number"
                            style={{
                              width: pxTransform(windowWidth * 0.2),
                              height: pxTransform(viewHeight * 0.03),
                              borderRadius: pxTransform(viewHeight * 0.018),
                              fontSize: pxTransform(viewHeight * 0.03),
                            }}
                          >
                            <View
                              className="custom-btn minus"
                              style={{
                                width: pxTransform(windowWidth * 0.0848),
                                height: pxTransform(viewHeight * 0.036),
                              }}
                              onClick={() => {
                                if (item.count === 1) {
                                  const newCartList = cartList.filter((mapItem) => mapItem.id !== item.id)
                                  dispatch(setCartListAction({ type: 'set', data: newCartList }))
                                } else {
                                  dispatch(setCartListAction({
                                    type: 'set', data: [
                                      ...cartList.map((mapItem) => {
                                        if (mapItem.id === item.id) {
                                          return {
                                            ...mapItem,
                                            count: mapItem.count - 1,
                                          }
                                        }
                                        return mapItem
                                      })
                                    ]
                                  }))
                                }
                              }}
                            >-</View>
                            <View
                              className="custom-value"
                              style={{
                                width: pxTransform(windowWidth * 0.0848),
                                fontSize: pxTransform(viewHeight * 0.02),
                              }}
                            >{item.count}</View>
                            <View
                              className="custom-btn plus"
                              style={{
                                width: pxTransform(windowWidth * 0.0848),
                                height: pxTransform(viewHeight * 0.036),
                              }}
                              onClick={() => dispatch(setCartListAction({
                                type: 'set', data: [
                                  ...cartList.map((mapItem) => {
                                    if (mapItem.id === item.id) {
                                      return {
                                        ...mapItem,
                                        count: mapItem.count + 1,
                                      }
                                    }
                                    return mapItem
                                  })
                                ]
                              }))
                              }
                            >+</View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </>
                ))
              }
              <View
                className='cart-bottom'
                style={{
                  width: '100%',
                  height: pxTransform(windowWidth * 0.23),
                  background: '#fff',
                }}
              >
              </View>
            </View>
          </View>
        </Popup>
      </View >
      <Popup
        closeable
        round={true}
        visible={showGoodsCouponPopup}
        position='bottom'
        onClose={() => {
          setShowGoodsCouponPopup(false)
        }}
        title='尊享商品券'
        style={{
          background: '#f5f5f5',
        }}
      >
        <View
          className='goods-coupon-popup'
          style={{
            padding: pxTransform(windowWidth * 0.03),
            width: `calc(100% - ${pxTransform(windowWidth * 0.06)})`,
            height: pxTransform(windowHeight * 0.7),
          }}
        >
          <View
            className='use-coupon'
            style={{
              // marginLeft: pxTransform(windowWidth * 0.03),
              paddingBottom: pxTransform(windowWidth * 0.03),
              height: pxTransform(windowHeight * 0.03),
              fontSize: pxTransform(windowWidth * 0.04),
            }}
          >
            可用券（{goodsCouponList.length}）
          </View>
          {
            goodsCouponList.map((item) => (
              <View
                className='goods-coupon-item'
                style={{
                  padding: pxTransform(windowWidth * 0.03),
                  height: pxTransform(windowHeight * 0.15),
                  width: `calc(100% - ${pxTransform(windowWidth * 0.06)})`,
                }}
              >
                <View
                  className='item-top'
                  style={{
                    height: `calc(65% - ${pxTransform(windowWidth * 0.03)})`,
                  }}
                >
                  <Image
                    src={item.image}
                    width={pxTransform(windowHeight * 0.15 * 0.65 - windowWidth * 0.03)}
                    height={pxTransform(windowHeight * 0.15 * 0.65 - windowWidth * 0.03)}
                  />
                  <View
                    className='item-top-right'
                    style={{
                      marginLeft: pxTransform(windowWidth * 0.05),
                      fontSize: pxTransform(windowWidth * 0.025),
                    }}
                  >
                    <Text
                      style={{
                        fontSize: pxTransform(windowWidth * 0.04),
                        fontWeight: 'bold',
                        color: '#333',
                      }}
                    >{item.title}</Text>
                    <Text>
                      <Text
                        style={{
                          fontSize: pxTransform(windowWidth * 0.04),
                          fontWeight: 'bold',
                          color: '#D61518',
                          marginRight: pxTransform(windowWidth * 0.01),
                        }}
                      >免费兑换</Text>
                      无门槛</Text>
                    <Text>有效期：{item.startTime}&nbsp;-&nbsp;{item.endTime}</Text>
                  </View>
                </View>
                <Divider
                  style={{
                    borderStyle: 'dashed',
                    '--nutui-divider-margin': `${pxTransform(windowWidth * 0.03)} 0`,
                  } as any}
                />
                <View
                  className='item-bottom'
                  style={{
                    height: `calc(35% - ${pxTransform(windowWidth * 0.03)})`,
                  }}
                >
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      fontSize: pxTransform(windowWidth * 0.03),
                      color: '#999',
                    }}
                    onClick={() => {
                      setGoodsCouponDescriptionDialogItem(item.description)
                      setShowGoodsCouponDescriptionDialog(true)
                    }}
                  >
                    使用说明<ArrowDown
                      size={windowWidth * 0.03}
                      style={{
                        marginLeft: pxTransform(windowWidth * 0.01),
                      }}
                    />
                  </View>
                  <Button
                    type='primary'
                    disabled={item.type === 1}
                    style={{
                      borderRadius: pxTransform(windowWidth * 0.05),
                    }}
                  >{
                      item.type === 0 ? '立即使用' : '已使用'
                    }</Button>
                </View>
              </View>
            ))
          }
        </View>
      </Popup>
      <Dialog
        title="使用说明"
        visible={showGoodsCouponDescriptionDialog}
        confirmText="我知道了"
        hideCancelButton
        onConfirm={() => setShowGoodsCouponDescriptionDialog(false)}
      >
        <Text>{goodsCouponDescriptionDialogItem}</Text>
      </Dialog>
    </>
  )
} 