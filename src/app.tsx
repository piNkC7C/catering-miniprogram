import { PropsWithChildren, useEffect } from 'react'
import { useLaunch, checkSession, login } from '@tarojs/taro'
import './app.scss'

// nut-ui默认主题
import '@nutui/nutui-react-taro/dist/style.scss'

import { Provider } from 'react-redux'
import store from './redux'

function App({ children }: PropsWithChildren<any>) {

    // useLaunch(() => {
    //     console.log('App launched.')
    // })

    // useEffect(() => {
    //     // 检查用户登录状态
    //     checkSession({
    //         success: (res) => {
    //             console.log('checkSession success', res)
    //         },
    //         fail: (err) => {
    //             console.log('checkSession fail', err)
    //             // 如果用户未登录，则跳转到登录页面
    //             login({
    //                 success: (res) => {
    //                     console.log('login success', res)
    //                 },
    //                 fail: (err) => {
    //                     console.log('login fail', err)
    //                 },
    //                 timeout: 10000,
    //                 force: true
    //             })
    //         }
    //     })
    // }, [])

    // children 是将要会渲染的页面
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}

export default App 