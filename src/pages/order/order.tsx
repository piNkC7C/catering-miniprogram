import { useRef, useState, useEffect, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import type { IntersectionObserver } from '@tarojs/taro'
import { useLoad, useReady, useUnload, useDidShow, getSystemInfoSync, getMenuButtonBoundingClientRect, createIntersectionObserver, nextTick, createSelectorQuery, navigateTo, useRouter, setStorage, getStorage, scanCode, showToast, showModal, getLocation } from '@tarojs/taro'
import './order.scss'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { setCartListAction, setCheckoutOrderAction, setOrderTabsListAction, setGroupGoodsListAction } from '@/redux/modules/order'
import { setIsRetrieve } from '@/redux/modules/login'
import { pxTransform, SearchBar, ConfigProvider, Sticky, Button, Badge, Price, Elevator, Card, Image, SideBar, Cell, Tag, Popup, Checkbox, Collapse, Divider, Dialog } from '@nutui/nutui-react-taro'
import { Cart, Star, StarFill, ArrowDown, Add, Minus, Del } from '@nutui/icons-react-taro'
import { useThrottleFn } from 'ahooks'
import LoginPopup from '@/components/LoginPopup'
import { routes } from '@/utils/constants'
import { IResponseApi } from '@/api/type'
import { clearCartAPI, confirmPaymentAPI, getSetGoodDetailAPI } from '@/api/order'
import ShopInfo from '@/components/shopInfo'
import { useShopAndGoods } from '@/hooks/useShopAndGoods'
import { useCart } from '@/hooks/useCart'

export default function Order() {
  // 获取登录状态和用户信息
  const {
    login: {
      userInfo,
      loginStatus,
      tableInfo,
    },
    order: {
      cartList,
      groupGoodsList,
      orderTabsList,
      goodsCouponList,
    },
    address: {
      currentShop,
    }
  } = useAppSelector((state) => state)
  const dispatch = useAppDispatch()
  const { finish, setFinish, getAddressByLocation, handleAutoSelectShop, getGoodsQuantity } = useShopAndGoods()
  // 购物车相关方法
  const {
    cartSelectedList, // 购物车选中的列表
    getCartGood, // 获取购物车中的某个商品
    getCartGoodCount, // 获取购物车中的某个商品的购买数量
    getCartList, // 获取购物车列表
    modifyCart, // 修改购物车
    deleteCart, // 删除购物车某个商品
    modifyCartSelected, // 购物车选中状态修改
    clearCart // 清空购物车
  } = useCart()


  useEffect(() => {
    if (currentShop?.shopId) {
      getCartList()
    }
  }, [currentShop?.shopId])

  // 侧边栏选中值
  const [sideBarValue, setSideBarValue] = useState<number | string>(0)
  // 控制是否响应侧边栏点击事件
  const [isUserClick, setIsUserClick] = useState<boolean>(false)
  // 滚动容器引用
  const scrollViewRef = useRef<any>(null)
  // 存储各个分类的位置信息
  const sectionPositions = useRef<{ id: string | number; top: number }[]>([])

  // 解决因为页面跳转导致的windowHeight变化导致页面高度出问题
  const [realWindowHeight, setRealWindowHeight] = useState(0)

  // 初始化各分类位置信息
  const initSectionPositions = () => {
    const query = createSelectorQuery()
    query.selectAll('.sticky-header').boundingClientRect()
    query.exec((res) => {
      if (res && res[0]) {
        sectionPositions.current = res[0].map((rect, index) => ({
          id: orderTabsList[index]?.classificationId,
          top: rect.top - res[0][0].top
        }))
        console.log('分类位置信息:', sectionPositions.current)
      }
    })
    // setFinish(false)
  }

  // 每次进入页面都检查是否选择了门店
  useDidShow(() => {
    // 解决因为页面跳转导致的windowHeight变化导致页面高度出问题
    const { windowHeight } = getSystemInfoSync()
    setRealWindowHeight(windowHeight)
    // 如果未选择门店
    if (!currentShop) {
      getLocation({
        type: 'wgs84',
        success: (res) => {
          getAddressByLocation(res.latitude, res.longitude, handleAutoSelectShop)
        },
        fail: (err) => {
          console.log(err)
        },
      }).catch(() => {
      })
    } else {
      // 重新设置侧边栏，但不触发自动滚动
      if (orderTabsList.length > 0) {
        setSideBarValue(orderTabsList[0].classificationId)
        setIsUserClick(false) // 确保页面进入时不会自动滚动
      }
      // 延迟初始化分类位置信息
      setTimeout(() => {
        initSectionPositions()
      }, 300)
    }
  })

  useEffect(() => {
    if (finish) {
      // 重新设置侧边栏，但不触发自动滚动
      if (orderTabsList.length > 0) {
        setSideBarValue(orderTabsList[0].classificationId)
        setIsUserClick(false) // 确保页面进入时不会自动滚动
      }
      // 初始化分类位置信息
      initSectionPositions()
    }
  }, [finish])

  const { statusBarHeight, windowWidth } = getSystemInfoSync()
  const finalStatusBarHeight = statusBarHeight || 0
  // 获取胶囊按钮信息
  const { top: topMenuButton, height: heightMenuButton } = getMenuButtonBoundingClientRect()
  // 导航栏高度 = 胶囊按钮顶部位置 + (胶囊按钮高度 + 两边距离和)/2
  const navBarHeight = (topMenuButton - finalStatusBarHeight) * 2 + heightMenuButton
  // 总高度
  const navHeight = finalStatusBarHeight + navBarHeight + 5
  // 获取可视区域高度
  const viewHeight = realWindowHeight - navHeight

  // 侧边栏徽标
  const getSideBarBadgeValue = (item: any) => {
    return cartList.filter((findItem) => {
      return findItem.classificationId === item.classificationId
    }).reduce((acc, curr) => acc + curr.count, 0)
  }

  // 门店信息
  const [shopIsFavor, setShopIsFavor] = useState<boolean>(false)

  // 登录组件
  const [loginPopupVisible, setLoginPopupVisible] = useState<boolean>(false)
  // 门店信息弹窗
  const [showShopInfoPopup, setShowShopInfoPopup] = useState<boolean>(false)

  // 购物车弹窗
  const [showCartPopup, setShowCartPopup] = useState<boolean>(false)

  // 商品券弹窗
  const [showGoodsCouponPopup, setShowGoodsCouponPopup] = useState<boolean>(false)
  // 使用说明弹窗
  const [showGoodsCouponDescriptionDialog, setShowGoodsCouponDescriptionDialog] = useState<boolean>(false)
  const [goodsCouponDescriptionDialogItem, setGoodsCouponDescriptionDialogItem] = useState<string>('')

  // 创建一个手动滚动事件来检测元素可见性
  // const [visibleItems, setVisibleItems] = useState<string[]>([]);

  // 购物车左侧显示
  const [cartLeftWidth, setCartLeftWidth] = useState<string>('30%')
  const [cartLeftBackground, setCartLeftBackground] = useState<string>('#D61518')
  // 购物车右侧宽度
  // const [cartRightWidth, setCartRightWidth] = useState<string>(`calc(70% - ${pxTransform(windowWidth * 0.18)})`)

  // const [activeStickyIndex, setActiveStickyIndex] = useState<number>(0)
  // const [activeStickyId, setActiveStickyId] = useState<string>('sticky-0')

  // 滚动事件处理
  const handleScrollEvent = (e: any) => {
    // 如果是用户点击侧边栏触发的滚动，则不处理
    if (isUserClick) {
      return
    }

    const scrollTop = e.detail.scrollTop
    // console.log('当前滚动位置:', scrollTop)

    // 如果位置信息还没有初始化，直接返回
    if (sectionPositions.current.length === 0) {
      return
    }

    // 找出当前应该激活的分类
    let activeSection = sectionPositions.current[0]?.id

    for (let i = sectionPositions.current.length - 1; i >= 0; i--) {
      const position = sectionPositions.current[i]

      if (scrollTop >= position.top) {
        // console.log('position', position)
        activeSection = position.id
        break
      }
    }

    // 只有在当前激活分类与侧边栏选中值不同时才更新
    if (activeSection !== sideBarValue) {
      // console.log('更新侧边栏选中:', activeSection)
      setSideBarValue(activeSection)
    }
  }

  const { run: handleScroll } = useThrottleFn(
    handleScrollEvent,
    { wait: 100 }
  )

  // 处理侧边栏点击事件
  const handleSideBarChange = (key: string | number) => {
    console.log('侧边栏点击:', key)
    setIsUserClick(true)
    setSideBarValue(key)

    // 延迟重置用户点击状态，给自动滚动留出时间
    setTimeout(() => {
      setIsUserClick(false)
      // 重新初始化位置信息，因为可能有布局变化
      // setTimeout(() => {
      //   initSectionPositions()
      // }, 100)
    }, 500)
  }

  return (
    <>
      <View
        className='custom-nav'
        style={{
          position: 'relative',
          height: pxTransform(navHeight),
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
          {/* <SearchBar
            placeholder="搜索商品"
            shape="round"
            style={{
              '--nutui-searchbar-padding': '6px 0',
              '--nutui-searchbar-width': '100%',
              '--nutui-searchbar-input-height': `${heightMenuButton - 6}px`,
              '--nutui-searchbar-input-text-align': 'left',
              '--nutui-searchbar-background': 'transparent',
              '--nutui-searchbar-content-background': '#f5f5f5',
              '--nutui-searchbar-input-text-color': '#f5f5f5',
            } as any}
          /> */}
        </View>
      </View>
      <View className='order-page'
        style={{
          height: pxTransform(viewHeight),
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
                tableInfo?.tableNum && tableInfo?.peopleNum ? (
                  <>
                    <Text
                      style={{
                        fontWeight: 'bold',
                      }}
                    >{tableInfo.tableNum}</Text>号桌&nbsp;&nbsp;<Text
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
              onClick={(e) => {
                e.stopPropagation()
                setShowShopInfoPopup(true)
              }}
            >
              <Text>点此查看</Text>
              <ArrowDown size={viewHeight * 0.02} />
            </View>
          </View>
        </View>
        {/* <View
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
        </View> */}
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
            onChange={handleSideBarChange}
          >
            {
              orderTabsList.map((item) => (
                // @ts-ignore
                // 忽视ts，title类型为string，但是这里需要传入一个组件
                <SideBar.Item title={
                  <>
                    <Badge value={getSideBarBadgeValue(item)}>
                      {item.classificationName}
                    </Badge>
                  </>
                } value={item.classificationId}>
                </SideBar.Item>
              ))
            }
          </SideBar>
          <ScrollView
            ref={scrollViewRef}
            id='parentScroll'
            scrollY
            // scrollTop={isUserClick ? sectionPositions.current.find((item) => item.id === sideBarValue)?.top : undefined}
            scrollIntoView={isUserClick ? `good-${sideBarValue}-0` : ''}
            onScroll={handleScroll}
            style={{
              flex: 1,
              padding: `${pxTransform(viewHeight * 0.02)} ${pxTransform(windowWidth * 0.05)}`,
              height: `calc(100% - ${pxTransform(viewHeight * 0.04)})`,
              backgroundColor: '#fff',
              overflow: 'auto',
              boxSizing: 'border-box',
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
                      id={`sticky-${groupItem.classificationId}`}
                      className={`sticky-header`}
                      style={{
                        position: 'sticky',
                        top: 0,
                        zIndex: index + 1,
                        width: '100%',
                        // height: pxTransform(viewHeight * 0.02),
                        marginBottom: pxTransform(viewHeight * 0.02),
                        backgroundColor: '#fff',
                        color: '#6A6A6A',
                        fontSize: pxTransform(viewHeight * 0.018),
                        padding: `${pxTransform(viewHeight * 0.01)} 0`,
                      }}
                    >
                      <Text>{groupItem.classificationName}</Text>
                    </View>
                    <View
                      style={{
                        width: '100%',
                        marginBottom: pxTransform(viewHeight * 0.02),
                      }}
                    >
                      {
                        groupItem.goodsList.map((goodsItem, index) => (
                          <View
                            id={`good-${groupItem.classificationId}-${index}`}
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
                              src={goodsItem.mealImage}
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
                              <View
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                }}
                              >
                                <Text>{goodsItem.mealName}</Text>
                                <Text
                                  style={{
                                    color: '#999',
                                    fontSize: pxTransform(viewHeight * 0.012),
                                  }}
                                >{goodsItem.minimumPurchaseQuantity}份起购</Text>
                                <Text
                                  style={{
                                    color: '#999',
                                    fontSize: pxTransform(viewHeight * 0.012),
                                  }}
                                >限购{goodsItem.purchaseQuantityLimit}份</Text>
                                <Text
                                  style={{
                                    color: '#999',
                                    fontSize: pxTransform(viewHeight * 0.012),
                                  }}
                                >库存{getGoodsQuantity(goodsItem)}</Text>
                              </View>
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
                                      price={Number(goodsItem.standardPrice) || 0}
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
                                  getGoodsQuantity(goodsItem) <= 0 || getGoodsQuantity(goodsItem) < goodsItem.minimumPurchaseQuantity ? (
                                    <Button
                                      type='default'
                                      size='mini'
                                      style={{
                                        borderRadius: pxTransform(viewHeight * 0.05),
                                        marginRight: pxTransform(windowWidth * 0.02),
                                      }}
                                      disabled
                                    >{getGoodsQuantity(goodsItem) <= 0 ? '已售罄' : '库存不足'}</Button>
                                  )
                                    : goodsItem.isSet ? (
                                      <Badge
                                        style={{
                                          marginRight: pxTransform(windowWidth * 0.02),
                                        }}
                                        value={cartList.find((findItem) => {
                                          return findItem.commodityId === goodsItem.id
                                        })?.count}>
                                        <Button
                                          type="primary"
                                          size="mini"
                                          style={{
                                            borderRadius: pxTransform(viewHeight * 0.05),
                                          }}
                                          onClick={() => {
                                            if (getCartGoodCount(goodsItem.id)! >= goodsItem.purchaseQuantityLimit) {
                                              showToast({
                                                title: '已达到限购数量',
                                                icon: 'none',
                                              })
                                              return
                                            }
                                            getSetGoodDetailAPI({ id: goodsItem.id }, (res: IResponseApi<any>) => {
                                              if (res.success) {
                                                navigateTo({
                                                  url: (routes.find((route) => route.name === 'choose')?.path || '') + `?id=${goodsItem.id}`,
                                                })
                                              } else {
                                                showToast({
                                                  title: '获取套餐详情失败',
                                                  icon: 'none',
                                                  duration: 2000,
                                                })
                                              }
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
                                            return findItem.commodityId === goodsItem.id
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
                                                    return findItem.commodityId === goodsItem.id
                                                  })?.count === goodsItem.minimumPurchaseQuantity) {
                                                    // console.log('删除购物车项', goodsItem.mealName);
                                                    deleteCart(goodsItem.id)
                                                  } else {
                                                    // console.log('购物车商品数量减一', goodsItem.mealName);
                                                    modifyCart({
                                                      commodityId: goodsItem.id,
                                                      count: 1,
                                                      isSet: false,
                                                      isAdd: false,
                                                      selected: getCartGood(goodsItem.id) ? getCartGood(goodsItem.id)?.selected! : true,
                                                      classificationId: groupItem.classificationId,
                                                      minimumPurchaseQuantity: goodsItem.minimumPurchaseQuantity,
                                                      purchaseQuantityLimit: goodsItem.purchaseQuantityLimit,
                                                      standardPrice: goodsItem.standardPrice,
                                                      mealQuantity: getGoodsQuantity(goodsItem),
                                                      cartModifyReqVOList: [],
                                                    })
                                                  }
                                                }}
                                              >
                                              </Button>
                                              <Text
                                                style={{
                                                  margin: `0 ${pxTransform(windowWidth * 0.02)}`,
                                                }}
                                              >{cartList.find((findItem) => {
                                                return findItem.commodityId === goodsItem.id
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
                                          disabled={getCartGoodCount(goodsItem.id)! >= getGoodsQuantity(goodsItem) || getCartGoodCount(goodsItem.id)! >= goodsItem.purchaseQuantityLimit}
                                          icon={<Add color='#fff' size={windowWidth * 0.036} />}
                                          onClick={() => {
                                            const count = cartList.filter(cartItem => cartItem.commodityId == goodsItem.id).length == 0 ? goodsItem.minimumPurchaseQuantity : 1
                                            // console.log('购物车商品数量加一', goodsItem.mealName);
                                            modifyCart({
                                              commodityId: goodsItem.id,
                                              count: count,
                                              isSet: false,
                                              isAdd: true,
                                              selected: getCartGood(goodsItem.id) ? getCartGood(goodsItem.id)?.selected! : true,
                                              classificationId: groupItem.classificationId,
                                              minimumPurchaseQuantity: goodsItem.minimumPurchaseQuantity,
                                              purchaseQuantityLimit: goodsItem.purchaseQuantityLimit,
                                              standardPrice: goodsItem.standardPrice,
                                              mealQuantity: getGoodsQuantity(goodsItem),
                                              cartModifyReqVOList: [],
                                            })
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
            <View
              style={{
                position: 'relative',
                width: '100%',
                height: pxTransform(windowWidth * 0.1),
                background: '#fff',
              }}
            ></View>
          </ScrollView>
        </View>
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
              <Badge value={cartSelectedList.reduce((acc, item) => acc + item.count, 0)}>
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
                cartSelectedList.length === 0 ? (
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
                      price={cartSelectedList.reduce((acc, item) => acc + Number(item.price) * item.count, 0)}
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
              background: cartSelectedList.length > 0 || !(tableInfo?.tableNum && tableInfo?.peopleNum) ? '#D61518' : '',
              color: cartSelectedList.length > 0 || !(tableInfo?.tableNum && tableInfo?.peopleNum) ? '#fff' : '#999',
              fontSize: pxTransform(viewHeight * 0.02),
            }}
            onClick={() => {
              if (!(tableInfo?.tableNum && tableInfo?.peopleNum)) {
                scanCode(
                  {
                    // scanType: ['qrCode'],
                    success: (res) => {
                      console.log('扫桌码成功', res.path)
                      // 确保路径以 / 开头，避免相对路径问题
                      let targetUrl = res.path
                      if (!targetUrl.startsWith('/')) {
                        targetUrl = '/' + targetUrl
                      }
                      console.log('处理后的跳转地址', targetUrl)
                      navigateTo(
                        {
                          url: targetUrl
                        }
                      )
                    },
                    fail: (err) => {
                      console.log('扫桌码失败', err)
                    }
                  }
                )
                // navigateTo(
                //   {
                //     url: (routes.find((route) => route.name === 'selectTable')?.path || '') + `?scene=${encodeURIComponent(`id=2&shopId=2&desNum=7`)}`,
                //   }
                // )
              } else {
                if (cartSelectedList.length == 0) {
                  return
                }
                confirmPaymentAPI({
                  "shopId": currentShop?.shopId!,
                  "deskId": tableInfo?.tableId!,
                  "remark": "",
                  "commodityReq": cartSelectedList.map((cartItem) => (
                    {
                      "commodityId": cartItem.commodityId,
                      "isSet": cartItem.isSet,
                      "count": cartItem.count,
                      "setItems": cartItem.cartDOS?.map((goodsItem) => (
                        {
                          "commodityId": goodsItem.commodityId,
                          "count": goodsItem.count,
                          "isSet": goodsItem.isSet,
                          "isAdd": goodsItem.isAdd,
                          "selected": goodsItem.selected,
                          "image": goodsItem.image,
                          "name": goodsItem.name,
                          "standardPrice": goodsItem.price,
                          "minimumPurchaseQuantity": goodsItem.minimumPurchaseQuantity,
                          "purchaseQuantityLimit": goodsItem.purchaseQuantityLimit,
                          "shopId": currentShop?.shopId!,
                          "deskId": tableInfo?.tableId!,
                          "openId": userInfo?.openid!,
                          "cartModifyReqVOList": []
                        }
                      ))
                    }
                  ))
                }, (res: IResponseApi<any>) => {
                  // console.log('confirmPaymentAPI res', res)
                  if (res.success) {
                    dispatch(setCheckoutOrderAction({
                      type: 'set', data: {
                        // checkoutOrderId: 1,
                        checkoutOrderCouponedPrice: res.data.totalPrice,
                        checkoutOrderTotalPrice: res.data.totalPrice,
                        checkoutOrderTotalCount: res.data.totalCount,
                        checkoutOrderType: 1,
                        checkoutOrderTableId: tableInfo?.tableId,
                        checkoutOrderTableNumber: tableInfo?.tableNum,
                        checkoutOrderPersonNumber: tableInfo?.peopleNum,
                        isUseCoupon: false,
                        couponList: [],
                        goodsList: cartSelectedList,
                      }
                    }))
                    navigateTo(
                      {
                        url: routes.find((route) => route.name === 'payment')?.path || '',
                      }
                    )
                  }
                })
              }
            }}
          >
            <Text>{tableInfo?.tableNum && tableInfo?.peopleNum ? '去下单' : '扫桌码'}</Text>
          </View>
        </View>
        <LoginPopup
          visible={loginPopupVisible}
          onClose={() => setLoginPopupVisible(false)}
          viewHeight={realWindowHeight}
        />
        <ShopInfo
          shopInfoVisible={showShopInfoPopup}
          onClose={() => setShowShopInfoPopup(false)}
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
                height: pxTransform(realWindowHeight * 0.05),
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
                  checked={cartSelectedList.length > 0}
                  indeterminate={cartSelectedList.length > 0 && cartSelectedList.length < cartList.length}
                  onChange={(state) => {
                    // if (cartSelectedList.length == 0) {
                    //   return
                    // }
                    // console.log('购物车全选状态改变', state);
                    modifyCartSelected(cartList, state)
                  }}
                />
              </View>
              <View
                className='title-right title-item'
                onClick={() => {
                  if (cartList.length == 0) {
                    return
                  }
                  showModal({
                    title: '提示',
                    content: '确定清空购物车吗？',
                    success: (res) => {
                      if (res.confirm) {
                        // console.log('res', res);
                        clearCart()
                      }
                    }
                  })
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
                            value={cartItem.commodityId}
                            checked={cartSelectedList.some((mapItem) => mapItem.commodityId === cartItem.commodityId)}
                            onChange={(state) => {
                              // console.log('购物车选中状态改变', state);
                              modifyCartSelected(cartList.filter((item) => item.commodityId === cartItem.commodityId), state)
                            }}
                            style={{
                              '--nut-icon-width': pxTransform(windowWidth * 0.04),
                              '--nut-icon-height': pxTransform(windowWidth * 0.04),
                            } as any}
                          />
                        </View>
                        <Image
                          src={cartItem.image}
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
                          cartItem.isSet ? (
                            // 套餐类商品样式备用
                            <Collapse
                              defaultActiveName={['1', '2']} expandIcon={<ArrowDown />}
                              style={{
                                width: '100%',
                                '--nutui-collapse-item-padding': 0,
                                '--nutui-collapse-item-header-border-bottom': 'none'
                              } as any}
                            >
                              <Collapse.Item title={cartItem.name} name="1">
                                {
                                  cartItem.cartDOS?.map((goodsItem) => (
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
                                          src={goodsItem.image}
                                          width={pxTransform(windowWidth * 0.1)}
                                          height={pxTransform(windowWidth * 0.1)}
                                        />
                                        <Text
                                          style={{
                                            marginLeft: pxTransform(windowWidth * 0.02),
                                          }}
                                        >{goodsItem.name}</Text>
                                      </View>
                                      <Text
                                        style={{
                                          color: '#939393',
                                        }}
                                      >x{goodsItem.count}</Text>
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
                              <Text>{cartItem.name}</Text>
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
                              price={Number(cartItem.price)}
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
                                if (cartItem.count === cartItem.minimumPurchaseQuantity) {
                                  // console.log('删除购物车项', cartItem.name);
                                  deleteCart(cartItem.commodityId)
                                } else {
                                  // console.log('购物车商品数量减一', cartItem.name);
                                  modifyCart({
                                    commodityId: cartItem.commodityId,
                                    count: 1,
                                    isSet: cartItem.isSet,
                                    isAdd: false,
                                    selected: cartItem.selected,
                                    classificationId: cartItem.classificationId,
                                    minimumPurchaseQuantity: cartItem.minimumPurchaseQuantity,
                                    purchaseQuantityLimit: cartItem.purchaseQuantityLimit,
                                    standardPrice: cartItem.price,
                                    mealQuantity: getGoodsQuantity(cartItem as any),
                                    cartModifyReqVOList: [],
                                  })
                                }
                              }}
                            >-</View>
                            <View
                              className="custom-value"
                              style={{
                                width: pxTransform(windowWidth * 0.0848),
                                fontSize: pxTransform(viewHeight * 0.02),
                              }}
                            >{cartItem.count}</View>
                            <View
                              className="custom-btn plus"
                              style={{
                                width: pxTransform(windowWidth * 0.0848),
                                height: pxTransform(viewHeight * 0.036),
                                color: getCartGoodCount(cartItem.commodityId)! >= getGoodsQuantity(cartItem as any) || getCartGoodCount(cartItem.commodityId)! >= cartItem.purchaseQuantityLimit ? '#999' : '#D61518',
                              }}
                              onClick={() => {
                                if (getCartGoodCount(cartItem.commodityId)! >= getGoodsQuantity(cartItem as any) || getCartGoodCount(cartItem.commodityId)! >= cartItem.purchaseQuantityLimit) {
                                  showToast({
                                    title: '可选商品数量已达上限',
                                    icon: 'none',
                                  })
                                  return
                                }
                                const count = cartList.filter(cartItem => cartItem.commodityId == cartItem.commodityId).length == 0 ? cartItem.minimumPurchaseQuantity : 1
                                // console.log('购物车商品数量加一', cartItem.name);
                                modifyCart({
                                  commodityId: cartItem.commodityId,
                                  count: count,
                                  isSet: cartItem.isSet,
                                  isAdd: true,
                                  selected: getCartGood(cartItem.commodityId) ? getCartGood(cartItem.commodityId)?.selected! : true,
                                  classificationId: cartItem.classificationId,
                                  minimumPurchaseQuantity: cartItem.minimumPurchaseQuantity,
                                  purchaseQuantityLimit: cartItem.purchaseQuantityLimit,
                                  standardPrice: cartItem.price,
                                  mealQuantity: getGoodsQuantity(cartItem as any),
                                  cartModifyReqVOList: [],
                                })
                              }}
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
            height: pxTransform(realWindowHeight * 0.7),
          }}
        >
          <View
            className='use-coupon'
            style={{
              // marginLeft: pxTransform(windowWidth * 0.03),
              paddingBottom: pxTransform(windowWidth * 0.03),
              height: pxTransform(realWindowHeight * 0.03),
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
                  height: pxTransform(realWindowHeight * 0.15),
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
                    width={pxTransform(realWindowHeight * 0.15 * 0.65 - windowWidth * 0.03)}
                    height={pxTransform(realWindowHeight * 0.15 * 0.65 - windowWidth * 0.03)}
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