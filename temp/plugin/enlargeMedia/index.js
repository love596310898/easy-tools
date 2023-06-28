/**
 * 作者：Air.叶
 * 时间：2018-01-10
 * 描述：媒体放大
 */
import { $enlargeMedia } from './enlargeMedia.js';

const install = Vue => {
	Vue.prototype.$enlargeMedia = $enlargeMedia;
};

export default install;
