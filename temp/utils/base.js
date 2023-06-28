/* eslint-disable no-template-curly-in-string */
import router from '@/router';
import store from '@/store';
import httpRequest from '@/utils/httpRequest';
import { resolve, resolve3 } from '@/utils/apiFormat';
import qs from 'qs';
import dic from '@/api/sys/dic';
import { MessageBox, Message } from 'element-ui';

/**
 * 获取uuid
 */
export function getUUID() {
  // return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, c => (c === 'x' ? (Math.random() * 16) | 0 : 'r&0x3' | '0x8').toString(16));
}

/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth(key) {
  // key 为空字符串或不存在时
  if (!key) return true;
  return JSON.parse(sessionStorage.getItem('permissions') || '[]').indexOf(key) !== -1 || false;
}

// 是否 IE 浏览器
export function isIE() {
  if (!!window.ActiveXObject || 'ActiveXObject' in window) return true;
  return false;
}

/**
 * 链式结构转树型结构
 * @param {*} list  链式数组
 * @param {*} myId  数组元素id
 * @param {*} pId   父级id
 */
export function listToTree(list, myId = 'id', pId = 'parent') {
  function exists(list, parentId) {
    for (let i = 0; i < list.length; i++) {
      if (list[i][myId] === parentId) return true;
    }
    return false;
  }

  const nodes = [];

  // 顶层节点
  for (let i = 0; i < list.length; i++) {
    const row = list[i];
    if (!exists(list, row[pId])) {
      nodes.push(row);
    }
  }

  const toDo = [];

  for (let i = 0; i < nodes.length; i++) {
    toDo.push(nodes[i]);
  }

  while (toDo.length) {
    const node = toDo.shift(); // 父节点
    // 子节点数组
    for (let i = 0; i < list.length; i++) {
      const row = list[i];
      if (row[pId] === node[myId]) {
        if (node.children) {
          node.children.push(row);
        } else {
          node.children = [row];
        }
        toDo.push(row);
      }
    }
  }
  return nodes;
}

/**
 * 系统菜单用到的树形数据转换
 * @param {*} data
 * @param {*} id
 */
export function treeDataTranslate(data, id = 'id') {
  const res = [];
  const temp = {};
  for (let i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i];
  }
  for (let k = 0; k < data.length; k++) {
    if (temp[data[k].parent[id]] && data[k][id] !== data[k].parent[id]) {
      if (!temp[data[k].parent[id]].children) {
        temp[data[k].parent[id]].children = [];
      }
      if (!temp[data[k].parent[id]]._level) {
        temp[data[k].parent[id]]._level = 1;
      }
      data[k]._level = temp[data[k].parent[id]]._level + 1;
      temp[data[k].parent[id]].children.push(data[k]);
    } else {
      res.push(data[k]);
    }
  }
  return res;
}

/**
 * 清除登录信息
 */
export function clearLoginInfo() {
  // Vue.cookie.delete("token");
  // localStorage.clear();
  localStorage.removeItem('id');
  localStorage.removeItem('userName');
  sessionStorage.clear();
  store.commit('resetStore');
  router.options.hasDynamicRoutes = false;
  initGlobalCache();
  //在登出时会初始化vuex， 由于登录页面使用到了远程配置，必须重新获取远程配置
  store.dispatch('common/getRemoteConfig');
}

// 初始化内存全局缓存
export function initGlobalCache() {
  // dic 数据字典 cfgDic 属性（旧字典）
  window.globalCache = { dic: {}, cfgDic: {} };
}
// 对 url 中的变量进行解析
export function getParsedUrl(url) {
  let tmp = url;
  tmp = tmp.replace('${ip}', window.location.hostname);
  tmp = tmp.replace('${port}', window.location.port);
  return tmp;
}

/**
 * 对原始 url 进行修正
 * @param {*} url 原始url
 * @param {*} absolute 是否转换成绝对路径
 */
export function getfixedUrl(url, absolute = false) {
  if (/^http[s]?:\/\/.*/.test(url)) {
    // 绝对路径不转换
    return url;
  }
  let tmp = url;
  if (tmp.charAt(0) !== '/') {
    tmp = `/${tmp}`;
  }
  // 相对路径转成前端路由可识别的地址, 直接访问某些文件时除外
  if (!/\.(html|jpg|png)$/.test(url)) {
    tmp = `/#${tmp}`;
  }
  if (absolute) {
    tmp = `${window.location.protocol}//${window.location.host}${tmp}`;
  }
  return tmp;
}

// 树形数据排序 seq 序号 children 子节点
export function sortTreeData(treeData) {
  treeData = treeData.sort(
    (a, b) =>
      // 某个元素的 seq 不存在时，与前后元素比较时返回 NaN，排序会受影响
      a.seq - b.seq
  );

  treeData.map(item => {
    if (item.children) {
      sortTreeData(item.children);
    }
  });

  return treeData;
}

// 截取字符串并显示省略号
export function omitStr(str, len = 10, ellipsis = '...') {
  if (str && str.length && str.length > len) {
    return str.substring(0, len) + ellipsis;
  }
  return str;
}

// 元素相对于 body 的 offsetTop
export function getOffsetTopByBody(el) {
  let offsetTop = 0;
  while (el && el.tagName !== 'body') {
    offsetTop += el.offsetTop;
    el = el.offsetParent;
  }
  return offsetTop;
}

// 获取字符串显示时的宽高
export function textSize(text, fontSize = '12px', fontWeight = 'bold', fontFamily = 'Avenir, Helvetica, Arial, sans-serif') {
  const span = document.createElement('span');
  const result = {};
  result.width = span.offsetWidth;
  result.height = span.offsetHeight;
  span.style.visibility = 'hidden';
  span.style.fontSize = fontSize;
  span.style.fontWeight = fontWeight;
  span.style.fontFamily = fontFamily;
  span.style.display = 'inline-block';
  document.body.appendChild(span);
  if (typeof span.textContent !== 'undefined') {
    span.textContent = text;
  } else {
    span.innerText = text;
  }
  result.width = parseFloat(window.getComputedStyle(span).width) - result.width;
  result.height = parseFloat(window.getComputedStyle(span).height) - result.height;
  return result;
}

// 对象数组去重 arr key 去重属性值
export function reduceArr(arr, key) {
  // var obj = {};
  const hash = {};
  return arr.reduce((newArr, item, index, arr) => {
    // eslint-disable-next-line no-unused-expressions
    hash[item[key]] ? '' : (hash[item[key]] = true && newArr.push(item));
    return newArr;
  }, []);
}
// 下载公共方法（监测封堵）
export function impotFn_detection_plugging(url, params) {
  var urlstr = '';
  if (params) {
    const pstr = qs.stringify(params, { arrayFormat: 'repeat' });
    urlstr = '/service' + resolve3(url) + '?' + pstr;
  } else {
    urlstr = '/service' + resolve3(url);
  }
  window.open(urlstr, '_self');
  return true;
}
// 导出前校验，返回了1024就提示添加到了导出任务列表，否则直接导出
const checkType = (url, params) =>
  httpRequest({
    url: resolve(url),
    method: 'get',
    params
  });
// 计算菜单索引
export const calculateMenuIndex = valueName => {
  let menuArr = window.sessionStorage.getItem('menuList');
  let menuIndex = window.sessionStorage.getItem('topMenuActivedIndex');
  if (JSON.parse(menuArr).length) {
    menuIndex = JSON.parse(menuArr).findIndex(item => {
      return item.name === valueName;
    });
  } else {
    Message('没有权限！');
  }
  return menuIndex;
};
// 下载公共方法
export async function impotFn(url, params) {
  if (store.state.flag) {
    Message({
      message: '请勿重复操作！',
      type: 'warning'
    });
    return false;
  }
  store.commit('setFlag', true);
  // Message('请求已发送，请稍等！');
  let res = await checkType(url, params);
  if (res === 'downloading') {
    MessageBox.confirm('已将导出任务添加到任务列表，待文件生成后即可下载', '提示', {
      confirmButtonText: '跳转到任务列表',
      cancelButtonText: '取消',
      type: 'info'
    }).then(() => {
      // 获取菜单索引
      let menuIndex = calculateMenuIndex('系统管理');
      // 菜单跳转
      store.commit('theme/changeTopMenu', menuIndex);
      router.push('/export-task-list');
    });
  } else {
    let urlstr = '';
    if (params) {
      const pstr = qs.stringify(params, { arrayFormat: 'repeat' });
      urlstr = `/service${resolve(url)}?${pstr}`;
    } else {
      urlstr = `/service${resolve(url)}`;
    }
    window.open(urlstr, '_self');
    return true;
  }
  store.commit('setFlag', false);
}
// 文件导入
export function fileuploadUrl(link) {
  if (!link) return '';
  const url = `/service/zuul${resolve(link)}`;
  return url;
}

//  获取数据字典
export function getdic(dicname) {
  const dicQuery = async dicname => {
    const data = await dic.getList({ code: dicname });
    const dicId = data.list[0].id;
    const data2 = await dic.getCode(dicId);
    return data2;
    // dicTree(dicId);
  };
  // const dicTree = async (dicId) => { // 获取系统名称为字典中第一个
  //     const data = await dic.getCode(dicId);
  //     console.log('data', data);
  //     return data;
  // };
  return dicQuery(dicname);
}
