import api_dic from "@/api/sys/dic";
import PubSub from "pubsub-js";
import { DIC_UPDATED } from "@/consts/pubsubTopics";

const expireTime = 1000 * 60 * 10;  // 字典数据缓存有效时间，单位毫秒
const loadingSet = new Set();       // 请求池，避免短时间内重复请求（此时缓存尚未生效）
const callbackPool = {};            // 回调池

/**
 * 获取单个或多个字典数据
 * @param {Array} dicCodeList 需要获取的字典code数组
 * @param {Function} callback 回调函数
 * @param {Function} onError 异常函数
 * 由于需要刷新页面时能更新，所以不用 sessionStorage
 */
export function getDic(dicCodeList, callback, onError) {
  let globalDic = window.globalCache.dic;

  // 获取未缓存key和已缓存key
  let nonList = [];

  for (let index = 0; index < dicCodeList.length; index++) {
    let key = dicCodeList[index];

    const hasCache = globalDic[key] != undefined && new Date().getTime() - globalDic[key]._timestamp_ <= expireTime;

    if (hasCache) {
    } else if (loadingSet.has(key)) {
      // 如果正在请求，加入回调池
      if (!callbackPool[key]) callbackPool[key] = [];
      callbackPool[key].push({ dicCodeList, callback });
    } else {
      nonList.push(key);
      loadingSet.add(key);
    }
  }

  // 获取未缓存数据
  if (nonList.length > 0) {
    api_dic
      .getDicList(nonList)
      .then(data => {
        // 缓存对象
        if (data) {
          for (let index = 0; index < nonList.length; index++) {
            let key = nonList[index];
            globalDic[key] = data[key];
            globalDic[key]._timestamp_ = new Date().getTime();

            loadingSet.delete(key);
            if (callbackPool[key]) {
              // 回调池触发回调
              callbackPool[key].forEach(o => {
                doCallback(o.dicCodeList, o.callback);
              });
              delete callbackPool[key];
            }
          }
        }

        doCallback(dicCodeList, callback);
      })
      .catch(err => {
        console.log("字典数据加载失败：", nonList);
        for (let index = 0; index < nonList.length; index++) {
          let key = nonList[index];
          loadingSet.delete(key);
          delete callbackPool[key];
        }
        if (typeof onError === "function") {
          onError(err);
        }
      });
  } else {
    doCallback(dicCodeList, callback);
  }
}

/**
 * 获取单个或多个字典数据（Promise方式）
 * @param {Array} dicCodeList 需要获取的字典code数组
 * @returns {Promise} Promise对象
 */
export function getDicPromise(dicCodeList) {
  return new Promise((resolve, reject) => {
    getDic(dicCodeList, resolve, reject);
  });
}

/**
 * 发布字典更新消息
 * @param {String} dicCode
 */
export function pubDicUpdated(dicCode) {
  let globalDic = window.globalCache.dic;
  delete globalDic[dicCode];  // 删除某字典本地缓存，使其下次从后台取
  PubSub.publish(DIC_UPDATED, dicCode);
}

/**
 * 订阅字典更新消息
 * @param {String | Array | undefined | null} dicCode 关注的字典编码
 * @param {Function} callback 当关注的字典编码发生变化时执行回调
 */
export function subDicUpdated(dicCode, callback) {
  PubSub.subscribe(DIC_UPDATED, (msg, data) => {
    if (dicCode instanceof Array) {     // 关注多个字典编码（数组）
      if (dicCode.includes(data)) callback(data);
    } else if (dicCode) {               // 关注单个字典编码（字符串）
      if (dicCode === data) callback(data);
    } else {                            // dicCode 为 undefined、null 时，总是会执行回调
      callback(data);
    }
  });
}

// 获取字典的回调
function doCallback(dicCodeList, callback) {
  let globalDic = window.globalCache.dic;
  let count = 0;
  let tmp = {};
  for (let dicCode of dicCodeList) {
    if (globalDic[dicCode] == undefined) break;
    tmp[dicCode] = globalDic[dicCode];
    count++;
  }
  if (count == dicCodeList.length) callback(tmp);
}


// 通过字典项的值获取名称，对于可用过滤器的场合，可采用 commonFilter 中的 codeFilter
export function getNameByValue(v, dic) {
  const tmp = dic.find(item => item.itemValue == v);
  if (tmp) {
    return tmp.itemName;
  } else {
    // 查找下一层
    for (const item of dic) {
      if (item.childs) {
        const result = getNameByValue(v, item.childs);
        if (result) return result;
      }
    }
  }
  return null;
}

// 通过字典项的名称获取值
export function getValueByName(v, dic) {
  const tmp = dic.find(item => item.itemName == v);
  if (tmp) {
    return tmp.itemValue;
  } else {
    // 查找下一层
    for (const item of dic) {
      if (item.childs) {
        const result = getValueByName(v, item.childs);
        if (result) return result;
      }
    }
  }
  return null;
}

/**
 * 获取多级字典值
 * @param {*} values 父子各层级的值
 * @param {*} dic
 * @param {*} multivalue   与后台保持一致，未开启多值时，不主动拆分
 */
export function getNameByValues(values, dic, multivalue = false) {
  // let tempDic = dic;
  let tempDic = [...dic].reverse(); // 与下拉框及后台导出翻译保持一致，匹配最后一个
  let res = [];

  for (let index = 0; index < values.length; index++) {
    let value = values[index];
    value = "" + value;
    const valueArr = multivalue ? value.split(",") : [value];

    if (index == values.length - 1) {
      valueArr.forEach(v => {
        const item = tempDic.find(item => v == item.itemValue);
        if (item) {
          res.push(item.itemName);
        } else {
          res.push(v);
        }
      });
    } else {
      let tmp = [];
      for (let item of tempDic) {
        if (valueArr.includes(item.itemValue)) {
          if (item.childs) tmp = tmp.concat(item.childs);
        }
      }

      if (tmp.length > 0) tempDic = tmp;
    }
  }

  if (res.length > 0) return res.join(",");

  return null;
}

// 按层级解析多级字典
export function parseDicByLevel(dic, level = 0, res = []) {
  res[level] = [];
  let tmp_childs = [];
  for (let item of dic) {
    res[level].push(item);

    if (item.childs) {
      item.childs.forEach(child => {
        child.parents = [];
        if (item.parents) child.parents = child.parents.concat(item.parents);
        child.parents = child.parents.concat(item);
      })
      tmp_childs = tmp_childs.concat(item.childs);
    }
  }

  if (tmp_childs.length > 0) {
    parseDicByLevel(tmp_childs, level + 1, res);
  }

  return res;
}

/**
 * 根据某层级的值，查当前或其它层级的属性（支持多个，逗号分隔）
 * @param {*} parsedDic    按层级解析后的多级字典
 * @param {*} values       查询层的值（支持多个，逗号分隔）
 * @param {*} fromLevel    查询层
 * @param {*} toLevel      结果层
 * @param {*} multivalue   与后台保持一致，未开启多值时，不主动拆分
 * @param {*} returnProp   结果层的属性
 */
export function getLevelPropsByLevelValues(parsedDic, values, fromLevel, toLevel, multivalue = false, returnProp = "itemValue") {
  fromLevel = fromLevel - 1;
  toLevel = toLevel - 1;

  let parentLevel = fromLevel;
  let childsLevel = toLevel;

  if (fromLevel > toLevel) {
    parentLevel = toLevel;
    childsLevel = fromLevel;
  }

  if (values != null) values = "" + values;
  const valuesArr = multivalue ? values.split(",") : [values];

  let tmp = [];

  if (parsedDic[childsLevel]) {
    valuesArr.forEach(v => {
      // const tempDic = parsedDic[childsLevel];
      const tempDic = [...parsedDic[childsLevel]].reverse(); // 与下拉框及后台导出翻译保持一致，匹配最后一个

      if (fromLevel == toLevel) {       // 同层
        const item = tempDic.find(it => v == it.itemValue);
        if (item) {
          tmp.push(item[returnProp]);
        } else {
          tmp.push(v);
        }
      } else if (fromLevel < toLevel) {     // 父查子
        tempDic.forEach(it => {
          const parent = it.parents[parentLevel];
          if (parent && v == parent.itemValue) {
            tmp.push(it[returnProp]);
          }
          // 因涉及到提交数据，所以没有子的父被忽略
        });
      } else {     // 子查父
        const item = tempDic.find(it => v == it.itemValue);
        if (item) {
          const parent = item.parents[parentLevel];
          if (parent) {
            tmp.push(parent[returnProp]);
          }
        } else {
          tmp.push(v);
        }
      }
    });

    // 废弃原因：多值翻译时，若无匹配，会造成值丢失
    /* for (let item of parsedDic[childsLevel]) {
      if (fromLevel == toLevel) {       // 同层
        if (valuesArr.includes(item.itemValue)) {
          tmp.push(item[returnProp]);
        }
      } else if (fromLevel < toLevel) {     // 父查子
        const parent = item.parents[parentLevel];
        if (parent) {
          if (valuesArr.includes(parent.itemValue)) {
            tmp.push(item[returnProp]);
          }
        }
      } else {     // 子查父
        if (valuesArr.includes(item.itemValue)) {
          const parent = item.parents[parentLevel];
          if (parent) {
            tmp.push(parent[returnProp]);
          }
        }
      }
    } */

    if (tmp.length > 0) {
      tmp = [...new Set(tmp)];  // 去重（多个子级反查时，仅需一个父级）
      return tmp.join(",");
    }
  }

  return null;
}
