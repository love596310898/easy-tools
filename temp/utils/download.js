import { Message } from 'element-ui';

/**
 * 文件下载, 对于下载链接可直接用 window.open(url, "_blank");
 * @param {*} data 二进制数据或base64编码 Blob、String
 * @param {*} fileName 下载的文件命名，可带扩展名，跨域下无效
 */
export function downloadFile(data, fileName) {
	let url = '';
	let isBolb = false;
	const errMsg = '下载出错，文件数据无法识别！';

	if (data instanceof Blob) {
		isBolb = true;
		url = window.URL.createObjectURL(data);
	} else if (typeof data === 'string') {
		// base64编码
		url = data;
	} else {
		Message.error(errMsg);
		return;
	}

	if ('download' in document.createElement('a')) {
		// 非IE下载
		const tmpLink = document.createElement('a');
		tmpLink.download = fileName || '';
		tmpLink.style.display = 'none';
		tmpLink.href = url;
		document.body.appendChild(tmpLink);
		tmpLink.click();
		window.URL.revokeObjectURL(tmpLink.href); // 释放URL 对象
		document.body.removeChild(tmpLink);
	} else {
		// IE10+下载
		if (isBolb) {
			window.navigator.msSaveBlob(data, fileName);
		} else {
			Message.error(errMsg);
			return;
		}
	}
}
