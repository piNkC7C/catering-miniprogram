export interface IOrderDetail {
  id: number
  title: string
  price: number
  image: string
  count: number
}

export interface ICartItem {
  id: number
  title: string
  price: number
  image: string
  count: number
  detail: boolean
  detailList: IOrderDetail[]
}

export interface IOrderState {
  cartList: ICartItem[]
}
