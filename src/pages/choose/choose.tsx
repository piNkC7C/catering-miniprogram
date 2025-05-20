import { View, Text, ScrollView } from '@tarojs/components'
import { useLoad, getSystemInfoSync, getMenuButtonBoundingClientRect, navigateBack, getCurrentPages, showToast } from '@tarojs/taro'
import './choose.scss'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { setCartListAction } from '@/redux/modules/order'
import { pxTransform, Divider, Grid, Image, Badge, ConfigProvider, Price, InputNumber, Button } from '@nutui/nutui-react-taro'
import { Check } from '@nutui/icons-react-taro'
import { useState } from 'react'
import { IGoodItem } from './type'
import chooseBack from '@/assets/choose/choose-back.png'

export default function Choose() {
  // 获取登录状态和用户信息
  const {
    login: {
      loginStatus,
      userInfo
    },
    order: {
      cartList
    }
  } = useAppSelector((state) => state)
  const dispatch = useAppDispatch()
  // useLoad(() => {
  //   console.log('OrderList page loaded.')
  // })

  // 已包含商品
  const [selectedIncludeGood, setSelectedIncludeGood] = useState<IGoodItem | null>({
    id: 1,
    title: '原切前胸牛肉',
    image: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
    price: 39,
    count: 1,
  })

  // 选择的加一商品
  const [selectedAddOneGood, setSelectedAddOneGood] = useState<IGoodItem | null>(null)

  // 商品价格
  const [goodPrice, setGoodPrice] = useState<number>(39)
  // 商品数量
  const [goodCount, setGoodCount] = useState<number>(1)

  // 商品列表
  const gridItem = (listItem: any, index: number) => {
    return (
      <Grid.Item
        key={index}
        text={<Text>{listItem.title}&nbsp;&nbsp;x1</Text>
        }
        style={{
          position: 'relative',
          boxShadow: '0px 0px 7px 0px rgba(0,0,0,0.15)',
          borderRadius: pxTransform(viewHeight * 0.01),
          border: selectedAddOneGood?.id === listItem.id ? '1px solid #D61518' : 'none',
        }}
        onClick={() => {
          setSelectedAddOneGood(listItem)
        }}
      >
        <Badge
          value={<Check color="#fff" />}
          size="large"
          style={{
            display: selectedAddOneGood?.id === listItem.id ? 'block' : 'none',
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
  const { top: topMenuButton, height: heightMenuButton, left: leftMenuButton, width: widthMenuButton } = getMenuButtonBoundingClientRect()
  // 导航栏高度 = 胶囊按钮顶部位置 + (胶囊按钮高度 + 两边距离和)/2
  const navBarHeight = (topMenuButton - finalStatusBarHeight) * 2 + heightMenuButton
  // 总高度
  const navHeight = finalStatusBarHeight + navBarHeight + 5
  // 获取可视区域高度
  const viewHeight = windowHeight - navHeight

  // 滑动高度
  const [scrollYTop, setScrollYTop] = useState<number>(windowHeight * 0.5 - navHeight)

  // 定义一个平滑滚动函数
  function smoothScrollTo(target: number, duration = 300) {
    const start = scrollYTop;
    const change = target - start;
    const startTime = Date.now();

    // 缓动函数
    function easeInOutQuad(t: number) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    function animate() {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutQuad(progress);
      const next = start + change * eased;

      setScrollYTop(next);

      if (progress < 1) {
        setTimeout(animate, 16); // 16ms 一帧
      } else {
        setScrollYTop(target); // 最终确保到位
      }
    }
    animate();
  }

  return (
    <View
      className='choose-detail-page'
      style={{
        height: `${windowHeight}px`,
        width: `${windowWidth}px`,
      }}
    >
      <View
        className='header-back'
        style={{
          top: topMenuButton,
          left: windowWidth - leftMenuButton - widthMenuButton,
          width: heightMenuButton,
          height: heightMenuButton,
        }}
        onClick={() => {
          // const pages = getCurrentPages()
          // console.log(pages)
          navigateBack()
        }}
      >
        <Image
          src={chooseBack}
          mode='scaleToFill'
          style={{
            width: heightMenuButton,
            height: heightMenuButton,
          }}
        />
      </View>
      <View
        className='header'
        style={{
          height: `${windowHeight}px`,
        }}
      >
        <Image
          src={selectedIncludeGood?.image}
          mode='widthFix'
          style={{
            width: windowWidth,
          }}
        />
      </View>
      <ScrollView
        scrollTop={scrollYTop}
        className='body'
        style={{
          height: `${windowHeight}px`,
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
          <View className='body-content-item'>
            <View
              className='body-content-item-title'
              style={{
                marginBottom: pxTransform(viewHeight * 0.02),
              }}
            >
              <Text>已包含</Text>
            </View>
            <Grid columns={3} gap={7}>
              <Grid.Item
                text={selectedIncludeGood?.title}
                style={{
                  position: 'relative',
                  boxShadow: '0px 0px 7px 0px rgba(0,0,0,0.15)',
                  borderRadius: pxTransform(viewHeight * 0.01),
                  border: 'none',
                }}
              >
                <Image
                  src={selectedIncludeGood?.image}
                />
              </Grid.Item>
            </Grid>
            <Divider />
          </View>
          <View className='body-content-item'>
            <View
              className='body-content-item-title'
              style={{
                marginBottom: pxTransform(viewHeight * 0.02),
              }}
            >
              <Text>选择你加1，我送1商品</Text>
            </View>
            <Grid columns={3} gap={7}>
              {[
                {
                  id: 1,
                  title: '原切前胸牛肉',
                  image: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
                  price: 39
                },
                {
                  id: 2,
                  title: '原切前胸牛肉',
                  image: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
                  price: 39
                },
                {
                  id: 3,
                  title: '原切前胸牛肉',
                  image: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
                  price: 39
                },
                {
                  id: 4,
                  title: '原切前胸牛肉',
                  image: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
                  price: 39
                },
                {
                  id: 5,
                  title: '原切前胸牛肉',
                  image: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
                  price: 39
                },
                {
                  id: 6,
                  title: '原切前胸牛肉',
                  image: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
                  price: 39
                },
                {
                  id: 7,
                  title: '原切前胸牛肉',
                  image: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
                  price: 39
                },
                {
                  id: 8,
                  title: '原切前胸牛肉',
                  image: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
                  price: 39
                },
                {
                  id: 9,
                  title: '原切前胸牛肉',
                  image: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
                  price: 39
                },
              ].map((listItem, index) => (
                gridItem(listItem, index)
              ))}
            </Grid>
          </View>
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
          padding: `${pxTransform(viewHeight * 0.02)} ${pxTransform(windowWidth * 0.05)} ${pxTransform(viewHeight * 0.035)}`,
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
              fontSize: pxTransform(viewHeight * 0.03),
            }}
          >
            <View
              className="custom-btn minus"
              style={{
                width: pxTransform(windowWidth * 0.0848),
                height: pxTransform(viewHeight * 0.036),
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
              }}
              onClick={() => setGoodCount(goodCount + 1)}
            >+</View>
          </View>
        </View>
        <View
          className='body-footer-bottom'
        >
          <Button
            className='body-footer-bottom-button'
            style={{
              width: pxTransform(windowWidth * 0.25),
              borderRadius: pxTransform(20),
              '--nutui-button-default-height': pxTransform(viewHeight * 0.05),
            } as any}
            onClick={() => {
              if (scrollYTop === 0) {
                smoothScrollTo(windowHeight * 0.5 - navHeight, 200)
              } else {
                smoothScrollTo(0, 200)
              }
              setSelectedAddOneGood(null)
            }}
          >恢复默认</Button>
          <Button
            className='body-footer-bottom-button'
            style={{
              width: pxTransform(windowWidth * 0.6),
              borderRadius: pxTransform(20),
              fontSize: pxTransform(viewHeight * 0.02),
              '--nutui-button-default-background-color': '#D61518',
              '--nutui-button-default-color': '#fff',
              '--nutui-button-default-height': pxTransform(viewHeight * 0.05),
            } as any}
            onClick={() => {
              if (selectedAddOneGood) {
                dispatch(setCartListAction({
                  type: 'add', data: {
                    id: selectedIncludeGood?.id,
                    title: selectedIncludeGood?.title,
                    count: 1,
                    image: selectedIncludeGood?.image,
                    price: selectedIncludeGood?.price,
                    detail: true,
                    detailList: [
                      {
                        id: selectedIncludeGood?.id,
                        title: selectedIncludeGood?.title,
                        count: 1,
                        image: selectedIncludeGood?.image,
                        price: selectedIncludeGood?.price,
                      },
                      {
                        id: selectedAddOneGood.id,
                        title: selectedAddOneGood.title,
                        count: 1,
                        image: selectedAddOneGood.image,
                        price: selectedAddOneGood.price,
                      },
                    ],
                  }
                }))
                navigateBack()
              } else {
                showToast({
                  title: '请选择一款你加一我送一的商品',
                  icon: 'none',
                })
              }
            }}
          >加入购物袋</Button>
        </View>
      </View>
    </View>
  )
} 