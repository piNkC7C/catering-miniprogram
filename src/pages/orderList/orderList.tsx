import { View, Text, ScrollView } from '@tarojs/components'
import { useLoad, getSystemInfoSync } from '@tarojs/taro'
import './orderList.scss'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { Tabs, Image, Button, pxTransform, Empty, Cell, Tag, Price, Popup, Space, Checkbox, Toast } from '@nutui/nutui-react-taro'
import { ArrowRight, IconFont } from '@nutui/icons-react-taro'
import { useState, useEffect } from 'react'
import noOrderList from '@/assets/orderlist/noorderlist@2x.png'
import logoSmall from '@/assets/orderlist/logo-small.png'
import userNologin from '@/assets/index/user-nologin.png'
import { setOrderListData } from '@/redux/modules/orderList'

export default function OrderList() {
  // 获取登录状态和用户信息
  const {
    login: {
      loginStatus,
      userInfo
    },
    orderList: {
      orderListData
    }
  } = useAppSelector((state) => state)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setOrderListData({
      type: 'set',
      data: 'all'
    }))
  }, [])
  // useLoad(() => {
  //   console.log('OrderList page loaded.')
  // })

  // 底部弹层
  const [showBottomPopup, setShowBottomPopup] = useState<boolean>(false)
  const [checkAgree, setCheckAgree] = useState<boolean>(false)

  // 登录状态为0时，初始化显示底部弹层
  useEffect(() => {
    if (loginStatus === 0) {
      setShowBottomPopup(true)
    }
  }, [])

  // 提示框
  const [toastState, setToastState] = useState<{
    icon: string | React.ReactNode
    content?: string
    duration?: number
    title?: string
  }>({
    icon: null,
    content: 'toast',
    duration: 2,
    title: '',
  })
  const [showToast, setShowToast] = useState<boolean>(false)

  const { windowWidth, windowHeight } = getSystemInfoSync()

  const tabsList = [
    {
      title: '全部订单',
      value: 'all'
    },
    {
      title: '门店订单',
      value: 'shop'
    },
    {
      title: '买单订单',
      value: 'buy'
    },
    {
      title: '储值订单',
      value: 'value'
    },
    {
      title: '拼券订单',
      value: 'pintuan'
    },
    {
      title: '券包订单',
      value: 'quanbao'
    },
    {
      title: '礼品卡',
      value: 'gift'
    },
    {
      title: '权益卡订单',
      value: 'right'
    },
    {
      title: '商城订单',
      value: 'mall'
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
            dispatch(setOrderListData({
              type: 'set',
              data: value
            }))
          }}
          style={{
            '--nutui-tabs-titles-background-color': '#fff',
            '--nutui-tabs-tabpane-backgroundColor': '#f5f5f5',
            '--nutui-tabs-titles-item-color': '#666',
          } as any}
        >
          {
            tabsList.map((item) => (
              <Tabs.TabPane
                title={item.title}
                value={item.value}
              >
                {
                  orderListData.length === 0 && (
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
                  orderListData.length > 0 && (
                    <>
                      {
                        orderListData.map((item) => (
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
                                  {item.orderTag}
                                </Tag>
                                <Text
                                  className='orderlist-item-top-left-text'
                                  style={{
                                    fontSize: pxTransform(windowHeight * 0.023),
                                  }}
                                >{item.orderAddress}</Text>
                              </View>
                              <View
                                className='orderlist-item-top-right'
                                style={{
                                  fontSize: pxTransform(windowHeight * 0.02),
                                }}
                              >
                                {item.orderStatus === 0 && '待支付'}
                                {item.orderStatus === 1 && '已关闭'}
                                {item.orderStatus === 2 && '已取消'}
                                {item.orderStatus === 3 && '已完成'}
                              </View>
                            </View>
                            <View
                              className='orderlist-item-middle'
                              style={{
                                padding: `${pxTransform(windowHeight * 0.015)} 0`,
                                height: `calc(40% - ${pxTransform(windowHeight * 0.03)})`,
                              }}
                            >
                              <ScrollView
                                scrollX
                                className='orderlist-item-middle-left'
                              >
                                {
                                  item.orderGoodsList.map((goods) => (
                                    <View
                                      className='orderlist-item-middle-left-goods'
                                      style={{
                                        width: pxTransform(windowHeight * 0.09),
                                        height: pxTransform(windowHeight * 0.09),
                                      }}
                                    >
                                      <Image
                                        src={goods.goodsImage}
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
                                          width: '6rem',
                                          height: pxTransform(windowHeight * 0.02),
                                          fontSize: pxTransform(windowHeight * 0.015),
                                          marginTop: pxTransform(windowHeight * 0.005),
                                        }}
                                      >{goods.goodsName}</Text>
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
                                    price={item.orderPayPrice}
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
                                  共{item.orderCount}件
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
                              >{item.orderTable}</Text>
                            </View>
                            <View
                              className='orderlist-item-bottom'
                              style={{

                              }}
                            >
                              {
                                item.orderStatus === 0 && (
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
                                item.orderStatus === 1 && (
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
                                item.orderStatus === 2 && (
                                  <View
                                    className='order-status1'
                                  >
                                    <Button
                                      type="default"
                                      size="normal"
                                      style={{
                                        borderRadius: pxTransform(20),
                                      }}
                                    >退款记录</Button>
                                  </View>
                                )
                              }
                              {
                                item.orderStatus === 3 && (
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
                  setShowBottomPopup(true)
                }}
              >立即登录</Button>
            </View>
          </View>
        )
      }
      <Popup
        closeable
        left={
          <View>
            <Image
              src={userNologin}
              mode="scaleToFill"
              width={pxTransform(windowHeight * 0.05)}
              height={pxTransform(windowHeight * 0.05)}
              radius={pxTransform(windowHeight * 0.025)}
            />
          </View>
        }
        title={
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                color: '#333333',
                fontSize: pxTransform(windowHeight * 0.03),
              }}
            >
              欢迎加入xxxx火锅
            </View>
            <View
              style={{
                marginTop: pxTransform(windowHeight * 0.01),
                color: '#676767',
                fontSize: pxTransform(windowHeight * 0.015),
              }}
            >
              加入后享专属活动&会员好礼
            </View>
          </View>
        }
        visible={showBottomPopup}
        position="bottom"
        onClose={() => {
          setShowBottomPopup(false)
        }}
        lockScroll
      >
        <View
          style={{
            padding: `0 ${pxTransform(windowHeight * 0.02)}`,
            marginBottom: pxTransform(windowHeight * 0.025),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: `calc(100% - ${pxTransform(windowHeight * 0.04)})`,
          }}
        >
          <Space
            direction='vertical'
            align='center'
            style={{
              width: '100%'
            }}
          >
            <Button
              size='large'
              type="primary"
              style={{
                width: pxTransform(windowHeight * 0.4),
                borderRadius: pxTransform(windowHeight * 0.05),
              }}
              {...(checkAgree ? {
                openType: 'getRealtimePhoneNumber|agreePrivacyAuthorization',
                onGetRealTimePhoneNumber: (realTimePhoneNumber) => {
                  console.log(realTimePhoneNumber.detail);
                  // 获取到手机号后处理登录逻辑
                  // dispatch(setLoginStatus(1))
                  // dispatch(userInfoAction({
                  //   type: 'set',
                  //   data: {
                  //     nickname: '杨柳依依',
                  //     avatar: "https://img12.360buyimg.com/imagetools/jfs/t1/143702/31/16654/116794/5fc6f541Edebf8a57/4138097748889987.png",
                  //   }
                  // }))
                }
              } : {})}
              onClick={() => {
                if (!checkAgree) {
                  setShowToast(true)
                  setToastState({
                    icon: 'error',
                    content: '请先同意用户协议',
                  })
                  return
                }
                // 用户已同意协议，但还需要点击获取手机号的微信弹窗
                // 当用户同意授权后会触发onGetRealTimePhoneNumber回调
              }}
            >
              手机号快捷登录
            </Button>
            <Button
              size='large'
              type="primary"
              fill='outline'
              style={{
                width: pxTransform(windowHeight * 0.4),
                borderRadius: pxTransform(windowHeight * 0.05),
              }}
              onClick={() => {
                setShowBottomPopup(false)
              }}
            >
              暂时跳过
            </Button>
          </Space>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Checkbox
              checked={checkAgree}
              onChange={(val) => {
                setCheckAgree(val)
                // 如果用户取消勾选，则关闭Toast提示
                if (!val && showToast) {
                  setShowToast(false)
                }
              }}
              style={{
                marginRight: pxTransform(windowHeight * 0.01),
              }}
            />
            <View
              style={{
                fontSize: pxTransform(windowHeight * 0.02),
              }}
            >
              <Text>允许我们在必要场景下，合理使用您的个人信息，且阅读并同意</Text>
              <Text
                style={{
                  color: '#1890ff',
                }}
              >
                《xxxx火锅用户协议》
              </Text>
            </View>
          </View>
        </View>
      </Popup>
      <Toast
        content={toastState.content}
        duration={toastState.duration}
        icon={toastState.icon}
        title={toastState.title}
        visible={showToast}
        onClose={() => {
          setShowToast(false)
        }}
      />
    </View>
  )
} 