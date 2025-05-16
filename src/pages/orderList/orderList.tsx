import { View, Text } from '@tarojs/components'
import { useLoad, getSystemInfoSync } from '@tarojs/taro'
import './orderList.scss'
import { useAppSelector } from '@/hooks/useAppStore'
import { Tabs, Image, Button, pxTransform, Empty, Cell, Tag } from '@nutui/nutui-react-taro'
import { ArrowRight } from '@nutui/icons-react-taro'
import { useState } from 'react'
import noOrderList from '@/assets/orderlist/noorderlist@2x.png'
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
  // useLoad(() => {
  //   console.log('OrderList page loaded.')
  // })

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
      <Tabs
        value={tabvalue}
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
                                  fontSize: pxTransform(windowHeight * 0.02),
                                }}
                              >{item.orderAddress}</Text>
                            </View>
                            <View
                              className='orderlist-item-top-right'
                            ></View>
                          </View>
                          <View
                            className='orderlist-item-middle'
                            style={{

                            }}
                          ></View>
                          <View
                            className='orderlist-item-bottom'
                            style={{

                            }}
                          ></View>
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
    </View>
  )
} 