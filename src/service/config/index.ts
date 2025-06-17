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

export const TIME_OUT = 999999999999999
export const BASE_URL = 'http://192.168.110.20:9503/app-api'
// export const BASE_URL = 'http://192.168.110.5:9500/app-api'

export const getAddressListURL = '/member/user/address/list'
export const addAddressURL = '/member/user/address/create'
export const editAddressURL = '/member/user/address/update'
export const deleteAddressURL = '/member/user/address/delete'
export const getSuggestListURL = '/member/user/suggest/list'

export const getGroupGoodsListURL = '/member/mini-app/commodity/list'
export const getSetGoodURL = '/member/mini-app/commodity/set/detail'
export const getOrderListURL = '/trade/order/list'
export const getRefundListURL = '/trade/order/getRefundRecord'
export const getAreaDataURL = '/member/mini-app/area-data/get'
export const getShopListURL = '/member/mini-app/shop/list'
export const getShopDetailURL = '/member/mini-app/shop/get'
export const getSetGoodDetailURL = '/member/mini-app/commodity/set/detail'
export const addCartGoodURL = '/member/trade/cart/modify'
export const deleteCartGoodURL = '/member/trade/cart/remove'
export const clearCartURL = '/member/trade/cart/clear'
export const getCartListURL  = '/member/trade/cart/list'
export const selectedCartURL = '/member/trade/cart/selected'
export const addSharedCartGoodsURL = '/member/trade/cart/single-share'
export const confirmPaymentURL = '/member/trade/cart/check-please'
export const clearSelectedCartURL = '/member/trade/cart/order-remove'
export const payOrderURL = '/member/trade/order/create'
export const cancelOrderURL = '/member/trade/order/cancel'

export const loginByPhoneURL = '/member/auth/weixin-mini-app-login'
export const loginURL = '/member/auth/auth-session'
export const getUserInfoURL = '/member/user/get-userinfo'
export const getVipCodeURL = '/member/user/get-member-code'

export const uploadURL = '/admin-api/infra/file/upload'
