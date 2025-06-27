import { PropsWithChildren, useEffect } from 'react'
import { useLaunch, requestPayment, checkSession, login, setStorage, getStorage, showLoading, hideLoading, useLoad, getLocation } from '@tarojs/taro'
import './app.scss'
import { OPEN_ID, qqmapsdkKey } from './utils/constants'

// nut-ui默认主题
import '@nutui/nutui-react-taro/dist/style.scss'

import { Provider } from 'react-redux'
import store from './redux'

import { loginAPI, getUserInfoAPI } from './api/login'
import { userInfoAction, setLoginStatus } from './redux/modules/login'
// import { setCurrentShopAction, setNowAddressAction } from './redux/modules/address'
import { IResponseApi } from './api/type'
import { IUserInfo } from './redux/types/login'
// import QQMapWX from '@/libs/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js'
// import { getShopListAPI } from './api/address'
// import dayjs from 'dayjs'
// import { IGroupGoodsList } from './redux/types/order'
// import { setOrderTabsListAction, setGroupGoodsListAction } from './redux/modules/order'
// import { getGroupGoodsListAPI } from './api/order'

function App({ children }: PropsWithChildren<any>) {

    // useLaunch(() => {
    //     console.log('App launched.')
    // })

    const setLogin = (res: IResponseApi<IUserInfo>, openid: string | null = null) => {
        if (res.success) {
            setStorage({
                key: OPEN_ID,
                data: res.data.openid
            })
            console.log('本地没有openid', res);
            store.dispatch(userInfoAction({
                type: 'set',
                data: {
                    openid: res.data.openid,
                    userInfo: res.data.userInfo,
                    nickname: res.data.userInfo.nickname,
                    avatar: res.data.userInfo.avatar,
                    userId: res.data.userInfo.isLogin ? res.data.userId : null,
                }
            }))
            if (res.data.userInfo.isLogin) {
                store.dispatch(setLoginStatus(1))
            } else {
                store.dispatch(setLoginStatus(0))
            }
            hideLoading()
        } else {
            console.log('登录失败', res);
            if (openid) {
                setStorage({
                    key: OPEN_ID,
                    data: openid
                })
                store.dispatch(userInfoAction({
                    type: 'set',
                    data: {
                        openid,
                        userInfo: {},
                        nickname: '',
                        avatar: '',
                        userId: null,
                    }
                }))
                store.dispatch(setLoginStatus(0))
            } else {

            }
            hideLoading()
        }
    }


    const quikLogin = (openid: string | null = null) => {
        login({
            success: (res) => {
                // console.log('login success', res)
                loginAPI({
                    type: 10,
                    code: res.code,
                    state: 'weixin'
                }, (res: IResponseApi<IUserInfo>) => {
                    setLogin(res, openid)
                })
            },
            fail: (err) => {
                console.log('login fail', err)
                if (openid) {
                    setLogin({
                        success: false,
                        data: null as any
                    }, openid)
                }
                hideLoading()
            },
            timeout: 10000,
            force: true
        }).catch(() => {
        })
    }

    useEffect(() => {
        // console.log('prepay_id=wx17142701774247d677935f80dc3fbf0001'.substring(10, 'prepay_id=wx17142701774247d677935f80dc3fbf0001'.length - 1));

        // 检查用户登录状态
        // checkSession({
        //     success: (res) => {
        //         console.log('checkSession success', res)
        //     },
        //     fail: (err) => {
        //         console.log('checkSession fail', err)
        //         // 如果用户未登录，则跳转到登录页面
        //         login({
        //             success: (res) => {
        //                 console.log('login success', res)
        //             },
        //             fail: (err) => {
        //                 console.log('login fail', err)
        //             },
        //             timeout: 10000,
        //             force: true
        //         })
        //     }
        // })
        // requestPayment({
        //     timeStamp: '1750141184',
        //     nonceStr: 'H0PSziHFPAkVe9UgamPzqpJvVy3RoZO5',
        //     package: 'prepay_id=wx1714194481840826c956b5d34409830001',
        //     signType: 'RSA',
        //     paySign: 'U5VQR5sg9zM4UA3/yTR9W5H8bEqf8WCc7S8zlUbnwr+5bX1t3aaC1UsdDLFPH8dI/BwTTq/hYfCguJZ/TF+HLXF9MOjueu+ifjWcRu11dY8Srq83jfdy4acnG4rGBltCnQGGAcaC+n9ysAQGTk3MrASCqP3BEtiG0HPNpB//EinYoIOWUBKULX5Scn14+0s6bQ1BSZp/uDDM3xKlwGhbafmPBXkcye4Gwzz+CEn9r7JqpzWFF7y7P1KkXJ3nsCi0ROepdoWql+fkHLMYsosMesUxx4uANI6sPkPINqzipN1NvP05vAu8oj91MXFN1AVVw32LWO++dT9EHTx0mBZ0FA==',
        //     success: (res) => {
        //         console.log('requestPayment success', res)
        //     },
        //     fail: (err) => {
        //         console.log('requestPayment fail', err)
        //     },
        //     complete: (res) => {
        //         console.log('requestPayment complete', res)
        //     },
        // })

        showLoading({
            title: '登录中...',
            mask: true,
        })
        // 小程序游客登录
        getStorage({
            key: OPEN_ID,
            success: (storgeRes) => {
                if (storgeRes.data && storgeRes.data !== 'undefined') {
                    getUserInfoAPI({
                        openid: storgeRes.data
                    }, (res: IResponseApi<any>) => {
                        if (res.success) {
                            setStorage({
                                key: OPEN_ID,
                                data: res.data.routineOpenid
                            })
                            console.log('本地有openid', res);
                            store.dispatch(userInfoAction({
                                type: 'set',
                                data: {
                                    openid: res.data.routineOpenid,
                                    userInfo: res.data,
                                    nickname: res.data.nickname,
                                    avatar: res.data.avatar,
                                    userId: res.data.isLogin ? res.data.id : null,
                                }
                            }))
                            if (res.data.isLogin) {
                                store.dispatch(setLoginStatus(1))
                            } else {
                                store.dispatch(setLoginStatus(0))
                            }
                            hideLoading()
                        } else {
                            console.log('获取用户信息失败', res);
                            quikLogin(storgeRes.data)
                            hideLoading()
                        }
                    })
                } else {
                    quikLogin()
                }
            },
            fail(err) {
                quikLogin()
            },
        }).catch(() => {
        })
    }, [])

    // children 是将要会渲染的页面
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}

export default App 