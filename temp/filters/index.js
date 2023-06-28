/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
/**
 * 作者：Air.叶
 * 时间：2019-10-01
 * 描述：filter
 */

import Vue from 'vue';

// 身份证脱敏处理
Vue.filter('immunizingId', value => {
    if(!window.globalConfig.isNeedImmunizing) return value;
    if (value) {
        return String(value).replace(/(?<=\d{4})\w(?=\w{4})/g, '*')
    } else {
        return value;
    }
})
// 手机号脱敏
Vue.filter('immunizingPhone', value => {
    if (value) {
        return String(value).replace(/(?<=\d{3})\w(?=\w{4})/g, '*')
    } else {
        return value;
    }
})
export const requireAll = requireContext => {
    const resource = {};
    requireContext.keys().forEach(item => {
        const src = item.replace(/(?:.*?)(\w+)\.js$/, '$1');
        const result = requireContext(item);
        resource[src] = 'default' in result ? result.default : result;
    });
    return resource;
};

const modules = requireAll(require.context('./src', false, /\.js$/));

for (const i in modules) {
    if (modules.hasOwnProperty(i)) {
        Vue.use(modules[i]);
    }
}

