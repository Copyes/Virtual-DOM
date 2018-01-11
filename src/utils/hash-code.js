export default function hashCode(str) {
  let hash = 5381,
    i = str.length
  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i)
  }
  // JavaScript是按位运算32位签名
  //整数。因为我们希望结果始终是正的，所以转换
  //签署int unsigned做一个无符号的位移。
  return hash >>> 0
}
