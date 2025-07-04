import { getOrderListAPI } from "@/api/order"
import { IResponseApi } from "@/api/type"
import { IOrderItem } from "@/redux/types/order"
import { setOrderListAction } from "@/redux/modules/order"
import { useAppDispatch, useAppSelector } from "./useAppStore"

export function useOrder() {
    const {
        login: {
            userInfo,
        },
    } = useAppSelector((state) => state)
    const dispatch = useAppDispatch()

    // 获取订单列表
    const getOrderList = () => {
        getOrderListAPI({
            openId: userInfo?.openid!
        }, (res: IResponseApi<IOrderItem[]>) => {
            if (res.success) {
                dispatch(setOrderListAction({
                    type: 'set',
                    data: res.data,
                }))
            }
        })
    }


    return {
        getOrderList,
    }
}