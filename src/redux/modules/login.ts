import { createSlice } from '@reduxjs/toolkit'
import { ILoginState } from '../types/login'
import { switchTab } from '@tarojs/taro'

const initialState: ILoginState = {
  loginStatus: 0,
  userInfo: null,
  isRetrieve: false,
  tableInfo: null,
}

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setLoginStatus: (state, { payload }) => {
      state.loginStatus = payload
      return state
    },
    userInfoAction: (state, { payload: { type, data } }) => {
      switch (type) {
        case 'set':
          state.userInfo = { ...data }
          break
        case 'delete':
          state.userInfo = null
          break
      }
      return state
    },
    setIsRetrieve: (state, { payload }) => {
      state.isRetrieve = payload
      return state
    },
    setTableInfo: (state, { payload }) => {
      state.tableInfo = payload
      switchTab({
        url: '/pages/order/order',
    })
      return state
    }
  }
})

export const { setLoginStatus, userInfoAction, setIsRetrieve, setTableInfo } = loginSlice.actions
export default loginSlice.reducer
