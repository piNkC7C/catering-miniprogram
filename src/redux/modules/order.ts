import { createSlice } from '@reduxjs/toolkit'
import { IOrderState } from '../types/order'

const initialState: IOrderState = {
  cartList: Array.from({ length: 5 }, (_, index) => ({
    groupId: 1,
    goodsId: index + 1,
    goodsName: '原切前胸牛肉',
    goodsPrice: 39,
    goodsImage: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
    goodsCount: 1,
    isPackage: false,
    totalPrice: 39,
  })),
  orderList: [
    {
      orderId: 1,
      orderStatus: 1,
      tableNumber: 1,
      personNumber: 1,
      goodsList: Array.from({ length: 5 }, (_, index) => ({
        groupId: 1,
        goodsId: index + 1,
        goodsName: '原切前胸牛肉',
        goodsPrice: 39,
        goodsImage: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
        goodsCount: 1,
        isPackage: false,
        totalPrice: 39,
      })),
      isUseCoupon: false,
      couponList: [],
      totalCount: 5,
      totalPrice: 195,
      orderTag: '堂食',
      orderType: 1,
      shopName: '浙江某某某店',
    },
    {
      orderId: 2,
      orderStatus: 2,
      tableNumber: 1,
      personNumber: 1,
      goodsList: Array.from({ length: 5 }, (_, index) => ({
        groupId: 2,
        goodsId: index + 1,
        goodsName: '原切前胸牛肉',
        goodsPrice: 39,
        goodsImage: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
        goodsCount: 1,
        isPackage: false,
        totalPrice: 39,
      })),
      isUseCoupon: true,
      couponList: [{
        couponId: 1,
        couponName: '满100减10',
        couponTip:'仅限100家门店使用',
        couponDesc: '使用规则使用规则使用规则使用规则使用规则使用规则',
        couponPrice: 10,
        couponDiscount: 10,
        couponStatus: 2,
        couponStartTime: '2025-01-01',
        couponEndTime: '2025-01-01',
        couponTag: '仅限堂食',
        isExchange: false,
        exchangeStatus: null,
      }],
      totalCount: 5,
      totalPrice: 185,
      orderTag: '外卖',
      orderType: 2,
      shopName: '浙江某某某店',
    },
    {
      orderId: 3,
      orderStatus: 3,
      tableNumber: 1,
      personNumber: 1,
      goodsList: Array.from({ length: 5 }, (_, index) => ({
        groupId: 3,
        goodsId: index + 1,
        goodsName: '原切前胸牛肉',
        goodsPrice: 39,
        goodsImage: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
        goodsCount: 1,
        isPackage: false,
        totalPrice: 39,
      })),
      isUseCoupon: false,
      couponList: [],
      totalCount: 5,
      totalPrice: 195,
      orderTag: '商城',
      orderType: 3,
      shopName: '浙江某某某店',
    },
    {
      orderId: 4,
      orderStatus: 4,
      tableNumber: 1,
      personNumber: 1,
      goodsList: Array.from({ length: 5 }, (_, index) => ({
        groupId: 4,
        goodsId: index + 1,
        goodsName: '原切前胸牛肉',
        goodsPrice: 39,
        goodsImage: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
        goodsCount: 1,
        isPackage: false,
        totalPrice: 39,
      })),
      isUseCoupon: false,
      couponList: [],
      totalCount: 5,
      totalPrice: 195,
      orderTag: '堂食',
      orderType: 1,
      shopName: '浙江某某某店',
    }
  ],
  currentOrder: null,
  orderTabsList: [
    // {
    //   groupId: 0,
    //   groupName: '尊享商品券',
    // },
    // {
    //   groupId: 1,
    //   groupName: '专区',
    // },
    // {
    //   groupId: 2,
    //   groupName: '饮品',
    // },
    // {
    //   groupId: 3,
    //   groupName: '小吃',
    // },
    // {
    //   groupId: 4,
    //   groupName: '主食',
    // },
    // {
    //   groupId: 5,
    //   groupName: '甜品',
    // },
    // {
    //   groupId: 6,
    //   groupName: '酒水',
    // },
  ],
  groupGoodsList: [
    {
      groupId: 0,
      groupName: '尊享商品券(每件商品限用一张)',
      goodsList: [],
    },
    {
      groupId: 1,
      groupName: '专区',
      goodsList: [
        {
          goodsId: 1,
          goodsName: '原切前胸牛肉',
          goodsPrice: 39,
          goodsImage: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
          isPackage: false,
        },
        {
          goodsId: 2,
          goodsName: '原切前胸牛肉',
          goodsPrice: 39,
          goodsImage: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
          isPackage: false,
        },
        {
          goodsId: 3,
          goodsName: '原切前胸牛肉',
          goodsPrice: 39,
          goodsImage: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
          isPackage: false,
        }
      ],
    },
    {
      groupId: 2,
      groupName: '饮品',
      goodsList: [
        {
          goodsId: 4,
          goodsName: '原切前胸牛肉',
          goodsPrice: 39,
          goodsImage: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
          isPackage: false,
        },
        {
          goodsId: 5,
          goodsName: '原切前胸牛肉',
          goodsPrice: 39,
          goodsImage: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
          isPackage: false,
        }
      ],
    },
    {
      groupId: 3,
      groupName: '小吃',
      goodsList: [
        {
          goodsId: 6,
          goodsName: '原切前胸牛肉',
          goodsPrice: 39,
          goodsImage: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
          isPackage: false,
        },
        {
          goodsId: 7,
          goodsName: '原切前胸牛肉',
          goodsPrice: 39,
          goodsImage: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
          isPackage: false,
        }
      ],
    },
    {
      groupId: 4,
      groupName: '主食',
      goodsList: [
        {
          goodsId: 8,
          goodsName: '原切前胸牛肉',
          goodsPrice: 39,
          goodsImage: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
          isPackage: false,
        },
        {
          goodsId: 9,
          goodsName: '原切前胸牛肉',
          goodsPrice: 39,
          goodsImage: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
          isPackage: false,
        }
      ],
    },
    {
      groupId: 5,
      groupName: '甜品',
      goodsList: [
        {
          goodsId: 10,
          goodsName: '原切前胸牛肉',
          goodsPrice: 39,
          goodsImage: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
          isPackage: false,
        },
        {
          goodsId: 11,
          goodsName: '原切前胸牛肉',
          goodsPrice: 39,
          goodsImage: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
          isPackage: false,
        },
        {
          goodsId: 12,
          goodsName: '原切前胸牛肉',
          goodsPrice: 39,
          goodsImage: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
          isPackage: false,
        },
        {
          goodsId: 13,
          goodsName: '原切前胸牛肉',
          goodsPrice: 39,
          goodsImage: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
          isPackage: false,
        }
      ],
    },
    {
      groupId: 6,
      groupName: '酒水',
      goodsList: [
        {
          goodsId: 14,
          goodsName: '原切前胸牛肉',
          goodsPrice: 39,
          goodsImage: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
          isPackage: false,
        },
        {
          goodsId: 15,
          goodsName: '原切前胸牛肉',
          goodsPrice: 39,
          goodsImage: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
          isPackage: false,
        },
        {
          goodsId: 16,
          goodsName: '原切前胸牛肉',
          goodsPrice: 39,
          goodsImage: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
          isPackage: false,
        },
        {
          goodsId: 17,
          goodsName: '原切前胸牛肉',
          goodsPrice: 39,
          goodsImage: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
          isPackage: false,
        },
        {
          goodsId: 18,
          goodsName: '原切前胸牛肉',
          goodsPrice: 39,
          goodsImage: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
          isPackage: false,
        },
        {
          goodsId: 19,
          goodsName: '原切前胸牛肉',
          goodsPrice: 39,
          goodsImage: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
          isPackage: false,
        },
        {
          goodsId: 20,
          goodsName: '原切前胸牛肉',
          goodsPrice: 39,
          goodsImage: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
          isPackage: false,
        }
      ],
    },
  ],
  goodsCouponList: [
    {
      goodsCouponId: 1,
      goodsCouponName: '当家肥牛套餐',
      goodsCouponImage: 'https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
      goodsCouponDesc: '使用规则使用规则使用规则使用规则使用规则使用规则',
      goodsCouponStatus: 1,
      goodsCouponStartTime: '2025-01-01',
      goodsCouponEndTime: '2025-01-01',
    }
  ],
  couponList: [
    {
      couponId: 1,
      couponName: '满100减10',
      couponTip:'仅限100家门店使用',
      couponDesc: '使用规则使用规则使用规则使用规则使用规则使用规则',
      couponPrice: 100,
      couponDiscount: 10,
      couponStatus: 1,
      couponStartTime: '2025-01-01',
      couponEndTime: '2025-01-01',
      couponTag: '仅限堂食',
      isExchange: false,
      exchangeStatus: null,
    },
    {
      couponId: 2,
      couponName: '满100减10',
      couponTip:'仅限100家门店使用',
      couponDesc: '使用规则使用规则使用规则使用规则使用规则使用规则',
      couponPrice: 100,
      couponDiscount: 10,
      couponStatus: 1,
      couponStartTime: '2025-01-01',
      couponEndTime: '2025-01-01',
      couponTag: '仅限堂食',
      isExchange: false,
      exchangeStatus: null,
    }
  ],
  // checkoutOrder: null,
  checkoutOrder: {
    checkoutOrderId: 1,
    checkoutOrderCouponedPrice: 100,
    checkoutOrderTotalPrice: 100,
    checkoutOrderTotalCount: 1,
    checkoutOrderType: 1,
    checkoutOrderTableNumber: 1,
    checkoutOrderPersonNumber: 1,
    isUseCoupon: true,
    couponList: [],
    goodsList: [],
  },
}

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setCartListAction: (state, { payload: { type, data } }) => {
      switch (type) {
        case 'set':
          state.cartList = [...data]
          break
        case 'add':
          state.cartList.push(data)
          break
        case 'remove':
          state.cartList = state.cartList.filter(item => item.goodsId !== data.goodsId)
          break
        case 'clear':
          state.cartList = []
          break
        default:
          break
      }
    },
    setCurrentOrderAction: (state, { payload: { type, data } }) => {
      switch (type) {
        case 'set':
          state.currentOrder = data
          break
        case 'clear':
          state.currentOrder = null
          break
        default:
          break
      }
    },
    setCheckoutOrderAction: (state, { payload: { type, data } }) => {
      switch (type) {
        case 'set':
          state.checkoutOrder = data
          break
        case 'clear':
          state.checkoutOrder = null
          break
        default:
          break
      }
    },
    setCheckoutOrderCouponAction: (state, { payload: { type, data } }) => {
      if (!state.checkoutOrder) return
      switch (type) {
        case 'set':
          state.checkoutOrder.couponList = [...data]
          break
        case 'clear':
          state.checkoutOrder.couponList = []
          break
        default:
          break
      }
    },
    setOrderTabsListAction: (state, { payload: { type, data } }) => {
      switch (type) {
        case 'set':
          state.orderTabsList = [...data]
          break
      }
    }
  }
})

export const { setCartListAction, setCurrentOrderAction, setCheckoutOrderAction, setCheckoutOrderCouponAction, setOrderTabsListAction } = orderSlice.actions
export default orderSlice.reducer
