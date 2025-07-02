import { createSlice } from '@reduxjs/toolkit'
import { IPointsState } from '../types/points'
import { jifenDetail } from '@/utils/constants'

const initialState: IPointsState = {
    pointsList: [
        {
            id: 1,
            name: '50元电子优惠券',
            img: jifenDetail,
            cost: 100,
            left: 1000
        },
        {
            id: 2,
            name: '100元电子优惠券',
            img: jifenDetail,
            cost: 100,
            left: 1000
        },
        {
            id: 3,
            name: '100元电子优惠券',
            img: jifenDetail,
            cost: 100,
            left: 1000
        },
        {
            id: 4,
            name: '100元电子优惠券',
            img: jifenDetail,
            cost: 100,
            left: 1000
        },
        {
            id: 5,
            name: '100元电子优惠券',
            img: jifenDetail,
            cost: 100,
            left: 1000
        },
        {
            id: 6,
            name: '100元电子优惠券',
            img: jifenDetail,
            cost: 100,
            left: 1000
        }
    ],
    pointsDetailList: [],
    pointsNumber: 0,
    couponList: [
        {
            couponId: 1,
            couponName: '满100减10元',
            couponDesc: '限于100家门店使用；',
            couponPrice: 100,
            couponDiscount: 10,
            couponStartTime: '2025-01-01',
            couponEndTime: '2025-01-31',
            couponTag: '仅线下门店可用',
            couponTip: '限于100家门店使用；',
            couponStatus: 1,
            isExchange: false,
            exchangeStatus: null
        },
        {
            couponId: 2,
            couponName: '满100减10元',
            couponDesc: '限于100家门店使用；',
            couponPrice: 100,
            couponDiscount: 10,
            couponStartTime: '2025-01-01',
            couponEndTime: '2025-01-31',
            couponTag: '仅线下门店可用',
            couponTip: '限于100家门店使用；',
            couponStatus: 2,
            isExchange: false,
            exchangeStatus: null
        },
        {
            couponId: 3,
            couponName: '满100减10元',
            couponDesc: '限于100家门店使用；',
            couponPrice: 100,
            couponDiscount: 10,
            couponStartTime: '2025-01-01',
            couponEndTime: '2025-01-31',
            couponTag: '仅线下门店可用',
            couponTip: '限于100家门店使用；',
            couponStatus: 3,
            isExchange: false,
            exchangeStatus: null
        },
    ],
    exchangeList: [
        {
            couponId: 1,
            couponName: '满100减10元',
            couponDesc: '限于100家门店使用；',
            couponPrice: 100,
            couponDiscount: 10,
            couponStartTime: '2025-01-01',
            couponEndTime: '2025-01-31',
            couponTag: '仅线下门店可用',
            couponTip: '限于100家门店使用；',
            couponStatus: 1,
            isExchange: true,
            exchangeStatus: 1
        },
        {
            couponId: 2,
            couponName: '满100减10元',
            couponDesc: '限于100家门店使用；',
            couponPrice: 100,
            couponDiscount: 10,
            couponStartTime: '2025-01-01',
            couponEndTime: '2025-01-31',
            couponTag: '仅线下门店可用',
            couponTip: '限于100家门店使用；',
            couponStatus: 1,
            isExchange: true,
            exchangeStatus: 2
        },
        {
            couponId: 3,
            couponName: '满100减10元',
            couponDesc: '限于100家门店使用；',
            couponPrice: 100,
            couponDiscount: 10,
            couponStartTime: '2025-01-01',
            couponEndTime: '2025-01-31',
            couponTag: '仅线下门店可用',
            couponTip: '限于100家门店使用；',
            couponStatus: 1,
            isExchange: true,
            exchangeStatus: 3
        },
        {
            couponId: 4,
            couponName: '满100减10元',
            couponDesc: '限于100家门店使用；',
            couponPrice: 100,
            couponDiscount: 10,
            couponStartTime: '2025-01-01',
            couponEndTime: '2025-01-31',
            couponTag: '仅线下门店可用',
            couponTip: '限于100家门店使用；',
            couponStatus: 1,
            isExchange: true,
            exchangeStatus: 4
        }
    ],
    vipLevel: {
        exp: 2200,
        level: 1,
        name: '小小牛马',
    }
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
