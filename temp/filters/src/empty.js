/**
 * 作者：Air.叶
 * 时间：2019-10-01
 * 描述：empty
 */

import { isEmpty } from 'lodash';

const install = Vue => {
    Vue.filter('isEmpty', val => (isEmpty(val) ? '-' : val));
};

export default install;
