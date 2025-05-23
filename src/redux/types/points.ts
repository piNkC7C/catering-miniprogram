import { ICouponItem } from "./order"

export interface IPointsState {
    pointsList: any[]
    pointsDetailList: any[]
    pointsNumber: number
    couponList: ICouponItem[]
    exchangeList: ICouponItem[]
    vipLevel: any
}