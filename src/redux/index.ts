import { configureStore, Action } from '@reduxjs/toolkit'
import exampleReducer from './modules/example'
import loginReducer from './modules/login'
import { ThunkDispatch } from 'redux-thunk'

const store = configureStore({
  reducer: {
    example: exampleReducer,
    login: loginReducer
  }
})

export type IRootState = ReturnType<typeof store.getState>
// export type DispatchType = typeof store.dispatch
export type DispatchType = ThunkDispatch<IRootState, unknown, Action>;

export default store
