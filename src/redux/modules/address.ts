import { createSlice } from '@reduxjs/toolkit'
import { IAddressState } from '../types/address'

const initialState: IAddressState = {
  addressList: [{
    addressId: 1,
    addressName: '张三',
    addressPhone: '13800138000',
    addressTag: '外卖柜',
    addressDetail: '一楼外卖柜',
    addressProvince: '浙江省',
    addressCity: '杭州市',
    addressArea: '滨江区',
    addressStreet: '春风集团9幢',
  }],
  suggestList: [{
    suggestId: 1,
    suggestShopName: '浙江某某某店',
    suggestContent: '优惠活动内容',
    suggestTime: '2025-01-01',
    suggestType: '优惠活动',
    suggestImageList: ['https://img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg'],
  }],
}

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setAddressListAction: (state, { payload: { type, data } }) => {
      switch (type) {
        case 'set':
          state.addressList = [...data]
          break
        case 'add':
          state.addressList.push(data)
          break
        case 'delete':
          state.addressList = state.addressList.filter((item) => item.addressId !== data.addressId)
          break
        default:
          break
      }
    }
  }
})

export const { setAddressListAction } = addressSlice.actions
export default addressSlice.reducer
