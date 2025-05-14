export interface IUserInfo {
  openid: string
  nickname?: string
  avatar?: string
}

export interface ILoginState {
  loginStatus: number
  userInfo: IUserInfo | null
}
