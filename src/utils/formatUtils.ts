/**
 * 格式化距离显示
 * @param distance 距离（米）
 * @returns 格式化后的距离字符串
 */
export function formatDistance(distance: number): string {
  if (distance < 1000) {
    return `${Math.round(distance)}m`
  } else {
    const km = distance / 1000
    // 如果是整数公里数，不显示小数
    if (km % 1 === 0) {
      return `${km}km`
    }
    // 保留一位小数
    return `${km.toFixed(1)}0km`
  }
}

/**
 * 格式化距离显示（更精确的版本）
 * @param distance 距离（米）
 * @param precision 小数位数，默认为1
 * @returns 格式化后的距离字符串
 */
export function formatDistanceWithPrecision(distance: number, precision: number = 1): string {
  if (distance < 1000) {
    return `${Math.round(distance)}m`
  } else {
    const km = distance / 1000
    return `${km.toFixed(precision)}km`
  }
} 