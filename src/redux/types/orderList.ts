export interface IOrderListState {
  orderListData: {
    orderId: string
    orderTime: string
    orderStatus: number
    orderPayPrice: number
    orderType: string
    orderPayType: string
    orderPayTime: string
    orderAddress: string
    orderTag: string
  }[]
}
