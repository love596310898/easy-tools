/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
import qs from 'qs';
import axios from 'axios';
import store from '@/store';
import router from '@/router';
import { Message } from 'element-ui';
import { _typeof } from './utils';

const production = process.env.NODE_ENV === 'production';

const http = axios.create({
    baseURL: store.state.defaultProxyPath,
    withCredentials: true,
});

// 拦截 发
http.interceptors.request.use((config) => {
    if (config.method.toLowerCase() === 'get') {
        config.params = config.params || {};
        config.params.v = +new Date();
    }
    config.url = formateAlias(config.url);
    // 表单
    if (config.headers['Content-Type'] && config.headers['Content-Type'].indexOf('application/x-www-form-urlencoded') !== -1) {
        config.data = _typeof(config.data) === 'Formdata' ? config.data : qs.stringify(config.data);
    }

    if (production) {
        if (!navigator.onLine) {
            return Promise.reject(new Error('未连接网络，请检查网络！'));
        }
        return config;
    }
    return config;
}, (error) => Promise.reject(error));

// 收
http.interceptors.response.use((response) => {
    if (+response.data.code === 200) {
        return Promise.resolve(response.data);
    } if (+response.data.code === -999) {
        // 未登录
        store.commit('LOGIN_OUT');
        Message.warning('系统超时，请重新登录！');
        router.replace({
            path: '/search',
            query: {
                // redirect: router.currentRoute.fullPath
            },
        });
        return Promise.resolve(response.data);
    } if (response.data && response.data.code !== undefined && response.data.code !== 200) {
        if (response.data.message) {
            Message.error(response.data.message);
        } else {
            Message.error('数据获取失败');
        }
        return Promise.reject(response.data);
    }
    return Promise.reject(response.data);
}, (error) => {
    if (error.response) {
        let msg = '';
        switch (error.response.status) {
        case 400:
            msg = '请求错误(400)';
            break;
        case 401:
            msg = '未授权，请重新登录(401)';
            break;
        case 403:
            msg = '拒绝访问(403)';
            break;
        case 404:
            msg = '请求出错(404)';
            break;
        case 408:
            msg = '请求超时(408)';
            break;
        case 500:
            msg = '服务器错误(500)';
            break;
        case 501:
            msg = '服务未实现(501)';
            break;
        case 502:
            msg = '网络错误(502)';
            break;
        case 503:
            msg = '服务不可用(503)';
            break;
        case 504:
            msg = '网络超时(504)';
            break;
        case 505:
            msg = 'HTTP版本不受支持(505)';
            break;
        default:
            msg = `连接出错(${error.response.status})!`;
        }
        return Promise.reject(new Error(msg));
    }
    if (error.message) {
        Message.error(error.message);
    }
    return Promise.reject(error);
});

export const fetch = http;

// 格式化baseURL alias
export const formateAlias = (url) => {
    const alais = store.state.baseUrlAlais;
    Object.keys(alais).forEach(item => {
        const reg = new RegExp(`^${item}`, 'i');
        url = url.replace(reg, alais[item]);
    });
    return url;
};

export const apiFormat = (str, res) => {
    const reg = /\{(\w+?)\}/gi;
    return str.replace(reg, ($0, $1) => res[$1]);
};
