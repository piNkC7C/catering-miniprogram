import { createSlice } from '@reduxjs/toolkit'
import { IOrderListState } from '../types/orderList'

const initialState: IOrderListState = {
  orderListData: []
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
