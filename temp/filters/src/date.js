/**
 * 作者：Air.叶
 * 时间：2018-04-02
 * 描述：date.js
 */

import { formatTime } from '@/utils/time';

const install = Vue => {
    Vue.filter('dateFormat', (val, fmt) => formatTime(val, fmt || 'yyyy-MM-dd hh:mm:ss'));
};

export default install;
