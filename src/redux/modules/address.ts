import { createSlice } from '@reduxjs/toolkit'
import { IAddressState } from '../types/address'

const initialState: IAddressState = {
  addressList: [{
    addressId: 1,
    userName: '张三',
    addressName: '春风集团9幢',
    addressSex: '1',
    addressPhone: '13800138000',
    addressTag: '2',
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
  currentAddress: null,
  shopList: [
    {
      shopId: 1,
      shopName: '浙江杭州拱墅信义坊总店',
      shopProvince: '浙江省',
      shopCity: '杭州市',
      shopArea: '拱墅区',
      shopStreet: '湖墅南路',
      shopDetail: '信义坊商街1号1楼',
      shopPhone: '13800138000',
      shopLongitude: 120.21201,
      shopLatitude: 30.2084,
      shopDistance: 10000,
      businessStartTime: '09:00',
      businessEndTime: '22:00',
    }
  ],
  currentShop: null,
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
        case 'update':
          state.addressList = state.addressList.map((item) => item.addressId == data.addressId ? data : item)
          break
        case 'delete':
          console.log('delete', data)
          state.addressList = state.addressList.filter((item) => item.addressId != data.addressId)
          break
        default:
          break
      }
    },
    setSuggestListAction: (state, { payload: { type, data } }) => {
      switch (type) {
        case 'set':
          state.suggestList = [...data]
          break
        case 'add':
          state.suggestList.push(data)
          break
        case 'delete':
          state.suggestList = state.suggestList.filter((item) => item.suggestId != data.suggestId)
          break
        default:
          break
      }
    },
    setCurrentAddressAction: (state, { payload: { type, data } }) => {
      switch (type) {
        case 'set':
          state.currentAddress = data
          break
        default:
          break
      }
    },
    setCurrentShopAction: (state, { payload: { type, data } }) => {
      switch (type) {
        case 'set':
          state.currentShop = data
          break
        default:
          break
      }
    }
  }
})

export const { setAddressListAction, setSuggestListAction, setCurrentAddressAction, setCurrentShopAction } = addressSlice.actions
export default addressSlice.reducer
