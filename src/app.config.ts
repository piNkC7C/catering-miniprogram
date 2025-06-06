export default defineAppConfig({
  pages: [
    // tabbar页面
    // 首页
    'pages/index/index',
    // 点单
    'pages/order/order',
    // 订单列表
    'pages/orderList/orderList',
    // 我的
    'pages/mine/mine',

    // // 地址列表
    // 'subPackagesD/addressList/addressList',
    // // 添加/编辑地址
    // 'subPackagesD/address/address',
    // 反馈列表
    // 'subPackagesD/suggestList/suggestList',
    // // 反馈
    // 'subPackagesD/suggest/suggest',
    // 选择店铺
    // 'subPackagesE/chooseShop/chooseShop',
  ],
  subPackages: [
    {
      root: 'subPackagesA',
      pages: [
        // 选规格
        'choose/choose',
        // 积分
        'points/points',
        // 积分明细
        'pointsDetail/pointsDetail',
        // 积分规则
        'pointsRules/pointsRules',
      ]
    },
    {
      root: 'subPackagesB',
      pages: [
        // 兑换详情
        'exchangeDetail/exchangeDetail',
        // 选桌
        'selectTable/selectTable',
        // 优惠券列表
        'couponList/couponList',
        // 兑换优惠券
        'exchangeCoupon/exchangeCoupon',
      ]
    },
    {
      root: 'subPackagesC',
      pages: [
        // 会员
        'vip/vip',
        // 支付
        'payment/payment',
        // 订单详情
        'orderDetail/orderDetail',
        // 店铺列表
        'shopList/shopList',
      ]
    },
    {
      root: 'subPackagesD',
      pages: [
        // 反馈
        'suggest/suggest',
        // 反馈列表
        'suggestList/suggestList',
        // 地址列表
        'addressList/addressList',
        // 添加/编辑地址
        'address/address',
      ]
    },
    {
      root: 'subPackagesE',
      pages: [
        // 选择店铺
        'chooseShop/chooseShop',
      ]
    },
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'xxx火锅',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    list: [
      {
        pagePath: 'pages/index/index',
        text: '',
        iconPath: 'assets/tabbar/tab-index.png',
        selectedIconPath: 'assets/tabbar/tab-index.png'
      },
      {
        pagePath: 'pages/order/order',
        text: '',
        iconPath: 'assets/tabbar/tab-order.png',
        selectedIconPath: 'assets/tabbar/tab-order.png'
      },
      {
        pagePath: 'pages/orderList/orderList',
        text: '',
        iconPath: 'assets/tabbar/tab-orderList.png',
        selectedIconPath: 'assets/tabbar/tab-orderList.png'
      },
      {
        pagePath: 'pages/mine/mine',
        text: '',
        iconPath: 'assets/tabbar/tab-my.png',
        selectedIconPath: 'assets/tabbar/tab-my.png'
      },
    ],
    color: '#999',
    selectedColor: '#1aad19',
    backgroundColor: '#fff',
    borderStyle: 'white'
  },
  requiredPrivateInfos: [
    'getLocation',
    'chooseLocation',
  ],
  permission: {
    'scope.userLocation': {
      desc: '你的位置信息将用于小程序位置接口的效果展示'
    }
  }
})
