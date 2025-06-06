import { useRef, useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import type { IntersectionObserver } from '@tarojs/taro'
import { useLoad, useReady, useUnload, useDidShow, getSystemInfoSync, getMenuButtonBoundingClientRect, createIntersectionObserver, nextTick, createSelectorQuery, navigateTo, useRouter, setStorage, getStorage, scanCode } from '@tarojs/taro'
import './order.scss'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { setCartListAction, setCheckoutOrderAction, setOrderTabsListAction } from '@/redux/modules/order'
import { setIsRetrieve } from '@/redux/modules/login'
import { pxTransform, SearchBar, ConfigProvider, Sticky, Button, Badge, Price, Elevator, Card, Image, SideBar, Cell, Tag, Popup, Checkbox, Collapse, Divider, Dialog } from '@nutui/nutui-react-taro'
import { Cart, Star, StarFill, ArrowDown, Add, Minus, Del } from '@nutui/icons-react-taro'
import { useThrottleFn } from 'ahooks'
import LoginPopup from '@/components/LoginPopup'
import { TABLE_INFO, routes, orderJoinVip } from '@/utils/constants'
import { taroPost } from '@/service'
import { getOrderTabsListURL, getOrderListURL } from '@/service/config'

export default function Order() {
  // 获取登录状态和用户信息
  const {
    login: {
      loginStatus,
      userInfo,
      isRetrieve,
    },
    order: {
      cartList,
      groupGoodsList,
      orderTabsList,
      orderList,
      goodsCouponList,
    },
    address: {
      currentShop,
    }
  } = useAppSelector((state) => state)
  const dispatch = useAppDispatch()

  const getOrderTabsList = () => {
    taroPost({
      url: getOrderTabsListURL,
      success: (res) => {
        console.log('res', res);
        const tabs = res.data.map((item: any) => {
          return {
            groupId: item.id,
            groupName: item.classificationName,
          }
        })
        // setSideBarValue(tabs[0].groupId)
        dispatch(setOrderTabsListAction({
          type: 'set',
          data: tabs,
        }))
      },
      fail: (err) => {
        console.log('err', err);
      },
    })
    // taroPost({
    //   url: getOrderListURL,
    //   success: (res) => {
    //     console.log('res', res);
    //   },
    //   fail: (err) => {
    //     console.log('err', err);
    //   },
    // })
  }

  // 页面加载，初始化获取商品列表
  useLoad(() => {
    getOrderTabsList()
  })

  // 每次进入页面都检查是否选择了门店
  useDidShow(() => {
    if (!currentShop) {
      navigateTo({
        url: (routes.find((route) => route.name === 'chooseShop')?.path || '') + '?type=init',
      })
    }
  })

  // 桌号信息
  const [tableInfo, setTableInfo] = useState<any>({
    tableId: null,
    peopleNum: null,
  })

  // 获取桌号
  useEffect(() => {
    if (isRetrieve || !tableInfo.tableId) {
      getStorage(
        {
          key: TABLE_INFO,
          fail: (err) => {
            console.log('点单页获取桌号失败', err)
          },
          success: (res) => {
            setTableInfo(res.data)
          },
        },
      )
      dispatch(setIsRetrieve(false))
    }
  }, [isRetrieve, tableInfo.tableId])
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
  const [sideBarValue, setSideBarValue] = useState<number | string>(0)

  useEffect(() => {
    if (orderTabsList.length > 0) {
      setSideBarValue(orderTabsList[0].groupId)
    }
  }, [orderTabsList])

  // 购物车左侧显示
  const [cartLeftWidth, setCartLeftWidth] = useState<string>('30%')
  const [cartLeftBackground, setCartLeftBackground] = useState<string>('#D61518')
  // 购物车右侧宽度
  // const [cartRightWidth, setCartRightWidth] = useState<string>(`calc(70% - ${pxTransform(windowWidth * 0.18)})`)

  // const [activeStickyIndex, setActiveStickyIndex] = useState<number>(0)
  // const [activeStickyId, setActiveStickyId] = useState<string>('sticky-0')
  const stickyPositions = useRef<{ id: string; top: number }[]>([])

  // 初始化获取所有吸顶元素的位置
  useEffect(() => {
    const query = createSelectorQuery()
    query.selectAll('.sticky-header').boundingClientRect()
    query.exec((res) => {
      if (res && res[0]) {
        stickyPositions.current = res[0].map((rect, index) => ({
          id: `sticky-${index}`,
          top: rect.top
        }))
      }
    })
  }, [groupGoodsList])

  // 滚动事件处理
  const handleScroll = (e: any) => {
    const scrollTop = e.detail.scrollTop

    // 找出当前应该吸顶的元素
    for (let i = stickyPositions.current.length - 1; i >= 0; i--) {
      const position = stickyPositions.current[i]

      if (scrollTop >= position.top) {
        if (orderTabsList[i + 1]) {
          setSideBarValue(orderTabsList[i + 1].groupId)
        } else {
          setSideBarValue(orderTabsList[orderTabsList.length - 1].groupId)
        }
        break
      }
    }
  }

  // const { run: handleScroll } = useThrottleFn(
  //   (e: any) => {
  //     const scrollTop = e.detail.scrollTop
  //     // console.log('scrollTop', scrollTop);


  //     // 找出当前应该吸顶的元素
  //     for (let i = stickyPositions.current.length - 1; i >= 0; i--) {
  //       const position = stickyPositions.current[i]
  //       // console.log('position', position);

  //       if (scrollTop >= position.top) {
  //         // console.log('position.top', position);
  //         // setActiveStickyIndex(i)
  //         // setActiveStickyId(position.id)
  //         // console.log('orderTabsList[i].groupId', orderTabsList[i].groupId);
  //         if (orderTabsList[i]) {
  //           setSideBarValue(orderTabsList[i].groupId)
  //         } else {
  //           setSideBarValue(orderTabsList[orderTabsList.length - 1].groupId)
  //         }
  //         break
  //       }
  //     }
  //   },
  //   { wait: 100 }
  // );

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
                onClick={() => {
                  navigateTo({
                    url: (routes.find((route) => route.name === 'chooseShop')?.path || ''),
                  })
                }}
              >{currentShop ? (currentShop?.shopName + ' >') : '未选门店'}</View>
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
            {
              orderTabsList.map((item) => (
                <SideBar.Item title={
                  <>
                    <Badge value={cartList.filter((findItem) => {
                      return findItem.groupId === item.groupId
                    }).length}>{item.groupName}</Badge>
                  </>
                } value={item.groupId}>
                </SideBar.Item>
              ))
            }
          </SideBar>
          <ScrollView
            id='parentScroll'
            scrollY
            scrollIntoView={`sticky-${sideBarValue}`}
            onScroll={handleScroll}
            style={{
              flex: 1,
              padding: `${pxTransform(viewHeight * 0.02)} ${pxTransform(windowWidth * 0.05)}`,
              height: `calc(100% - ${pxTransform(viewHeight * 0.04)})`,
              backgroundColor: '#fff',
              overflow: 'auto',
            }}
          >
            <View
              style={{
                position: 'relative',
                width: '100%',
              }}
            >
              {
                groupGoodsList.map((groupItem, index) => (
                  <View key={index} style={{ position: 'relative', width: '100%' }}>
                    <View
                      id={`sticky-${groupItem.groupId}`}
                      className={`sticky-header`}
                      style={{
                        position: 'sticky',
                        top: 0,
                        zIndex: index + 1,
                        width: '100%',
                        marginBottom: pxTransform(viewHeight * 0.02),
                        backgroundColor: '#fff',
                        color: '#6A6A6A',
                        fontSize: pxTransform(viewHeight * 0.018),
                        padding: `${pxTransform(viewHeight * 0.01)} 0`,
                      }}
                    >
                      <Text>{groupItem.groupName}</Text>
                    </View>
                    <View
                      style={{
                        width: '100%',
                        marginBottom: pxTransform(viewHeight * 0.02),
                      }}
                    >
                      {
                        groupItem.goodsList.map((goodsItem) => (
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
                              src={goodsItem.goodsImage}
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
                              <Text>{goodsItem.goodsName}</Text>
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
                                      price={goodsItem.goodsPrice}
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
                                  goodsItem.isPackage ? (
                                    <Badge
                                      style={{
                                        marginRight: pxTransform(windowWidth * 0.02),
                                      }}
                                      value={cartList.find((findItem) => {
                                        return findItem.goodsId === goodsItem.goodsId
                                      })?.goodsCount}>
                                      <Button
                                        type="primary"
                                        size="mini"
                                        style={{
                                          borderRadius: pxTransform(viewHeight * 0.05),
                                        }}
                                        onClick={() => {
                                          navigateTo({
                                            url: routes.find((route) => route.name === 'choose')?.path || '',
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
                                          return findItem.goodsId === goodsItem.goodsId
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
                                                  return findItem.goodsId === goodsItem.goodsId
                                                })?.goodsCount === 1) {
                                                  dispatch(setCartListAction({
                                                    type: 'remove', data: {
                                                      goodsId: goodsItem.goodsId,
                                                    }
                                                  }))
                                                } else {
                                                  dispatch(setCartListAction({
                                                    type: 'set', data: [
                                                      ...cartList.map((mapItem) => {
                                                        if (mapItem.goodsId === goodsItem.goodsId) {
                                                          return { ...mapItem, goodsCount: mapItem.goodsCount - 1 }
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
                                              return findItem.goodsId === goodsItem.goodsId
                                            })?.goodsCount}</Text>
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
                                            return findItem.goodsId === goodsItem.goodsId
                                          })) {
                                            dispatch(setCartListAction({
                                              type: 'set', data: [
                                                ...cartList.map((mapItem) => {
                                                  if (mapItem.goodsId === goodsItem.goodsId) {
                                                    return { ...mapItem, goodsCount: mapItem.goodsCount + 1 }
                                                  }
                                                  return mapItem
                                                })
                                              ]
                                            }))
                                          } else {
                                            dispatch(setCartListAction({
                                              type: 'add', data: {
                                                goodsId: goodsItem.goodsId,
                                                goodsName: goodsItem.goodsName,
                                                goodsPrice: goodsItem.goodsPrice,
                                                goodsImage: goodsItem.goodsImage,
                                                goodsCount: 1,
                                                isPackage: goodsItem.isPackage,
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
                      index === groupGoodsList.length - 1 && (
                        <View
                          style={{
                            width: '100%',
                            height: pxTransform(viewHeight * 0.1),
                          }}
                        ></View>
                      )
                    }
                  </View>
                ))
              }
            </View>
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
                      price={cartList.reduce((acc, item) => acc + item.goodsPrice * item.goodsCount, 0)}
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
                // scanCode(
                //   {
                //     scanType: ['qrCode'],
                //     success: (res) => {
                //       console.log('扫桌码成功', res)
                //     },
                //     fail: (err) => {
                //       console.log('扫桌码失败', err)
                //     }
                //   }
                // )
                navigateTo(
                  {
                    url: (routes.find((route) => route.name === 'selectTable')?.path || '') + `?id=5`,
                  }
                )
              } else {
                dispatch(setCheckoutOrderAction({
                  type: 'set', data: {
                    checkoutOrderId: 1,
                    checkoutOrderCouponedPrice: cartList.reduce((acc, item) => acc + item.totalPrice, 0),
                    checkoutOrderTotalPrice: cartList.reduce((acc, item) => acc + item.totalPrice, 0),
                    checkoutOrderTotalCount: cartList.reduce((acc, item) => acc + item.goodsCount, 0),
                    checkoutOrderType: 1,
                    checkoutOrderTableNumber: tableInfo.tableId,
                    checkoutOrderPersonNumber: tableInfo.peopleNum,
                    isUseCoupon: false,
                    couponList: [],
                    goodsList: cartList,
                  }
                }))
                navigateTo(
                  {
                    url: routes.find((route) => route.name === 'payment')?.path || '',
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
                      setCartCheckboxGroupValue(cartList.map((mapItem) => mapItem.goodsId))
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
                cartList.map((cartItem) => (
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
                            value={cartItem.goodsId}
                            checked={cartCheckboxGroupValue.includes(cartItem.goodsId)}
                            onChange={(state) => {
                              if (state) {
                                setCartCheckboxGroupValue((prev) => {
                                  if (prev.length < cartList.length - 1) {

                                  }
                                  return [...prev, cartItem.goodsId]
                                })
                              } else {
                                setCartCheckboxGroupValue(cartCheckboxGroupValue.filter((mapItem) => mapItem !== cartItem.goodsId))
                              }
                            }}
                            style={{
                              '--nut-icon-width': pxTransform(windowWidth * 0.04),
                              '--nut-icon-height': pxTransform(windowWidth * 0.04),
                            } as any}
                          />
                        </View>
                        <Image
                          src={cartItem.goodsImage}
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
                          cartItem.isPackage ? (
                            <></>
                            // 套餐类商品样式备用
                            // <Collapse
                            //   defaultActiveName={['1', '2']} expandIcon={<ArrowDown />}
                            //   style={{
                            //     width: '100%',
                            //     '--nutui-collapse-item-padding': 0,
                            //     '--nutui-collapse-item-header-border-bottom': 'none'
                            //   } as any}
                            // >
                            //   <Collapse.Item title={cartItem.goodsName} name="1">
                            //     {
                            //       cartItem.goodsList.map((goodsItem) => (
                            //         <View
                            //           className='item-detail'
                            //         >
                            //           <View
                            //             style={{
                            //               display: 'flex',
                            //               flexDirection: 'row',
                            //               alignItems: 'center',
                            //             }}
                            //           >
                            //             <Image
                            //               src={goodsItem.goodsImage}
                            //               width={pxTransform(windowWidth * 0.1)}
                            //               height={pxTransform(windowWidth * 0.1)}
                            //             />
                            //             <Text
                            //               style={{
                            //                 marginLeft: pxTransform(windowWidth * 0.02),
                            //               }}
                            //             >{goodsItem.goodsName}</Text>
                            //           </View>
                            //           <Text
                            //             style={{
                            //               color: '#939393',
                            //             }}
                            //           >x{goodsItem.goodsCount}</Text>
                            //         </View>
                            //       ))
                            //     }
                            //   </Collapse.Item>
                            // </Collapse>
                          ) : (
                            <View
                              style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <Text>{cartItem.goodsName}</Text>
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
                              price={cartItem.goodsPrice}
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
                                if (cartItem.goodsCount === 1) {
                                  const newCartList = cartList.filter((mapItem) => mapItem.goodsId !== cartItem.goodsId)
                                  dispatch(setCartListAction({ type: 'set', data: newCartList }))
                                } else {
                                  dispatch(setCartListAction({
                                    type: 'set', data: [
                                      ...cartList.map((mapItem) => {
                                        if (mapItem.goodsId === cartItem.goodsId) {
                                          return {
                                            ...mapItem,
                                            goodsCount: mapItem.goodsCount - 1,
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
                            >{cartItem.goodsCount}</View>
                            <View
                              className="custom-btn plus"
                              style={{
                                width: pxTransform(windowWidth * 0.0848),
                                height: pxTransform(viewHeight * 0.036),
                              }}
                              onClick={() => dispatch(setCartListAction({
                                type: 'set', data: [
                                  ...cartList.map((mapItem) => {
                                    if (mapItem.goodsId === cartItem.goodsId) {
                                      return {
                                        ...mapItem,
                                        goodsCount: mapItem.goodsCount + 1,
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
            goodsCouponList.map((goodsCouponItem) => (
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
                    src={goodsCouponItem.goodsCouponImage}
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
                    >{goodsCouponItem.goodsCouponName}</Text>
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
                    <Text>有效期：{goodsCouponItem.goodsCouponStartTime}&nbsp;-&nbsp;{goodsCouponItem.goodsCouponEndTime}</Text>
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
                      setGoodsCouponDescriptionDialogItem(goodsCouponItem.goodsCouponDesc)
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
                    disabled={goodsCouponItem.goodsCouponStatus === 2}
                    style={{
                      borderRadius: pxTransform(windowWidth * 0.05),
                    }}
                  >{
                      goodsCouponItem.goodsCouponStatus === 1 ? '立即使用' : '已使用'
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