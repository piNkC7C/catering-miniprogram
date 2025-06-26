export const getRefundStep = (refundStatus: number | undefined) => {
    switch (refundStatus) {
        // 商家主动退款
        case 14:
            return 1
        // 退款成功
        case 2:
            return 2
        default:
            return 0
    }
}