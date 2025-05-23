import { createSlice } from '@reduxjs/toolkit'
import { ILoginState } from '../types/login'

const initialState: ILoginState = {
  loginStatus: 0,
  userInfo: null,
  isRetrieve: false,
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
          state.userInfo = { ...state.userInfo, ...data }
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
    }
  }
})

export const { setLoginStatus, userInfoAction, setIsRetrieve } = loginSlice.actions
export default loginSlice.reducer
