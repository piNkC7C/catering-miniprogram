import { View, Text, ScrollView } from '@tarojs/components'
import { useLoad, getSystemInfoSync, navigateTo } from '@tarojs/taro'
import './orderList.scss'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { Tabs, Image, Button, pxTransform, Empty, Cell, Tag, Price, Popup, Space, Checkbox, Toast } from '@nutui/nutui-react-taro'
import { ArrowRight, IconFont } from '@nutui/icons-react-taro'
import { useState, useEffect } from 'react'
import noOrderList from '@/assets/orderlist/noorderlist@2x.png'
import logoSmall from '@/assets/orderlist/logo-small.png'
import userNologin from '@/assets/index/user-nologin.png'
import { setCurrentOrderAction } from '@/redux/modules/order'
import LoginPopup from '@/components/LoginPopup'

export default function OrderList() {
  // 获取登录状态和用户信息
  const {
    login: {
      loginStatus,
      userInfo
    },
    order: {
      orderList,
      currentOrder
    }
  } = useAppSelector((state) => state)
  const dispatch = useAppDispatch()

  const filterOrderList = (tabValue: number) => {
    if (tabValue === 0) {
      return orderList
    }
    return orderList.filter((orderItem) => orderItem.orderType === tabValue)
  }

  // useLoad(() => {
  //   console.log('OrderList page loaded.')
  // })

  // 底部弹层
  const [showBottomPopup, setShowBottomPopup] = useState<boolean>(false)

  // 登录状态为0时，初始化显示底部弹层
  // useEffect(() => {
  //   if (loginStatus === 0) {
  //     setShowBottomPopup(true)
  //   }
  // }, [])

  const { windowWidth, windowHeight } = getSystemInfoSync()

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
  const [tabvalue, setTabvalue] = useState<string | number>('all')

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
            '--nutui-tabs-tabpane-backgroundColor': '#f5f5f5',
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
                                  {orderItem.orderTag}
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
                                {orderItem.orderStatus === 2 && '已完成'}
                                {orderItem.orderStatus === 3 && '已取消'}
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
                                dispatch(setCurrentOrderAction({
                                  type: 'set',
                                  data: orderItem
                                }))
                                navigateTo({
                                  url: `/subPackages/orderDetail/orderDetail?id=${orderItem.orderId}`
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
                                        src={goodsItem.goodsImage}
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
                                      >{goodsItem.goodsName}</Text>
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
                                    price={orderItem.totalPrice}
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
                              >{orderItem.tableNumber}</Text>
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
                                    >取消订单</Button>
                                    <Button
                                      type='primary'
                                      size="normal"
                                      style={{
                                        borderRadius: pxTransform(20),
                                      }}
                                    >立即支付</Button>
                                  </View>
                                )
                              }
                              {
                                orderItem.orderStatus === 3 && (
                                  <View
                                    className='order-status1'
                                  >
                                    <Button
                                      type="default"
                                      size="normal"
                                      style={{
                                        borderRadius: pxTransform(20),
                                      }}
                                    >再来一单</Button>
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
                                    >退款详情</Button>
                                  </View>
                                )
                              }
                              {
                                orderItem.orderStatus === 2 && (
                                  <View
                                    className='order-status0'
                                  >
                                    <Button
                                      type="default"
                                      size="normal"
                                      style={{
                                        borderRadius: pxTransform(20),
                                      }}
                                    >再来一单</Button>
                                    <Button
                                      type='primary'
                                      size="normal"
                                      style={{
                                        borderRadius: pxTransform(20),
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