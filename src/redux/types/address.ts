export interface IAddressItem {
  id: number
  userName: string
  addressName: string
  addressSex: string
  addressPhone: string
  addressTag?: string // 1: 家, 2: 公司, 3: 学校, 4: 其他
  addressDetail: string
  addressProvince: string
  addressCity: string
  addressArea: string
  addressStreet: string
}

export interface ISuggestItem {
  suggestId: number
  suggestShopName: string
  suggestContent: string
  suggestTime: string
  suggestType: string
  suggestImageList?: string[]
}

export interface IShopItem {
  shopId: number // 店铺id
  shopName: string // 店铺名称
  shopProvince: string // 省
  shopCity: string // 市
  shopArea: string // 区
  shopStreet: string // 街道
  shopDetail: string // 详细地址
  shopPhone: string // 联系电话
  shopLongitude: number // 经度
  shopLatitude: number // 纬度
  shopDistance: number // 距离/m
  businessStartTime: string // 营业开始时间
  businessEndTime: string // 营业结束时间
}

export interface IAddressState {
  addressList: IAddressItem[]
  suggestList: ISuggestItem[]
  currentAddress: IAddressItem | null
  shopList: IShopItem[]
  currentShop: IShopItem | null
  addSuggestChooseShop: IShopItem | null
}
