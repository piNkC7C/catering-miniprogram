import { View, Text, ScrollView } from '@tarojs/components'
import { useLoad, getSystemInfoSync, navigateTo, useDidShow, showToast, showLoading, hideLoading, showModal } from '@tarojs/taro'
import './orderList.scss'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { Tabs, Image, Button, pxTransform, Empty, Cell, Tag, Price, Popup, Space, Checkbox, Toast } from '@nutui/nutui-react-taro'
import { ArrowRight, IconFont } from '@nutui/icons-react-taro'
import { useState, useEffect } from 'react'
import { noOrderList, logoSmall, userNologin } from '@/utils/constants'
import { setCurrentOrderAction, setOrderListAction, setPayOrderInfoAction, setRefundListAction } from '@/redux/modules/order'
import LoginPopup from '@/components/LoginPopup'
// 路由
import { routes, orderTagList } from '@/utils/constants'
import { getOrderListAPI, getRefundListAPI, getPrePayByOrderIdAPI, cancelOrderAPI } from '@/api/order'
import { IResponseApi } from '@/api/type'
import { IOrderItem, IRefundItem } from '@/redux/types/order'

export default function OrderList() {
  // 获取登录状态和用户信息
  const {
    login: {
      loginStatus,
      userInfo,
    },
    order: {
      orderList,
    }
  } = useAppSelector((state) => state)
  const dispatch = useAppDispatch()

  // 获取订单列表
  const getOrderList = (res: IResponseApi<IOrderItem[]>) => {
    if (res.success) {
      // console.log(res.data);
      dispatch(setOrderListAction({
        type: 'set',
        data: res.data,
      }))
      hideLoading()
    } else {
      console.log('获取订单列表失败', res);
      hideLoading()
    }
  }

  // 每次进入页面时获取订单列表
  useDidShow(() => {
    showLoading({
      title: '加载中...',
    })
    getOrderListAPI({
      openId: userInfo?.openid!
    }, getOrderList)
  })

  // 根据tab值过滤订单列表
  const filterOrderList = (tabValue: number) => {
    if (tabValue === 0) {
      return orderList
    }
    return orderList.filter((orderItem) => orderItem.orderType === tabValue)
  }

  // 底部弹层
  const [showBottomPopup, setShowBottomPopup] = useState<boolean>(false)

  // 登录状态为0时，初始化显示底部弹层
  // useEffect(() => {
  //   if (loginStatus === 0) {
  //     setShowBottomPopup(true)
  //   }
  // }, [])

  // 窗口的高度和宽度
  const [windowHeight, setRealWindowHeight] = useState(0)
  const [windowWidth, setRealWindowWidth] = useState(0)

  // 获取窗口初始化的高度和宽度避免进入详情页再返回时窗口高度和宽度没有及时更新
  useLoad(() => {
    const { windowHeight: realWindowHeight, windowWidth: realWindowWidth } = getSystemInfoSync()
    setRealWindowHeight(realWindowHeight)
    setRealWindowWidth(realWindowWidth)
  })

  // 订单列表的tab列表
  const tabsList = [
    {
      title: '全部订单',
      value: 0
    },
    {
      title: '门店订单',
      value: 1
    },
    {
      title: '外卖订单',
      value: 2
    },
    {
      title: '商城订单',
      value: 3
    }
  ]

  // 当前选中的tab
  const [tabvalue, setTabvalue] = useState<string | number>(0)

  // 获取退款记录并跳转
  const getRefundList = (res: IResponseApi<IRefundItem[]>) => {
    if (res.success) {
      // console.log(res.data);
      dispatch(setRefundListAction({
        type: 'set',
        data: res.data,
      }))
      navigateTo({
        url: (routes.find((route) => route.name === 'refundList')?.path) || ''
      })
    } else {
      console.log('获取退款记录失败', res);
    }
  }

  return (
    <View className='orderlist-page'>
      <View
        className='orderlist-top'
        style={{
        }}
      >
        <Tabs
          value={tabvalue}
          tabStyle={{ position: 'sticky', top: 0, zIndex: 11 }}
          onChange={(value) => {
            setTabvalue(value)
          }}
          style={{
            '--nutui-tabs-titles-background-color': '#fff',
            '--nutui-tabs-tabpane-background-color': '#f5f5f5',
            '--nutui-tabs-titles-item-color': '#666',
          } as any}
        >
          {
            tabsList.map((tabItem) => (
              <Tabs.TabPane
                title={tabItem.title}
                value={tabItem.value}
              >
                {
                  filterOrderList(tabItem.value).length === 0 && (
                    <View
                      className='orderlist-empty'
                    >
                      <Empty
                        description=""
                        style={{
                          marginTop: pxTransform(10),
                          '--nutui-empty-background-color': '#f5f5f5',
                          '--nutui-empty-padding': '0',
                          '--nutui-empty-image-size': pxTransform(windowWidth * 0.8),
                        } as any}
                        image={
                          <Image
                            src={noOrderList}
                          />
                        }
                      />
                      <Button
                        type='primary'
                        size="large"
                        style={{
                          borderRadius: pxTransform(20),
                          width: pxTransform(windowWidth * 0.4),
                        }}
                      >去点单</Button>
                    </View>
                  )
                }
                {
                  filterOrderList(tabItem.value).length > 0 && (
                    <>
                      {
                        filterOrderList(tabItem.value).map((orderItem) => (
                          <View
                            className='orderlist-item'
                            style={{
                              marginBottom: pxTransform(windowHeight * 0.015),
                              width: `calc(100% - ${pxTransform(windowWidth * 0.05)})`,
                              padding: pxTransform(windowWidth * 0.025),
                              height: pxTransform(windowHeight * 0.3),
                              backgroundColor: '#fff',
                              borderRadius: pxTransform(10),
                            }}
                          >
                            <View
                              className='orderlist-item-top'
                              style={{

                              }}
                            >
                              <View
                                className='orderlist-item-top-left'
                              >
                                <Tag background="#FA2400" plain>
                                  {orderTagList.find((tag) => tag.value === orderItem.orderType)?.name || ''}
                                </Tag>
                                <Text
                                  className='orderlist-item-top-left-text'
                                  style={{
                                    fontSize: pxTransform(windowHeight * 0.023),
                                  }}
                                >{orderItem.shopName}</Text>
                              </View>
                              <View
                                className='orderlist-item-top-right'
                                style={{
                                  fontSize: pxTransform(windowHeight * 0.02),
                                  color: orderItem.orderStatus === 1 ? '#D7181A' : '#676767'
                                }}
                              >
                                {orderItem.orderStatus === 1 && '待支付'}
                                {orderItem.orderStatus === 2 && '已取消'}
                                {orderItem.orderStatus === 3 && '已完成'}
                                {orderItem.orderStatus === 4 && '已关闭'}
                                {/* {orderItem.orderStatus === 5 && '退款中'} */}
                              </View>
                            </View>
                            <View
                              className='orderlist-item-middle'
                              style={{
                                padding: `${pxTransform(windowHeight * 0.015)} 0`,
                                height: `calc(40% - ${pxTransform(windowHeight * 0.03)})`,
                              }}
                              onClick={() => {
                                if (orderItem.orderStatus === 1 || orderItem.orderStatus === 4) {
                                  return
                                }
                                dispatch(setCurrentOrderAction({
                                  type: 'set',
                                  data: orderItem
                                }))
                                navigateTo({
                                  url: (routes.find((route) => route.name === 'orderDetail')?.path || '') + `?id=${orderItem.orderId}`
                                })
                              }}
                            >
                              <ScrollView
                                scrollX
                                className='orderlist-item-middle-left'
                              >
                                {
                                  orderItem.goodsList.map((goodsItem) => (
                                    <View
                                      className='orderlist-item-middle-left-goods'
                                      style={{
                                        width: pxTransform(windowHeight * 0.09),
                                        height: pxTransform(windowHeight * 0.09),
                                      }}
                                    >
                                      <Image
                                        src={goodsItem.mealImage}
                                        mode='scaleToFill'
                                        width={pxTransform(windowHeight * 0.08)}
                                        height={pxTransform(windowHeight * 0.06)}
                                        style={{
                                          borderRadius: pxTransform(windowWidth * 0.01),
                                        }}
                                      />
                                      <Text
                                        className='orderlist-item-middle-left-goods-name'
                                        style={{
                                          // width: pxTransform(windowHeight * 0.12),
                                          width: '4rem',
                                          height: pxTransform(windowHeight * 0.02),
                                          fontSize: pxTransform(windowHeight * 0.015),
                                          marginTop: pxTransform(windowHeight * 0.005),
                                        }}
                                      >{goodsItem.mealName}</Text>
                                    </View>
                                  ))
                                }
                              </ScrollView>
                              <View
                                className='orderlist-item-middle-right'
                              >
                                <View
                                  className='orderlist-item-middle-right-top'
                                >
                                  <Price
                                    color="gray"
                                    price={orderItem.couponedPrice}
                                    size="normal"
                                    thousands
                                    style={{
                                      fontWeight: 'bold',
                                      '--nutui-price-color': '#333',
                                    } as any}
                                  />
                                </View>
                                <View
                                  className='orderlist-item-middle-right-bottom'
                                  style={{
                                    fontSize: pxTransform(windowHeight * 0.015),
                                  }}
                                >
                                  共{orderItem.totalCount}件
                                </View>
                              </View>
                            </View>
                            <View
                              className='orderlist-item-table'
                              style={{
                                borderRadius: pxTransform(10),
                                fontSize: pxTransform(windowHeight * 0.02),
                              }}
                            >
                              桌号&nbsp;&nbsp;<Text
                                style={{
                                  fontWeight: 'bold',
                                  color: '#333',
                                }}
                              >{orderItem.tableName}</Text>
                            </View>
                            <View
                              className='orderlist-item-bottom'
                              style={{

                              }}
                            >
                              {
                                orderItem.orderStatus === 1 && (
                                  <View
                                    className='order-status0'
                                  >
                                    <Button
                                      type="default"
                                      size="normal"
                                      style={{
                                        borderRadius: pxTransform(20),
                                      }}
                                      onClick={() => {
                                        showModal({
                                          title: '提示',
                                          content: '确定取消订单吗？',
                                          success: (res) => {
                                            if (res.confirm) {
                                              showLoading({
                                                title: '取消中...',
                                              })
                                              cancelOrderAPI({
                                                id: orderItem.orderId
                                              }, (res: IResponseApi<any>) => {
                                                // console.log('cancelOrderAPI res', res)
                                                getOrderListAPI({
                                                  openId: userInfo?.openid!
                                                }, getOrderList)
                                                hideLoading()
                                              })
                                            }
                                          }
                                        })
                                      }}
                                    >取消订单</Button>
                                    <Button
                                      type='primary'
                                      size="normal"
                                      style={{
                                        borderRadius: pxTransform(20),
                                      }}
                                      onClick={() => {
                                        getPrePayByOrderIdAPI({
                                          id: orderItem.orderId.toString()
                                        }, (res: IResponseApi<any>) => {
                                          console.log('getPrePayByOrderIdAPI res', res)
                                          if (res.success) {
                                            dispatch(setPayOrderInfoAction({
                                              type: 'set',
                                              data: {
                                                timeStamp: res.data.timeStamp,
                                                nonceStr: res.data.nonceStr,
                                                packageValue: res.data.packageValue,
                                                signType: res.data.signType,
                                                paySign: res.data.paySign,
                                                prepayId: res.data.packageValue.substring(10, res.data.packageValue.length),
                                              }
                                            }))
                                            dispatch(setCurrentOrderAction({
                                              type: 'set',
                                              data: orderItem
                                            }))
                                            navigateTo({
                                              url: routes.find((route) => route.name === 'confirmPayment')?.path || ''
                                            })
                                          }
                                        })
                                      }}
                                    >立即支付</Button>
                                  </View>
                                )
                              }
                              {
                                orderItem.orderStatus === 2 && (
                                  <View
                                    className='order-status1'
                                  >
                                    {/* <Button
                                      type="default"
                                      size="normal"
                                      style={{
                                        borderRadius: pxTransform(20),
                                      }}
                                    >再来一单</Button> */}
                                    <Button
                                      type="default"
                                      size="normal"
                                      style={{
                                        borderRadius: pxTransform(20),
                                      }}
                                      onClick={() => {
                                        dispatch(setCurrentOrderAction({
                                          type: 'set',
                                          data: orderItem
                                        }))
                                        navigateTo({
                                          url: routes.find((route) => route.name === 'orderDetail')?.path || ''
                                        })
                                      }}
                                    >查看订单</Button>
                                  </View>
                                )
                              }
                              {
                                orderItem.orderStatus === 4 && (
                                  <View
                                    className='order-status1'
                                  >
                                    <Button
                                      type="default"
                                      size="normal"
                                      style={{
                                        borderRadius: pxTransform(20),
                                      }}
                                      onClick={() => {
                                        dispatch(setCurrentOrderAction({
                                          type: 'set',
                                          data: orderItem
                                        }))
                                        getRefundListAPI({
                                          id: orderItem.orderId
                                        }, getRefundList)
                                      }}
                                    >退款记录</Button>
                                  </View>
                                )
                              }
                              {
                                orderItem.orderStatus === 3 && (
                                  <View
                                    className='order-status0'
                                  >
                                    {/* <Button
                                      type="default"
                                      size="normal"
                                      style={{
                                        borderRadius: pxTransform(20),
                                      }}
                                    >再来一单</Button> */}
                                    <Button
                                      type='primary'
                                      size="normal"
                                      style={{
                                        borderRadius: pxTransform(20),
                                      }}
                                      onClick={() => {
                                        showToast({
                                          title: '请联系商家进行售后',
                                          icon: 'none',
                                        })
                                      }}
                                    >申请售后</Button>
                                  </View>
                                )
                              }
                            </View>
                          </View>
                        ))
                      }
                    </>
                  )
                }
              </Tabs.TabPane>
            ))
          }
        </Tabs>
        {
          loginStatus === 0 && (
            <View
              className='orderlist-top-bottom'
              style={{
                height: pxTransform(windowHeight * 0.08),
              }}
            ></View>
          )
        }
      </View>
      {
        loginStatus === 0 && (
          <View
            className='orderlist-bottom'
            style={{
              padding: `0 ${pxTransform(windowWidth * 0.025)}`,
              height: pxTransform(windowHeight * 0.08),
              width: `calc(100% - ${pxTransform(windowWidth * 0.05)})`,
            }}
          >
            <View
              className='orderlist-bottom-left'
            >
              <IconFont
                size={pxTransform(windowHeight * 0.03)}
                style={{ width: pxTransform(windowHeight * 0.03), height: pxTransform(windowHeight * 0.03) }}
                name={logoSmall}
              />
              <Text
                className='orderlist-bottom-text'
                style={{
                  fontSize: pxTransform(windowHeight * 0.02),
                  color: '#fff',
                  marginLeft: pxTransform(windowWidth * 0.02),
                }}
              >为给您提供更好的服务请授权登录</Text>
            </View>
            <View
              className='orderlist-bottom-right'
            >
              <Button
                type='primary'
                size="small"
                style={{
                  borderRadius: pxTransform(20),
                }}
                onClick={() => {
                  if (loginStatus === 0) {
                    setShowBottomPopup(true)
                  }
                }}
              >立即登录</Button>
            </View>
          </View>
        )
      }
      <LoginPopup
        visible={showBottomPopup}
        onClose={() => setShowBottomPopup(false)}
        viewHeight={windowHeight}
      />
    </View>
  )
} 