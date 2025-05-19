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
    pointsNumber: 0
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
