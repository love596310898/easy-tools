/**
 * 作者：Air.叶
 * 时间：2020-03-05
 * 描述：媒体放大
 */
import Vue from 'vue';
import enlargeMedia from './enlargeMedia.vue';
const TransfrEnlarge = Vue.extend(enlargeMedia);

export const $enlargeMedia = (() => {
	let transfr = new TransfrEnlarge().$mount();
	document.body.appendChild(transfr.$el);
	return transfr;
})();
