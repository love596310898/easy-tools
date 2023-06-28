import axios from 'axios';
import qs from 'qs';

/**
 * 主要用于api的调用 页面正常请求请用httpRequest.js
 */
const http = axios.create({
    timeout: 1000 * 30,
    withCredentials: true,
});

/**
 * 请求拦截
 */
http.interceptors.request.use(
    (conf) => {
        // get 请求加上随机数
        if (conf.method === 'get') {
            conf.params = {
                t: new Date().getTime(),
                ...conf.params,
            };
        }

        if (!conf.baseURL) {
            conf.baseURL = globalConfig.defaultProxyPath;
        }

        if (
            conf.headers['Content-Type']
			&& conf.headers['Content-Type'].indexOf('application/x-www-form-urlencoded') !== -1
        ) {
            conf.data = qs.stringify(conf.data);
        }

        return conf;
    },
    (error) => Promise.reject(error),
);

/**
 * 响应拦截
 */
http.interceptors.response.use(
    (res) => res.data,
    (err) => {
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
            err.message = '连接服务器失败!';
        }
        return Promise.reject(err);
    },
);

export default http;
