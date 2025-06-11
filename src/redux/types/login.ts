export interface IUserInfo {
  openId: string
  nickname?: string
  avatar?: string
}

export interface ITableInfo {
  tableId: number
  tableNum: string
  peopleNum: number
}

export interface ILoginState {
  loginStatus: number
  userInfo: IUserInfo | null
  isRetrieve: boolean
  tableInfo: ITableInfo | null
}
