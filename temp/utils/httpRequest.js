/* eslint-disable no-param-reassign */
import axios from 'axios';
import router from '@/router';
import qs from 'qs';
import { Message } from 'element-ui';
import store from '@/store';
import debounce from 'lodash/debounce';
import { clearLoginInfo } from './base';
// import config from "@/config";
//  判断类型
// const _typeof = (str) => {
//     return ({}).toString.call(str).slice(8, -1);
// };
const showErrorMsg = debounce(msg => Message.error(msg), 300);
const msg = res => `${res.code}:${res.message}`;


const http = axios.create({
  // baseURL: config.defaultProxyPath,
  // timeout: 1000 * 30,
  timeout: 1000 * 3600 * 2,
  withCredentials: true
  /* headers: {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
  } */
});

// 写入通讯异常日志
const pushRequestError = info => {
  store.commit('error/pushRequestError', info);
};

// 写入业务异常日志
const pushCodeError = res => pushRequestError({ ...res.data, body: res.data.body !== undefined ? JSON.stringify(res.data.body).slice(0, 500) : undefined });

/**
 * 请求拦截
 */
http.interceptors.request.use(
  conf => {
    // 生成取消请求的 token/cancel
    conf.cancelToken = new axios.CancelToken(cancel => {
      /**
       * conf.cancel 是自定义回调函数，必要时页面可以通过回调拿到单个token，取消单个请求
       * 示例：请求时传入与url同级的参数 cancel：cancel => (this.getListCancel = cancel)
       * 调用 this.getListCancel && this.getListCancel(); 取消上次请求
       * 注意 getListCancel 需要定义在实例上（如组件的data中），而不是api中，避免一个页面请求两个相同的api时，前一个请求被取消
       */
      if (conf.cancel) conf.cancel(cancel);
      /**
       * 之前为每个页面的所有请求生成一个token，取消所有请求时一次取消，但不能满足对单个请求取消的场景
       * 所以改成为每个请求生成一个token，用数组来保存，取消所有请求时遍历取消
       */
      window.globalCache.requestCancels = window.globalCache.requestCancels || [];
      window.globalCache.requestCancels.push(cancel);
    });

    // get 请求加上随机数
    if (conf.method === 'get') {
      conf.params = {
        t: new Date().getTime(),
        ...conf.params
      };
    }
    if (!conf.baseURL) {
      conf.baseURL = window.globalConfig.defaultProxyPath;
    }

    // application/x-www-form-urlencoded 请求的数据进行序列化
    // console.log(conf.headers['Content-Type'])
    if (conf.headers['Content-Type'] && conf.headers['Content-Type'].indexOf('application/x-www-form-urlencoded') !== -1) {
      conf.data = qs.stringify(conf.data);
    }
    // 后台使用多个微服务的情况下，日志统一记录到 space-five-server app下
    if (!conf.headers['E-AUTH-APP-KEY']) {
      conf.headers['E-AUTH-APP-KEY'] = 'space-five-server'
    }
    return conf;
  },
  error => Promise.reject(error)
);

/**
 * 响应拦截
 */
http.interceptors.response.use(res => {
  // 401, 用户session失效
  if (res.data && (res.data.code === 401 || res.data.code === -999)) {
    // 只有已打开的页面（获取过菜单）才出现提示，避免新打开的页面出现
    // 新打开的页面也不使用此处的跳转到login，因为 router.currentRoute.path 不符合预期
    // 新开大屏页直接推出登录
    if (router.currentRoute && router.currentRoute.path != '/' || router.currentRoute.meta.openMode == '_blank') {
      // 防止login界面的请求 重复导航到login时抛出错误
      if (router.currentRoute.name !== 'login') {
        router.push({
          name: 'login',
          params: { target: router.currentRoute.path }
        });
      }
    }
    // 触发父级退出（当前系统被嵌入同框架下另一个系统时）
    if (document.referrer) {
      parent.postMessage(
        {
          msg: 'onLogout',
          payload: {
            needLogout: false,
            message: res.data.message
          }
        },
        document.referrer
      );
    }
    clearLoginInfo();
  }
  if (res.data && res.data.code !== undefined && res.data.code != 200) {
    pushCodeError(res);
    showErrorMsg(res.data.message);
    return Promise.reject(msg(res.data));
  } else {
    return res.data.body !== undefined ? res.data.body : res.data;
  }
},
  err => {
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = '请求错误(400)';
          break;
        case 401:
          err.message = '未授权，请重新登录(401)';
          break;
        case 403:
          err.message = '拒绝访问(403)';
          break;
        case 404:
          err.message = '请求出错(404)';
          break;
        case 408:
          err.message = '请求超时(408)';
          break;
        case 500:
          err.message = '服务器错误(500)';
          break;
        case 501:
          err.message = '服务未实现(501)';
          break;
        case 502:
          err.message = '网络错误(502)';
          break;
        case 503:
          err.message = '服务不可用(503)';
          break;
        case 504:
          err.message = '网络超时(504)';
          break;
        case 505:
          err.message = 'HTTP版本不受支持(505)';
          break;
        default:
          err.message = `连接出错(${err.response.status})!`;
      }
    } else {
      if (/Network\sError/i.test(err.message)) {
        err.message = '网络错误';
      } else if (/timeout\sof/.test(err.message)) {
        err.message = '网络请求超时';
      }
    }

    if (err.message) {
      Message.error(err.message);
    }
    const data = err.response && err.response.data;
    if (data) {
      pushRequestError({
        timestamp: data.timestamp,
        code: data.status,
        message: err.message,
        body: data.path
      });
    }
    return Promise.reject(err);
  }
);

export default http;
