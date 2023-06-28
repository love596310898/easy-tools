/**
 * 作者：Air.叶
 * 时间：2018-01-10
 * 描述：图片放大
 */
import Vue from 'vue';
import enlarge from './enlarge.vue';
const TransfrEnlarge = Vue.extend(enlarge);

export const $enlarge = (() => {
	let transfr = new TransfrEnlarge().$mount();
	document.body.appendChild(transfr.$el);
	return transfr;
})();
