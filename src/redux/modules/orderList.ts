import { createSlice } from '@reduxjs/toolkit'
import { IOrderListState } from '../types/orderList'

const initialState: IOrderListState = {
  orderListData: [
    {
      orderId: '1234567890',
      orderTime: '2021-01-01 12:00:00',
      orderStatus: 0,
      orderPayPrice: 100,
      orderType: 'shop',
      orderPayType: '微信支付',
      orderPayTime: '2021-01-01 12:00:00',
      orderAddress: '浙江某某某店',
      orderTag: '堂食',
    }
  ]
}

const orderListSlice = createSlice({
  name: 'orderList',
  initialState,
  reducers: {
    setOrderListData: (state, { payload: { type, data } }) => {
      switch (type) {
        case 'set':
          state.orderListData = data
          break
        case 'delete':
          state.orderListData = []
          break
      }
      return state
    }
  }
})

export const { setOrderListData } = orderListSlice.actions
export default orderListSlice.reducer
