export interface IGroupItem {
  groupId: number
  groupName: string
}

export interface IGoodsItem {
  goodsId: number
  goodsName: string
  goodsPrice: number
  goodsImage: string
  isPackage: boolean // 是否是套餐
  // packageId?: number // 套餐id
  // packageName?: string // 套餐名称
  // packagePrice?: number // 套餐价格
}

export interface IGoodsCouponItem {
  goodsCouponId: number
  goodsCouponName: string
  goodsCouponImage: string
  goodsCouponDesc: string // 优惠券规则
  goodsCouponStatus: 1 | 2 | 3 // 1: 未使用, 2: 已使用, 3: 已过期
  goodsCouponStartTime: string
  goodsCouponEndTime: string
}

export interface ICouponItem {
  couponId: number
  couponName: string
  couponTip: string // 优惠券提示
  couponDesc: string // 优惠券规则
  couponPrice: number
  couponDiscount: number
  couponStartTime: string
  couponEndTime: string
  couponTag: string
  isExchange: boolean // 是否是兑换券
  exchangeStatus: 1 | 2 | 3 | 4 | null // 1: 待发货, 2: 待收货, 3: 已收货, 4: 已取消
  couponStatus: 1 | 2 | 3 // 1: 未使用, 2: 已使用, 3: 已过期
}

export interface ICartItem extends IGoodsItem {
  goodsCount: number
  totalPrice: number
  // packageList?: IGoodsItem[] // 套餐商品列表
}

export interface IGroupGoodsList extends IGroupItem {
  goodsList: IGoodsItem[]
}

export interface IOrderItem {
  orderId: number
  orderStatus: 1 | 2 | 3 | 4 | 5 // 1: 待支付, 2: 已完成, 3: 已取消, 4: 已关闭，5: 退款中
  tableNumber: number
  personNumber: number
  goodsList: ICartItem[]
  isUseCoupon: boolean
  couponList?: ICouponItem[]
  totalCount: number
  totalPrice: number
  orderTag?: string
  shopName: string
  orderType: 1 | 2 | 3 // 1: 门店, 2: 外卖, 3: 商城
}

export interface ICheckoutOrderItem {
  checkoutOrderId: number
  checkoutOrderCouponedPrice: number // 优惠后价格
  checkoutOrderTotalPrice: number // 总价格
  checkoutOrderTotalCount: number
  checkoutOrderType: 1 | 2 | 3 // 1: 门店, 2: 外卖, 3: 商城
  checkoutOrderTableNumber: number
  checkoutOrderPersonNumber: number
  isUseCoupon: boolean
  couponList?: ICouponItem[]
  goodsList: ICartItem[]
}

export interface IOrderState {
  cartList: ICartItem[]
  orderList: IOrderItem[]
  currentOrder: IOrderItem | null
  orderTabsList: IGroupItem[]
  groupGoodsList: IGroupGoodsList[]
  goodsCouponList: IGoodsCouponItem[]
  couponList: ICouponItem[]
  checkoutOrder: ICheckoutOrderItem | null
}
