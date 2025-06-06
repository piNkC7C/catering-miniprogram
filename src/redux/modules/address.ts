import { createSlice } from '@reduxjs/toolkit'
import { IAddressState } from '../types/address'

const initialState: IAddressState = {
  addressList: [],
  suggestList: [],
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
  addSuggestChooseShop: null,
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
          state.addressList = state.addressList.map((item) => item.id == data.id ? data : item)
          break
        case 'delete':
          console.log('delete', data)
          state.addressList = state.addressList.filter((item) => item.id != data.id)
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
    },
    setAddSuggestChooseShopAction: (state, { payload: { type, data } }) => {
      switch (type) {
        case 'set':
          state.addSuggestChooseShop = data
          break
        default:
          break
      }
    },
  }
})

export const { setAddressListAction, setSuggestListAction, setCurrentAddressAction, setCurrentShopAction, setAddSuggestChooseShopAction } = addressSlice.actions
export default addressSlice.reducer
