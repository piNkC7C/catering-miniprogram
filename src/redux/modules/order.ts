import { createSlice } from '@reduxjs/toolkit'
import { IOrderState } from '../types/order'

const initialState: IOrderState = {
  cartList: [],
  orderTabsList: [],
  groupGoodsList: [],
  goodsCouponList: [],
  couponList: [],
  checkoutOrder: null,
  orderList: [],
  refundList: [],
  currentOrder: null,
  currentRefund: null,
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
          state.cartList = state.cartList.filter(item => item.commodityId !== data.commodityId)
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
    },
    setGroupGoodsListAction: (state, { payload: { type, data } }) => {
      switch (type) {
        case 'set':
          state.groupGoodsList = [...data]
          break
      }
    },
    setOrderListAction: (state, { payload: { type, data } }) => {
      switch (type) {
        case 'set':
          state.orderList = [...data]
          break
      }
    },
    setRefundListAction: (state, { payload: { type, data } }) => {
      switch (type) {
        case 'set':
          state.refundList = [...data]
          break
      }
    },
    setCurrentRefundAction: (state, { payload: { type, data } }) => {
      switch (type) {
        case 'set':
          state.currentRefund = data
          break
        case 'clear':
          state.currentRefund = null
          break
        default:
          break
      }
    },
  }
})

export const { setCartListAction, setCurrentOrderAction, setCheckoutOrderAction, setCheckoutOrderCouponAction, setOrderTabsListAction, setGroupGoodsListAction, setOrderListAction, setRefundListAction,setCurrentRefundAction } = orderSlice.actions
export default orderSlice.reducer
