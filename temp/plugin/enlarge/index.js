/**
 * 作者：Air.叶
 * 时间：2018-01-10
 * 描述：图片放大
 */
import { $enlarge } from './enlarge.js';

const install = Vue => {
	Vue.prototype.$enlarge = $enlarge;
};

export default install;
