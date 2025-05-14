export default defineAppConfig({
  pages: [
    // tabbar页面
    // 首页
    // 'pages/index/index',
    // 点单
    'pages/order/order',
    // 订单列表
    'pages/orderList/orderList',
    // 我的
    'pages/mine/mine'

    // 其他页面
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '餐饮小程序',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    list: [
      // {
      //   pagePath: 'pages/index/index',
      //   text: '',
      //   iconPath: 'assets/tabbar/tab-index.png',
      //   selectedIconPath: 'assets/tabbar/tab-index.png'
      // },
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
      }
    ],
    color: '#999',
    selectedColor: '#1aad19',
    backgroundColor: '#fff',
    borderStyle: 'white'
  }
})
