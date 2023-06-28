// 转化stream为可访问的url
const streamToUrl = (data) => {
  if (!Buffer.isBuffer(data)) {
    throw new Error('allowable type is arraybuffer');
  }
  const blob = new Blob([data], { type: 'application/octet-stream' });
  // 兼容不同浏览器的URL对象
  const url = window.URL || window.webkitURL || window.moxURL;
  // 创建下载链接
  return url.createObjectURL(blob);
};

// 下载文件
const downloadFileByUrl = ({ url, fileName }) => {
  if ('download' in document.createElement('a')) {
    const elink = document.createElement('a');
    elink.download = fileName;
    elink.style.display = 'none';
    elink.href = url;
    document.body.appendChild(elink);
    elink.click();
    URL.revokeObjectURL(elink.href);
    document.body.removeChild(elink);
  } else { // IE10+下载
    navigator.msSaveBlob(url, fileName);
  }
};
