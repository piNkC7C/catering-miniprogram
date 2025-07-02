import { View, Text, ScrollView } from '@tarojs/components'
import { useLoad, getSystemInfoSync, getMenuButtonBoundingClientRect, navigateBack, getCurrentPages, showToast, useRouter } from '@tarojs/taro'
import './choose.scss'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { setCartListAction } from '@/redux/modules/order'
import { pxTransform, Divider, Grid, Image, Badge, ConfigProvider, Price, InputNumber, Button } from '@nutui/nutui-react-taro'
import { Check } from '@nutui/icons-react-taro'
import { useEffect, useState } from 'react'
import { IGoodItem } from './type'
import { chooseBack } from '@/utils/constants'
import { getSetGoodDetailAPI, addCartGoodAPI, getCartListAPI } from '@/api/order'
import { IResponseApi } from '@/api/type'
import { ICartRequest } from '@/redux/types/order'

export default function Choose() {
  // 获取登录状态和用户信息
  const {
    order: {
      cartList,
    },
    address: {
      currentShop,
    },
    login: {
      tableInfo,
      userInfo
    }
  } = useAppSelector((state) => state)
  const dispatch = useAppDispatch()
  const { id } = useRouter().params

  useEffect(() => {
    if (id) {
      getSetGoodDetailAPI({ id }, (res) => {
        if (res.success) {
          console.log('res', res)
          setAllSelectedAddOneGood(res.data.mealSetOptionalGroupInfoList)
          setSelectedIncludeGood(res.data.mealSpecificationInfoList)
          setSetGoodDetail(res.data)
          setGoodCount(res.data.minimumPurchaseQuantity)
          setGoodPrice(res.data.setStandardPrice)
        }
      })
    }
  }, [])
  // useLoad(() => {
  //   console.log('OrderList page loaded.')
  // })

  // 套餐详情
  const [setGoodDetail, setSetGoodDetail] = useState<any>(null)

  // 已包含商品
  const [selectedIncludeGood, setSelectedIncludeGood] = useState<any[]>([])

  // 选择的加一商品
  const [allSelectedAddOneGood, setAllSelectedAddOneGood] = useState<any[]>([])
  const [selectedAddOneGood, setSelectedAddOneGood] = useState<any[]>([])

  // 商品价格
  const [goodPrice, setGoodPrice] = useState<number>(0)
  // 商品数量
  const [goodCount, setGoodCount] = useState<number>(0)

  // 商品列表
  const gridItem = (listItem: any, index: number, max: number | null, total: number, groupId: number) => {
    return (
      <Grid.Item
        key={listItem.id}
        text={
          (<>
            <View
              style={{
                textAlign: 'center',
                marginBottom: '5px'
              }}
            >
              {listItem.mealName}
              {/* &nbsp;&nbsp;x{listItem.specificationQuantity} */}
            </View>
            <InputNumber
              readOnly
              defaultValue={0}
              disabled={total - selectedAddOneGood.filter((item: any) => item.groupId === groupId).reduce((acc, item) => acc + item.goodsCount, 0) == 0 && selectedAddOneGood.every((item) => {
                return item.id !== listItem.id
              })}
              value={selectedAddOneGood.find((item: any) => item.id === listItem.id)?.goodsCount || 0}
              max={max || total - selectedAddOneGood.filter((item: any) => item.groupId === groupId).reduce((acc, item) => acc + item.goodsCount, 0)}
              min={0}
              allowEmpty
              onChange={(value) => {
                const count = Number(value)
                if (count === 0) {
                  setSelectedAddOneGood(selectedAddOneGood.filter((item: any) => item.id !== listItem.id))
                } else {
                  if (selectedAddOneGood.some((item: any) => item.id === listItem.id)) {
                    setSelectedAddOneGood(selectedAddOneGood.map((item: any) => item.id === listItem.id ? { ...item, goodsCount: count } : item))
                  } else {
                    const cartData = {
                      id: listItem.id,
                      mealId: listItem.mealId,
                      mealName: listItem.mealName,
                      mealImage: listItem.mealImage,
                      goodsCount: count,
                      groupId: groupId,
                    }
                    setSelectedAddOneGood([...selectedAddOneGood, { ...cartData }])
                  }
                  // console.log(selectedAddOneGood, 'selectedAddOneGood');
                }
              }}
            />
          </>)
        }
        style={{
          position: 'relative',
          boxShadow: '0px 0px 7px 0px rgba(0,0,0,0.15)',
          borderRadius: pxTransform(viewHeight * 0.01),
          border: 'none',
        }}
      // onClick={() => {
      //   setSelectedAddOneGood(listItem)
      // }}
      >
        {/* <Badge
          value={<Check color="#fff" />}
          size="large"
          style={{
            display: selectedAddOneGood.some((item: any) => item.id === listItem.id) ? 'block' : 'none',
            position: 'absolute',
            top: 8,
            right: 8,
          }}
        /> */}
        <Image
          src={listItem.mealImage}
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
          src={selectedIncludeGood?.[0]?.mealImage}
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
            {setGoodDetail?.mealSetName}
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
              {
                selectedIncludeGood.map((item: any) => (
                  <Grid.Item
                    key={item.id}
                    text={item.mealName}
                    style={{
                      position: 'relative',
                      boxShadow: '0px 0px 7px 0px rgba(0,0,0,0.15)',
                      borderRadius: pxTransform(viewHeight * 0.01),
                      border: 'none',
                    }}
                  >
                    <Image
                      src={item.mealImage}
                    />
                  </Grid.Item>
                ))
              }
            </Grid>
            <Divider />
          </View>
          {
            allSelectedAddOneGood.map((groupItem) => (
              <View className='body-content-item'>
                <View
                  className='body-content-item-title'
                  style={{
                    marginBottom: pxTransform(viewHeight * 0.02),
                  }}
                >
                  <Text>{groupItem?.mealQuantity}选{groupItem?.mealOptionalQuantity}</Text>
                </View>
                <Grid columns={3} gap={7}>
                  {groupItem?.mealSpecificationInfoList.map((listItem, index) => (
                    gridItem(listItem, index, groupItem.canRepeated == 0 ? 1 : null, groupItem.mealOptionalQuantity, groupItem.id)
                  ))}
                </Grid>
              </View>
            ))
          }
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
                color: goodCount == setGoodDetail?.minimumPurchaseQuantity ? '#999' : '#d61518',
              }}
              onClick={() => {
                if (goodCount == setGoodDetail?.minimumPurchaseQuantity) {
                  return
                } else {
                  setGoodCount(goodCount - 1)
                }
              }}
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
                color: goodCount >= setGoodDetail?.purchaseQuantityLimit || goodCount >= setGoodDetail?.mealQuantity ? '#999' : '#d61518',
              }}
              onClick={() => {
                if (goodCount >= setGoodDetail?.purchaseQuantityLimit || goodCount >= setGoodDetail?.mealQuantity) {
                  return
                } else {
                  setGoodCount(goodCount + 1)
                }
              }}
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
              // 回复默认起购数量
              setGoodCount(setGoodDetail?.minimumPurchaseQuantity)
              // 清空选择的加一商品
              setSelectedAddOneGood([])
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
              // console.log(selectedIncludeGood, '999');
              // console.log(selectedAddOneGood, '888');
              // if (!currentShop) {
              //   showToast({
              //     title: '请先选择门店',
              //     icon: 'none',
              //   })
              //   return
              // }
              // if (!tableInfo) {
              //   showToast({
              //     title: '请先扫桌码',
              //     icon: 'none',
              //   })
              //   return
              // }
              if (selectedAddOneGood.length == 0 && allSelectedAddOneGood.length > 0) {
                showToast({
                  title: '请至少选择一款商品',
                  icon: 'none',
                })
                return
              }
              const groupedByCategory = allSelectedAddOneGood.map((item: any) => {
                return {
                  id: item.id,
                  mealOptionalQuantity: item.mealOptionalQuantity,
                }
              })
              // 检查数组1中是否有数组2中没有的数据
              const hasUnselectedGroup = groupedByCategory.some((groupId: any) =>
                !selectedAddOneGood.some((selected: any) => selected.groupId === groupId.id) || selectedAddOneGood.filter((selected: any) => selected.groupId === groupId.id).reduce((acc, item) => acc + item.goodsCount, 0) < groupId.mealOptionalQuantity
              )

              if (hasUnselectedGroup) {
                showToast({
                  title: '请完成所有商品选择',
                  icon: 'none',
                })
                return
              }
              const queryData = {
                "commodityId": setGoodDetail?.id,
                "count": goodCount,
                "isSet": true,
                "isAdd": true,
                "deskId": tableInfo?.tableId || 0,
                "shopId": currentShop?.shopId!,
                "openId": userInfo?.openid!,
                "classificationId": setGoodDetail?.classificationId,
                "minimumPurchaseQuantity": setGoodDetail?.minimumPurchaseQuantity,
                "purchaseQuantityLimit": setGoodDetail?.purchaseQuantityLimit,
                "standardPrice": setGoodDetail?.standardPrice,
                "mealQuantity": setGoodDetail?.mealQuantity,
                "cartModifyReqVOList": selectedAddOneGood.map((item: any) => {
                  return {
                    "commodityId": item.mealId,
                    "count": item.goodsCount,
                  }
                }),
              } as ICartRequest
              addCartGoodAPI(queryData, (res) => {
                if (res.success && res.data) {
                  showToast({
                    title: '添加成功',
                    icon: 'success',
                  })
                  getCartListAPI({
                    "deskId": tableInfo?.tableId || 0,
                    "shopId": currentShop?.shopId!,
                    "openId": userInfo?.openid!,
                  }, (res: IResponseApi<any>) => {
                    if (res.success) {
                      dispatch(setCartListAction({
                        type: 'set',
                        data: res.data
                      }))
                      navigateBack()
                    }
                  })
                }
              })
              // if (selectedAddOneGood.length > 0) {
              //   console.log('selectedAddOneGood', selectedAddOneGood)
              //   navigateBack()
              // } else {
              //   showToast({
              //     title: '请至少选择一款商品',
              //     icon: 'none',
              //   })
              // }
            }}
          >加入购物袋</Button>
        </View>
      </View>
    </View>
  )
} 