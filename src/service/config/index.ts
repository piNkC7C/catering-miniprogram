// vite默认提供的环境变量
// console.log(import.meta.env.MODE)
// console.log(import.meta.env.DEV) // 是否开发环境
// console.log(import.meta.env.PROD) // 是否生产环境
// console.log(import.meta.env.SSR) // 是否是服务器端渲染(server side render)

// let BASE_URL = ''
// if (import.meta.env.PROD) {
//   // 生产环境
//   BASE_URL = 'http://152.136.185.210:4000'
// } else {
//   // 开发环境
//   BASE_URL = 'http://152.136.185.210:5000'
// }

// console.log(BASE_URL)

// 通过创建.env文件直接创建变量
// console.log(import.meta.env.VITE_BASE_URL)

export const TIME_OUT = 10000
// export const BASE_URL = 'https://console.imissniu.com/app-api'
export const BASE_URL = process.env.TARO_APP_URL + '/app-api'
export const ADMIN_BASE_URL = process.env.TARO_APP_URL + '/admin-api'

// 获取地址列表
export const getAddressListURL = '/member/user/address/list'
// 添加地址
export const addAddressURL = '/member/user/address/create'
// 编辑地址
export const editAddressURL = '/member/user/address/update'
// 删除地址
export const deleteAddressURL = '/member/user/address/delete'
// 获取建议列表
export const getSuggestListURL = '/member/user/suggest/list'
// 获取商品列表
export const getGroupGoodsListURL = '/member/mini-app/commodity/list'
// 获取套餐详情
export const getSetGoodURL = '/member/mini-app/commodity/set/detail'
// 获取订单列表
export const getOrderListURL = '/member/trade/order/list'
// 获取退款列表
export const getRefundListURL = '/member/trade/order/getRefundRecord'
// 获取地区数据
export const getAreaDataURL = '/member/mini-app/area-data/get'
// 获取店铺列表
export const getShopListURL = '/member/mini-app/shop/list'
// 获取店铺详情
export const getShopDetailURL = '/member/mini-app/shop/get'
// 获取套餐详情
export const getSetGoodDetailURL = '/member/mini-app/commodity/set/detail'
// 修改购物车
export const addCartGoodURL = '/member/trade/cart/modify'
// 删除购物车
export const deleteCartGoodURL = '/member/trade/cart/remove'
// 清空购物车
export const clearCartURL = '/member/trade/cart/clear'
// 获取购物车列表
export const getCartListURL  = '/member/trade/cart/list'
// 购物车选中状态
export const selectedCartURL = '/member/trade/cart/selected'
// 添加共享购物车
export const addSharedCartGoodsURL = '/member/trade/cart/single-share'
// 确认支付
export const confirmPaymentURL = '/member/trade/cart/check-please'
// 清空选择购物车
export const clearSelectedCartURL = '/member/trade/cart/order-remove'
// 创建订单
export const payOrderURL = '/member/trade/order/create'
// 取消订单
export const cancelOrderURL = '/member/trade/order/cancel'
// 获取订单详情
export const getOrderDetailByPrePayURL = '/member/trade/order/getOrderItem'
// 获取预支付信息
export const getPrePayByOrderIdURL = '/member/trade/order/getPrepayItem'
// 获取订单级退款记录
export const getOrderRefundRecordURL = '/member/trade/order/getOrderRefundRecord'
// 登录
export const loginByPhoneURL = '/member/auth/weixin-mini-app-login'
// 获取用户信息
export const loginURL = '/member/auth/auth-session'
// 获取用户信息
export const getUserInfoURL = '/member/user/get-userinfo'
// 获取会员码
export const getVipCodeURL = '/member/user/get-member-code'
// 获取商品级退款记录
export const getGoodsRefundRecordURL = '/member/trade/order/getOrderRefundRecordDetails'
// 获取商品级退款记录详情
export const getGoodsRefundRecordDetailsURL = '/member/trade/order/getOrderRefundRecordDetailsItem'
// 批量添加购物车
export const batchAddCartGoodsURL = '/member/trade/cart/batchModify'
// 订单id获取商品列表
export const getOrderGoodsListURL = '/member/trade/cart/getCartByOrderId'
// 上传文件
export const uploadURL = '/infra/file/upload'
// 获取订单是否可退款
export const getIsOrderRefundURL = '/infra/order/getOrderRefund'
