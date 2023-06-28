import axios from 'axios';
import cloneDeep from 'lodash/cloneDeep';
import pathToRegexp from 'path-to-regexp';
import { message } from 'antd';
import qs from 'qs';
import Cookie from 'js-cookie';
import { jumpLogin } from 'utils/auth';

// 默认请求类型
const defaultContentType = 'application/json';
// 请求列队
const xhrQueue = [];
const delXhrQueue = (url) => {
  const idx = xhrQueue.findIndex((i) => url.search(i) > -1);
  xhrQueue.splice(idx, 1);
};
// 请求拦截器
axios.interceptors.request.use((req) => {
  if (!req.ignoreQueen) {
    if (xhrQueue.includes(req.url)) {
      return null;
    }
    xhrQueue.push(req.url);
  }
  if (req.method === 'post' && req.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    req.data = qs.stringify(req.data, { arrayFormat: 'brackets' });
  } else if (req.method === 'get') {
    const { url } = req;
    const t = new Date().getTime();
    if (url.indexOf('?') >= 0) {
      req.url = `${url}&t=${t}`;
    } else {
      req.url = `${url}?t=${t}`;
    }
  }
  if (req.getToken) {
    return req;
  }
  const token = Cookie.get('token');
  const tokenType = Cookie.get('token_type');
  if (token) {
    req.headers.Authorization = `${tokenType} ${token}`;
  }
  return req;
});
// 响应拦截器
axios.interceptors.response.use((response) => {
  const {
    ContentType,
    url,
    ignoreMsg = false, // true 拒绝公共显示信息
    ignoreSuccessMsg = true, // true 拒绝成功提示信息
    ignoreLogin = false, // true 拒绝登录跳转
    allResponseData,
  } = response.config;
  // 去除拦截
  delXhrQueue(url);
  if (allResponseData) {
    return {
      ...response,
    };
  }
  const code = response.data.code ? response.data.code * 1 : response.data.code;
  const contentType = response.headers['content-type'];
  switch (code) {
    case 200:
      !ignoreMsg && !ignoreSuccessMsg && message.success(response.data.msg || '操作成功');
      return {
        ...response.data,
        success: true,
      };
    case 600: // 业务异常
      message.destroy();
      !ignoreMsg && message.error(response.data.msg || '业务异常');
      return {
        ...response.data,
        success: false,
      };
    case 500: // 系统异常
      message.destroy();
      !ignoreMsg && message.error(response.data.msg || '系统异常');
      break;
    case 401:
      message.destroy();
      if (!ignoreLogin) {
        message.error('尚未登录请重新登录').then(() => {
          jumpLogin();
        });
        // JumpToLogin()
      }
      break;
    case 403:
      message.destroy();
      if (!ignoreLogin) {
        message.error('没有权限查看');
        // JumpToLogin()
      }
      break;
    default:
      if (contentType && contentType === 'application/octet-stream') { // 后端返回二进制流的情况下 response.data中不存在code字段
        return response;
      }
      !ignoreMsg && message.error(response.data.msg || '未定义的异常');
      break;
  }
  return response.data;
}, (error) => {
  const { response } = error;
  // 去除拦截
  delXhrQueue(response.config.url);
  switch (response.status) {
    case 400:
      message.error('请求无效');
      break;
    case 401:
      message.destroy();
      message.error('未登录, 即将跳转登录').then(() => {
        jumpLogin();
      });
      break;
    case 403:
      message.destroy();
      message.error('当前没有权限查看');
      break;
    case 404:
      message.destroy();
      message.error('请求未找到');
      break;
    case 500:
      message.destroy();
      message.error('请求被拒绝');
      break;
    case 504:
      message.error('请求超时，请稍后再试');
      break;
    default:
      message.error('未定义的请求异常');
      break;
  }
  return Promise.reject(error);
});

const fetch = (options) => {
  const { method = 'post', data, config } = options;
  let { url } = options;
  axios.defaults.headers['Content-Type'] = (config && config.ContentType) ? config.ContentType : defaultContentType;
  const cloneData = cloneDeep(data);
  try {
    let domin = '';
    if (url.match(/[a-zA-z]+:\/\/[^/]*/)) {
      [domin] = url.match(/[a-zA-z]+:\/\/[^/]*/);
      url = url.slice(domin.length);
    }
    const match = pathToRegexp.parse(url);
    url = pathToRegexp.compile(url)(data);
    Object.keys(match).forEach((item) => {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name];
      }
    });
    url = domin + url;
  } catch (e) {
    message.error(e.message);
  }
  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, {
        params: cloneData,
        ...config,
      });
    case 'put':
      return axios.put(url, cloneData, { ...config });
    case 'delete':
      return axios.delete(url, {
        data: cloneData,
        ...config,
      });
    default:
      return axios.post(url, cloneData, { ...config });
  }
};

export default function request(options) {
  return fetch(options).then((response) => ({
    ...response,
  })).catch((e) => {
    console.log('请求抛出的异常信息', e, options);
    return { message: '请求异常' };
  });
}
