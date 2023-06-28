// baseURL 经行resolve

// 云平台旧api服务关键字拼接
// export const resolve = str => `/space-five-server${str}`;
export const resolve = str => `/space-five-server${str}`;

// 云平台新的api服务服务关键字拼接
export const resolveSass = str => `/space-five-saas-server${str}`;

// 第五空间旧模块服务关键字拼接
export const resolve3 = str => {
  const baseUrlAlias = {
    '@report': '/police_denounce_platform',
    '@plugging': '/detection-plugging',
    '@network': '/network_fraud_warning',
    '@system': '/system'
  };
  if (str.indexOf('@') > -1) {
    Object.keys(baseUrlAlias).forEach(item => {
      const reg = new RegExp(`^${item}`, 'i');
      str = str.replace(reg, baseUrlAlias[item]);
    });
    return str;
  }
  return baseUrlAlias['@network'] + str;
};

// api进行format
export const apiFormat = (str, opt) => resolve(str).replace(/\{(\w+?)\}/gi, (_, $1) => opt[$1]);

// 下载文件的路径加工
export const joinFileDownloadPath = str => window.globalConfig.defaultProxyPath + str;
