import { createSlice } from '@reduxjs/toolkit'
import { IPointsState } from '../types/points'

const initialState: IPointsState = {
    pointsList: [
        {
            id: 1,
            name: '50元电子优惠券',
            img: 'points-list',
            cost: 100,
            left: 1000
        },
        {
            id: 2,
            name: '100元电子优惠券',
            img: 'points-rule',
            cost: 100,
            left: 1000
        },
        {
            id: 3,
            name: '100元电子优惠券',
            img: 'points-rule',
            cost: 100,
            left: 1000
        },
        {
            id: 4,
            name: '100元电子优惠券',
            img: 'points-rule',
            cost: 100,
            left: 1000
        },
        {
            id: 5,
            name: '100元电子优惠券',
            img: 'points-rule',
            cost: 100,
            left: 1000
        },
        {
            id: 6,
            name: '100元电子优惠券',
            img: 'points-rule',
            cost: 100,
            left: 1000
        }
    ],
    pointsDetailList: [],
    pointsNumber: 0,
    couponList: [
        {
            id: 1,
            name: '满100减10元',
            buy: 100,
            minus: 10,
            start: '2025-01-01',
            end: '2025-01-31',
            tag: '仅线下门店可用',
            desc:'限于100家门店使用；',
            status: 1
        },
        {
            id: 2,
            name: '满100减10元',
            buy: 100,
            minus: 10,
            start: '2025-01-01',
            end: '2025-01-31',
            tag: '仅线下门店可用',
            desc:'限于100家门店使用；',
            status: 2
        },
        {
            id: 3,
            name: '满100减10元',
            buy: 100,
            minus: 10,
            start: '2025-01-01',
            end: '2025-01-31',
            tag: '仅线下门店可用',
            desc:'限于100家门店使用；',
            status: 3
        },
    ],
    exchangeList: [
        {
            id: 1,
            name: '满100减10元',
            buy: 100,
            minus: 10,
            start: '2025-01-01',
            end: '2025-01-31',
            tag: '仅线下门店可用',
            desc:'限于100家门店使用；',
            status: 1
        },
        {
            id: 2,
            name: '满100减10元',
            buy: 100,
            minus: 10,
            start: '2025-01-01',
            end: '2025-01-31',
            tag: '仅线下门店可用',
            desc:'限于100家门店使用；',
            status: 2
        },
        {
            id: 3,
            name: '满100减10元',
            buy: 100,
            minus: 10,
            start: '2025-01-01',
            end: '2025-01-31',
            tag: '仅线下门店可用',
            desc:'限于100家门店使用；',
            status: 3
        },
        {
            id: 4,
            name: '满100减10元',
            buy: 100,
            minus: 10,
            start: '2025-01-01',
            end: '2025-01-31',
            tag: '仅线下门店可用',
            desc:'限于100家门店使用；',
            status: 4
        }
    ]
}

const pointsSlice = createSlice({
    name: 'points',
    initialState,
    reducers: {
        pointsListAction: (state, { payload: { type, data } }) => {
            switch (type) {
                case 'set':
                    state.pointsList = [...data]
                    break
                case 'delete':
                    state.pointsList = []
                    break
            }
            return state
        },
        pointsDetailListAction: (state, { payload: { type, data } }) => {
            switch (type) {
                case 'set':
                    state.pointsDetailList = [...data]
                    break
                case 'delete':
                    state.pointsDetailList = []
                    break
            }
            return state
        }
    }
})

export const { pointsListAction, pointsDetailListAction } = pointsSlice.actions
export default pointsSlice.reducer
