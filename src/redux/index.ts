import { configureStore, Action } from '@reduxjs/toolkit'
import exampleReducer from './modules/example'
import loginReducer from './modules/login'
import orderListReducer from './modules/orderList'
import pointsReducer from './modules/points'
import { ThunkDispatch } from 'redux-thunk'

const store = configureStore({
  reducer: {
    example: exampleReducer,
    login: loginReducer,
    orderList: orderListReducer,
    points: pointsReducer
  }
})

export type IRootState = ReturnType<typeof store.getState>
export type DispatchType = typeof store.dispatch
// export type DispatchType = ThunkDispatch<unknown, unknown, Action>;

export default store
