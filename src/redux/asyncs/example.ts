import { createAsyncThunk } from '@reduxjs/toolkit'
import { IThunkExampleState, IExampleState } from '../types/example'
import { initDataAction } from '../modules/example'

export const initDataAsync = createAsyncThunk<
  void,
  IExampleState,
  IThunkExampleState
>('example/initDataAsync', async (payload, { dispatch }) => {
  // 在此请求接口获取数据

  // 分派进redux
  dispatch(initDataAction(payload))
})
