export interface IAddressItem {
  addressId: number
  addressName: string
  addressPhone: string
  addressTag?: string
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

export interface IAddressState {
  addressList: IAddressItem[]
  suggestList: ISuggestItem[]
}
