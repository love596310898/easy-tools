// 对数据源中的单表进行操作
import httpRequest from "./httpRequest";
import { encryptAES, decryptAES } from "./dess";

window.encryptAES = encryptAES;
window.decryptAES = decryptAES;

const prefix = window.globalConfig.bi_query_useGateway ? "/everbi" : "";
const url = prefix + "/singletable/table";

export default {
  getList(o, cancel) {
    //console.log("查看视频请求参数",o);
    return httpRequest({
      url: url + "/get?_t=" + new Date().getTime(),
      method: "post",
      data: {
        dsId: o.dsId || window.globalConfig.bi_query_dsId,
        tblType: o.tblType || "TABLE",
        ...o,
        tableName: encryptAES(o.tableName)
      },
      cancel
    });
  },
  batchDelete(o, cancel) {
    return httpRequest({
      url: url + "/batch",
      method: "delete",
      data: o,
      cancel
    });
  },
  insert(o, cancel) {
    return httpRequest({
      url: url,
      method: "put",
      data: {
        dsId: o.dsId || window.globalConfig.bi_query_dsId,
        ...o,
        tableName: encryptAES(o.tableName)
      },
      cancel
    });
  },
  update(o, cancel) {
    return httpRequest({
      url: url + "?t=" + new Date().getTime(),
      method: "post",
      data: {
        dsId: o.dsId || window.globalConfig.bi_query_dsId,
        ...o,
        tableName: encryptAES(o.tableName)
      },
      cancel
    });
  },
  exportExcel(o, cancel) {
    return httpRequest({
      url: url + "/exportExcel?_t=" + new Date().getTime(),
      method: "post",
      data: o,
      cancel,
      headers: {
        'E-AUTH-APP-KEY': 'space-five-server',
        'E-AUTH-PRMSN-KEY': o.permissionKey
      }
    });
  },
  fullDistribution() {
    return httpRequest({
      url: "detection-plugging/instructions/sendRule",
      method: "get",
    });
  },
  fullDistributionAdd(o) {
    return httpRequest({
      url: "detection-plugging/instructions/save",
      method: "put",
      params: {
        ...o
      },
    });
  },
  importUrl: window.globalConfig.defaultProxyPath + '/zuul/everbi/singletable/table/import?t=' + new Date().getTime(),
  createConditions(name, type, value) {
    return {
      fieldName: name,
      conditionExpressions: [
        {
          operator: type,
          values: Array.isArray(value) ? value : [value]
        }
      ]
    }
  }
};
