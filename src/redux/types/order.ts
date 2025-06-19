export interface IGroupItem {
  classificationId: number // 分类id
  classificationName: string // 分类名称
  classificationSorting: number // 分类排序
}

export interface IGoodsItem {
  id: number // 商品id
  mealName: string // 商品名称
  mealImage: string // 商品图片
  isSet: boolean // 是否是套餐
  standardPrice: number // 商品价格
  minimumPurchaseQuantity: number // 最小购买数量
  purchaseQuantityLimit: number // 最大购买量
  mealQuantity: number // 商品库存
  mealSpecQuantity: number // 套餐规格库存
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

export interface ICartItem {
  commodityId: number // 商品/套餐id
  count: number // 数量
  classificationId: number // 分类id
  image: string // 图片
  name: string // 名称
  price: number // 价格
  isSet: boolean // 是否是套餐
  isAdd: boolean // 是否是新增
  selected: boolean // 是否选中
  minimumPurchaseQuantity: number // 最小购买数量
  purchaseQuantityLimit: number // 最大购买量
  cartDOS?: ICartItem[] // 套餐商品列表
}

export interface IGroupGoodsList extends IGroupItem {
  goodsList: IGoodsItem[]
}

export interface IOrderGoodsItem extends IGoodsItem {
  goodsCount: number // 商品数量
  totalPrice: number // 总价格
  userOrderQuantity: number //商品数量
  // packageList?: IGoodsItem[] // 套餐商品列表
}

export interface IOrderItem {
  orderId: number // 订单id
  orderIdentifier: string //订单编号
  orderStatus: 1 | 2 | 3 | 4 | 5 // 1: 待支付, 2: 已取消, 3: 已完成, 4: 已关闭，5: 退款中
  tableNumber: number // 桌id
  tableName: string // 桌号
  personNumber: number // 人数
  goodsList: IOrderGoodsItem[] //商品列表
  isUseCoupon: boolean // 是否用券
  couponList?: ICouponItem[] //券列表
  totalCount: number //总数
  totalPrice: number //优惠前金额
  couponedPrice: number //优惠的金额
  orderTag?: string // 订单标签
  shopName: string // 店铺名称
  orderType: 1 | 2 | 3 // 1: 门店, 2: 外卖, 3: 商城
  shopAddressProvince: string
  shopAddressCity: string
  shopAddressArea: string
  shopAddressStreet: string
  shopAddressDetail: string
  orderPayTime: number // 支付时间
  orderPayType: number // 支付方式
  orderTime: number // 下单时间
  orderCloseTime: number // 订单关闭时间
}

export interface IRefundItem {
  id: number //退款id
  orderId: number // 订单id
  refundNumber: string //退款编号
  refundStatus: number //退款状态
  refundTime: number // 退款时间戳
  refundReason: string // 退款原因
  refundPrice: number // 退款金额
  goodsList: IOrderGoodsItem[] //商品列表
}

export interface ICheckoutOrderItem {
  checkoutOrderId: number
  checkoutOrderCouponedPrice: number // 优惠后价格
  checkoutOrderTotalPrice: number // 总价格
  checkoutOrderTotalCount: number
  checkoutOrderType: 1 | 2 | 3 // 1: 门店, 2: 外卖, 3: 商城
  checkoutOrderTableId: number
  checkoutOrderTableNumber: string
  checkoutOrderPersonNumber: number
  isUseCoupon: boolean
  couponList?: ICouponItem[]
  goodsList: ICartItem[]
}

export interface IPayOrderInfoItem {
  timeStamp: string
  nonceStr: string
  packageValue: string
  signType: 'MD5' | 'HMAC-SHA256' | 'RSA'
  paySign: string
  prepayId: string
}

export interface IOrderState {
  cartList: ICartItem[]
  orderTabsList: IGroupItem[]
  groupGoodsList: IGroupGoodsList[]
  goodsCouponList: IGoodsCouponItem[]
  couponList: ICouponItem[]
  checkoutOrder: ICheckoutOrderItem | null
  orderList: IOrderItem[]
  refundList: IRefundItem[]
  currentOrder: IOrderItem | null
  currentRefund: IRefundItem | null
  payOrderInfo: IPayOrderInfoItem | null
}
