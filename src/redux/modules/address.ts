import { createSlice } from '@reduxjs/toolkit'
import { IAddressState } from '../types/address'

const initialState: IAddressState = {
  addressList: [],
  suggestList: [],
  currentAddress: null,
  shopList: [],
  currentShop: null,
  addSuggestChooseShop: null,
  nowAddress: null
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
          // console.log('delete', data)
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
    setShopListAction: (state, { payload: { type, data } }) => {
      switch (type) {
        case 'set':
          state.shopList = [...data]
          break
        case 'add':
          state.shopList = [...state.shopList, ...data]
          break
        default:
          break
      }
    },
    setNowAddressAction: (state, { payload: { type, data } }) => {
      switch (type) {
        case 'set':
          state.nowAddress = data
          break
        default:
          break
      }
    },
  }
})

export const { setAddressListAction, setSuggestListAction, setCurrentAddressAction, setCurrentShopAction, setAddSuggestChooseShopAction, setShopListAction, setNowAddressAction } = addressSlice.actions
export default addressSlice.reducer
