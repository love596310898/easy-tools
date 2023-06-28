import api_cfg_dic from "@/api/sys/cfg/dic";

/*
 * 获取属性信息方法
 * type 需要获取的属性type
 * callback 回调函数
 * 由于需要刷新页面时能更新，所以不用 sessionStorage
 */
export function getCfgDic(type, callback) {
  let globalDic = window.globalCache.cfgDic;

  if (globalDic[type] != null) {
    callback(globalDic[type]);
    return;
  }

  api_cfg_dic
    .getDicList(type)
    .then(data => {
      // 缓存对象
      globalDic[type] = data;

      callback(data || []);
    })
    .catch(() => {
      console.log("属性数据加载失败");
    });
}

// 通过字典项的值获取名称，对于可用过滤器的场合，可采用 commonFilter 中的 codeFilter
export function getValueByKey(k, dic) {
  const tmp = dic.find(item => item.key == k);
  if (tmp) {
    return tmp.value;
  }
  return null;
}
