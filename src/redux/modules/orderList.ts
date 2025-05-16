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
          // state.orderListData = data
          if (data !== 'all') {
            state.orderListData = []
          } else {
            state.orderListData = [
              {
                orderId: '1234567890',
                orderTime: '2021-01-01 12:00:00',
                orderStatus: 0,
                orderPayPrice: 100,
                orderCount: 1,
                orderType: 'shop',
                orderPayType: '微信支付',
                orderPayTime: '2021-01-01 12:00:00',
                orderAddress: '浙江某某某店',
                orderTag: '堂食',
                orderTable: 1,
                orderGoodsList: [
                  {
                    goodsId: '1234567890',
                    goodsName: '商品名称商品名称商品名称商品名称商品名称商品名称商品名称',
                    goodsImage: 'https://qcloud.dpfile.com/pc/r5-BQG0B__mHiVZlmeOE7JvJcEMiGt6XcVjKhW83Gbf2y5o8aoN_P8m9D9Q8eeWh.jpg'
                  },
                  {
                    goodsId: '1234567890',
                    goodsName: '商品名称',
                    goodsImage: 'https://qcloud.dpfile.com/pc/r5-BQG0B__mHiVZlmeOE7JvJcEMiGt6XcVjKhW83Gbf2y5o8aoN_P8m9D9Q8eeWh.jpg'
                  },
                  {
                    goodsId: '1234567890',
                    goodsName: '商品名称',
                    goodsImage: 'https://qcloud.dpfile.com/pc/r5-BQG0B__mHiVZlmeOE7JvJcEMiGt6XcVjKhW83Gbf2y5o8aoN_P8m9D9Q8eeWh.jpg'
                  },
                  {
                    goodsId: '1234567890',
                    goodsName: '商品名称',
                    goodsImage: 'https://qcloud.dpfile.com/pc/r5-BQG0B__mHiVZlmeOE7JvJcEMiGt6XcVjKhW83Gbf2y5o8aoN_P8m9D9Q8eeWh.jpg'
                  },
                  {
                    goodsId: '1234567890',
                    goodsName: '商品名称',
                    goodsImage: 'https://qcloud.dpfile.com/pc/r5-BQG0B__mHiVZlmeOE7JvJcEMiGt6XcVjKhW83Gbf2y5o8aoN_P8m9D9Q8eeWh.jpg'
                  },
                  {
                    goodsId: '1234567890',
                    goodsName: '商品名称',
                    goodsImage: 'https://qcloud.dpfile.com/pc/r5-BQG0B__mHiVZlmeOE7JvJcEMiGt6XcVjKhW83Gbf2y5o8aoN_P8m9D9Q8eeWh.jpg'
                  }
                ]
              },
              {
                orderId: '1234567890',
                orderTime: '2021-01-01 12:00:00',
                orderStatus: 1,
                orderPayPrice: 100,
                orderCount: 1,
                orderType: 'shop',
                orderPayType: '微信支付',
                orderPayTime: '2021-01-01 12:00:00',
                orderAddress: '浙江某某某店',
                orderTag: '堂食',
                orderTable: 1,
                orderGoodsList: [
                  {
                    goodsId: '1234567890',
                    goodsName: '商品名称商品名称商品名称商品名称商品名称商品名称商品名称',
                    goodsImage: 'https://qcloud.dpfile.com/pc/r5-BQG0B__mHiVZlmeOE7JvJcEMiGt6XcVjKhW83Gbf2y5o8aoN_P8m9D9Q8eeWh.jpg'
                  },
                  {
                    goodsId: '1234567890',
                    goodsName: '商品名称',
                    goodsImage: 'https://qcloud.dpfile.com/pc/r5-BQG0B__mHiVZlmeOE7JvJcEMiGt6XcVjKhW83Gbf2y5o8aoN_P8m9D9Q8eeWh.jpg'
                  },
                  {
                    goodsId: '1234567890',
                    goodsName: '商品名称',
                    goodsImage: 'https://qcloud.dpfile.com/pc/r5-BQG0B__mHiVZlmeOE7JvJcEMiGt6XcVjKhW83Gbf2y5o8aoN_P8m9D9Q8eeWh.jpg'
                  },
                  {
                    goodsId: '1234567890',
                    goodsName: '商品名称',
                    goodsImage: 'https://qcloud.dpfile.com/pc/r5-BQG0B__mHiVZlmeOE7JvJcEMiGt6XcVjKhW83Gbf2y5o8aoN_P8m9D9Q8eeWh.jpg'
                  },
                  {
                    goodsId: '1234567890',
                    goodsName: '商品名称',
                    goodsImage: 'https://qcloud.dpfile.com/pc/r5-BQG0B__mHiVZlmeOE7JvJcEMiGt6XcVjKhW83Gbf2y5o8aoN_P8m9D9Q8eeWh.jpg'
                  },
                  {
                    goodsId: '1234567890',
                    goodsName: '商品名称',
                    goodsImage: 'https://qcloud.dpfile.com/pc/r5-BQG0B__mHiVZlmeOE7JvJcEMiGt6XcVjKhW83Gbf2y5o8aoN_P8m9D9Q8eeWh.jpg'
                  }
                ]
              },
              {
                orderId: '1234567890',
                orderTime: '2021-01-01 12:00:00',
                orderStatus: 2,
                orderPayPrice: 100,
                orderCount: 1,
                orderType: 'shop',
                orderPayType: '微信支付',
                orderPayTime: '2021-01-01 12:00:00',
                orderAddress: '浙江某某某店',
                orderTag: '堂食',
                orderTable: 1,
                orderGoodsList: [
                  {
                    goodsId: '1234567890',
                    goodsName: '商品名称商品名称商品名称商品名称商品名称商品名称商品名称',
                    goodsImage: 'https://qcloud.dpfile.com/pc/r5-BQG0B__mHiVZlmeOE7JvJcEMiGt6XcVjKhW83Gbf2y5o8aoN_P8m9D9Q8eeWh.jpg'
                  },
                  {
                    goodsId: '1234567890',
                    goodsName: '商品名称',
                    goodsImage: 'https://qcloud.dpfile.com/pc/r5-BQG0B__mHiVZlmeOE7JvJcEMiGt6XcVjKhW83Gbf2y5o8aoN_P8m9D9Q8eeWh.jpg'
                  },
                  {
                    goodsId: '1234567890',
                    goodsName: '商品名称',
                    goodsImage: 'https://qcloud.dpfile.com/pc/r5-BQG0B__mHiVZlmeOE7JvJcEMiGt6XcVjKhW83Gbf2y5o8aoN_P8m9D9Q8eeWh.jpg'
                  },
                  {
                    goodsId: '1234567890',
                    goodsName: '商品名称',
                    goodsImage: 'https://qcloud.dpfile.com/pc/r5-BQG0B__mHiVZlmeOE7JvJcEMiGt6XcVjKhW83Gbf2y5o8aoN_P8m9D9Q8eeWh.jpg'
                  },
                  {
                    goodsId: '1234567890',
                    goodsName: '商品名称',
                    goodsImage: 'https://qcloud.dpfile.com/pc/r5-BQG0B__mHiVZlmeOE7JvJcEMiGt6XcVjKhW83Gbf2y5o8aoN_P8m9D9Q8eeWh.jpg'
                  },
                  {
                    goodsId: '1234567890',
                    goodsName: '商品名称',
                    goodsImage: 'https://qcloud.dpfile.com/pc/r5-BQG0B__mHiVZlmeOE7JvJcEMiGt6XcVjKhW83Gbf2y5o8aoN_P8m9D9Q8eeWh.jpg'
                  }
                ]
              },
              {
                orderId: '1234567890',
                orderTime: '2021-01-01 12:00:00',
                orderStatus: 3,
                orderPayPrice: 100,
                orderCount: 1,
                orderType: 'shop',
                orderPayType: '微信支付',
                orderPayTime: '2021-01-01 12:00:00',
                orderAddress: '浙江某某某店',
                orderTag: '堂食',
                orderTable: 1,
                orderGoodsList: [
                  {
                    goodsId: '1234567890',
                    goodsName: '商品名称商品名称商品名称商品名称商品名称商品名称商品名称',
                    goodsImage: 'https://qcloud.dpfile.com/pc/r5-BQG0B__mHiVZlmeOE7JvJcEMiGt6XcVjKhW83Gbf2y5o8aoN_P8m9D9Q8eeWh.jpg'
                  },
                  {
                    goodsId: '1234567890',
                    goodsName: '商品名称',
                    goodsImage: 'https://qcloud.dpfile.com/pc/r5-BQG0B__mHiVZlmeOE7JvJcEMiGt6XcVjKhW83Gbf2y5o8aoN_P8m9D9Q8eeWh.jpg'
                  },
                  {
                    goodsId: '1234567890',
                    goodsName: '商品名称',
                    goodsImage: 'https://qcloud.dpfile.com/pc/r5-BQG0B__mHiVZlmeOE7JvJcEMiGt6XcVjKhW83Gbf2y5o8aoN_P8m9D9Q8eeWh.jpg'
                  },
                  {
                    goodsId: '1234567890',
                    goodsName: '商品名称',
                    goodsImage: 'https://qcloud.dpfile.com/pc/r5-BQG0B__mHiVZlmeOE7JvJcEMiGt6XcVjKhW83Gbf2y5o8aoN_P8m9D9Q8eeWh.jpg'
                  },
                  {
                    goodsId: '1234567890',
                    goodsName: '商品名称',
                    goodsImage: 'https://qcloud.dpfile.com/pc/r5-BQG0B__mHiVZlmeOE7JvJcEMiGt6XcVjKhW83Gbf2y5o8aoN_P8m9D9Q8eeWh.jpg'
                  },
                  {
                    goodsId: '1234567890',
                    goodsName: '商品名称',
                    goodsImage: 'https://qcloud.dpfile.com/pc/r5-BQG0B__mHiVZlmeOE7JvJcEMiGt6XcVjKhW83Gbf2y5o8aoN_P8m9D9Q8eeWh.jpg'
                  }
                ]
              }
            ]
          }
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
