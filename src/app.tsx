import { PropsWithChildren, useEffect } from 'react'
import { useLaunch, checkSession, login, setStorage, getStorage } from '@tarojs/taro'
import './app.scss'
import { OPEN_ID } from './utils/constants'

// nut-ui默认主题
import '@nutui/nutui-react-taro/dist/style.scss'

import { Provider } from 'react-redux'
import store from './redux'

import { loginAPI } from './api/login'

function App({ children }: PropsWithChildren<any>) {

    // useLaunch(() => {
    //     console.log('App launched.')
    // })


    const quikLogin = () => {
        login({
            success: (res) => {
                // console.log('login success', res)
                loginAPI({
                    type: 10,
                    code: res.code,
                    state: 'weixin'
                }, (res) => {
                    if (res.success && res.data && res.data.openId) {
                        setStorage({
                            key: OPEN_ID,
                            data: res.data.openId
                        })
                    } else {
                        console.log('获取openid失败', res);
                    }
                })
            },
            fail: (err) => {
                console.log('login fail', err)
            },
            timeout: 10000,
            force: true
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
        // 小程序游客登录
        getStorage({
            key: OPEN_ID,
            success: (res) => {
                if (res.data && res.data !== 'undefined') {
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