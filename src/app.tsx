import { PropsWithChildren, useEffect } from 'react'
import { useLaunch, checkSession, login, setStorage, getStorage, showLoading, hideLoading } from '@tarojs/taro'
import './app.scss'
import { OPEN_ID } from './utils/constants'

// nut-ui默认主题
import '@nutui/nutui-react-taro/dist/style.scss'

import { Provider } from 'react-redux'
import store from './redux'

import { loginAPI, getUserInfoAPI } from './api/login'
import { userInfoAction, setLoginStatus } from './redux/modules/login'
import { IResponseApi } from './api/type'
import { IUserInfo } from './redux/types/login'

function App({ children }: PropsWithChildren<any>) {

    // useLaunch(() => {
    //     console.log('App launched.')
    // })

    const setLogin = (res: IResponseApi<IUserInfo>) => {
        if (res.success) {
            // setStorage({
            //     key: OPEN_ID,
            //     data: res.data.openid
            // })
            // console.log('login success', res);
            store.dispatch(userInfoAction({
                type: 'set',
                data: {
                    openid: res.data.openid,
                    userInfo: res.data.userInfo,
                    nickname: res.data.userInfo.nickname,
                    avatar: res.data.userInfo.avatar,
                }
            }))
            if (res.data.userInfo.isLogin) {
                store.dispatch(setLoginStatus(1))
            } else {
                store.dispatch(setLoginStatus(0))
            }
            hideLoading()
        } else {
            console.log('获取openid失败', res);
            hideLoading()
        }
    }


    const quikLogin = () => {
        login({
            success: (res) => {
                // console.log('login success', res)
                loginAPI({
                    type: 10,
                    code: res.code,
                    state: 'weixin'
                }, setLogin)
            },
            fail: (err) => {
                console.log('login fail', err)
                hideLoading()
            },
            timeout: 10000,
            force: true
        }).catch(() => {
        })
    }

    useEffect(() => {
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
                            // setStorage({
                            //     key: OPEN_ID,
                            //     data: res.data.openid
                            // })
                            // console.log('login success', res);
                            store.dispatch(userInfoAction({
                                type: 'set',
                                data: {
                                    openid: storgeRes.data,
                                    userInfo: res.data,
                                    nickname: res.data.nickname,
                                    avatar: res.data.avatar,
                                }
                            }))
                            if (res.data.isLogin) {
                                store.dispatch(setLoginStatus(1))
                            } else {
                                store.dispatch(setLoginStatus(1))
                            }
                            hideLoading()
                        } else {
                            console.log('获取openid失败', res);
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