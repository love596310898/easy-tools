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
        console.error(errMsg);
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
            console.error(errMsg);
        }
    }
}

export function downloadFileByUrl(url, fileName) {
    if (window.open instanceof Function) {
        window.open(url, '_self');
    } else {
        let tmpLink = document.createElement('a');
        if ('download' in tmpLink) {
            // 非IE下载
            tmpLink.download = fileName || '';
            tmpLink.style.display = 'none';
            tmpLink.href = url;
            document.body.appendChild(tmpLink);
            tmpLink.click();
            window.URL.revokeObjectURL(tmpLink.href); // 释放URL 对象
            document.body.removeChild(tmpLink);
        } else {
            window.location.href = url;
        }
        tmpLink = null;
    }
}

// 保存流文件
export const saveStream = (blob, filename) => {
    if ('msSaveOrOpenBlob' in window.navigator) {
        navigator.msSaveBlob(blob, filename);
    } else {
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }
};
