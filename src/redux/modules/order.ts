import { createSlice } from '@reduxjs/toolkit'
import { IOrderState } from '../types/order'

const initialState: IOrderState = {
  cartList: [
    // {
    //   id: 1,
    //   title: '原切前胸牛肉',
    //   count: 1,
    //   image: 'https://img.yzcdn.cn/vant/ipad.png',
    //   price: 39,
    //   detail: true,
    //   detailList: [
    //     {
    //       id: 1,
    //       title: '原切前胸牛肉',
    //       count: 1,
    //       image: 'https://img.yzcdn.cn/vant/ipad.png',
    //       price: 39,
    //     },
    //     {
    //       id: 1,
    //       title: '原切前胸牛肉',
    //       count: 1,
    //       image: 'https://img.yzcdn.cn/vant/ipad.png',
    //       price: 39,
    //     },
    //   ],
    // }
  ]
}

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setCartListAction: (state, { payload:{type, data} }) => {
      switch(type){
        case 'set':
          state.cartList = [...data]
          break
        case 'add':
          state.cartList.push(data)
          break
        case 'remove':
          state.cartList = state.cartList.filter(item => item.id !== data.id)
          break
        case 'clear':
          state.cartList = []
          break
        default:
          break
      }
    }
  }
})

export const { setCartListAction } = orderSlice.actions
export default orderSlice.reducer
