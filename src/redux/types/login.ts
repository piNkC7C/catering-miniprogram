export interface IUserInfo {
  openid: string
  userInfo: any
  userId?: number
  nickname?: string
  avatar?: string
  routineOpenid?: string
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
