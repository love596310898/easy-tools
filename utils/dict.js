 import { getDicts } from "@/api/system/dict/data";
const dictCacheMap = {}

/**
 *
 * @param {String} dictKey // 字典type，默认作为组件存储字典的key使用
 * @param {String} [propKey]  // 指定一个key作为组件存储字典的key使用
 * @returns 返回字典数组
 */

export default function (dictKey, propKey) {
  if (dictCacheMap[dictKey]) {
    return dictCacheMap[dictKey]
  } else {
    getDicts(dictKey).then((res) => {
      if (res && Array.isArray(res.data)) {
        dictCacheMap[dictKey] = res.data
        if (propKey) {
          this[propKey] = dictCacheMap[dictKey]
        } else {
          this[dictKey] = dictCacheMap[dictKey]
        }
      }
    }).catch(console.log)
    return []
  }
}
