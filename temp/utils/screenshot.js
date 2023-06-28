import html2canvas from 'html2canvas';
import { downloadFile } from './download';

/**
 * 屏幕元素截图成 png
 * domSelector 元素选择器
 * imgName 生成截图的文件名
 */
export function capturePng (domSelector = 'body', imgName = '截图') {
	const dom = document.querySelector(domSelector);
	// console.log(dom);
	const bgColor = window.getComputedStyle(document.body).backgroundColor;

	/**
	 * html2canvas 不完全支持全部 css，所以做出了调整：
	 * 1. grid-layout 设置 use-css-transforms 为 false
	 * 2. 驾驶舱背景图逻辑调整，解决背景图定位、大小不准，留边等问题
	 * 3. 不支持渐变文字填充 -webkit-text-fill-color
	 */
	return html2canvas(dom, {
		backgroundColor: bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent' ? 'white' : bgColor,
		useCORS: true
	}).then(canvas => {
		let data;
		if ('download' in document.createElement('a')) {
			data = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
		} else {
			// IE10+
			data = canvas.msToBlob();
		}

		downloadFile(data, imgName + '.png');
	});
}
