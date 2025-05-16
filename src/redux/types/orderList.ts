export interface IOrderListState {
  orderListData: {
    orderId: string
    orderTime: string
    orderStatus: number
    orderPayPrice: number
    orderCount: number
    orderType: string
    orderPayType: string
    orderPayTime: string
    orderAddress: string
    orderTag: string
    orderTable: number
    orderGoodsList: {
      goodsId: string
      goodsName: string
      goodsImage: string
    }[]
  }[]
}

export interface IThunkOrderListState {
  state: IOrderListState
}

export interface IGetOrderListDataRequest {
  type: string | number
}
